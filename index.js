#!/usr/bin/env node

import deepmerge from 'deepmerge';
import { createSpinner } from 'nanospinner';
import reporter from 'vfile-reporter';

import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

import defaultAppConfig from './.languagetoolrc.js';

import checkJavaInstalled from './lib/check-java-installed.js';
import createVfile from './lib/create-vfile.js';
import findConfig from './lib/find-config.js';
import generateReport from './lib/generate-report.js';
import { error, info } from './lib/log.js';
import startLanguageToolServer from './lib/start-language-tool-server.js';

if (!checkJavaInstalled()) {
	error('To use this command-line tool you need to install a JDK.');
	info('Please visit the Java Developer Kit download website: https://www.java.com');
	process.exit(1);
}

const currentConfigPath = pathToFileURL(findConfig());
const currentConfig = await import(currentConfigPath);
const currentConfigData = currentConfig.default;

const combineMerge = (target, source, options) => {
	const destination = target.slice();

	source.forEach((item, index) => {
		if (typeof destination[index] === 'undefined') {
			destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
		} else if (options.isMergeableObject(item)) {
			destination[index] = deepmerge(target[index], item, options);
		} else if (target.indexOf(item) === -1) {
			destination.push(item);
		}
	});

	return destination;
};

const appConfig = deepmerge(defaultAppConfig, currentConfigData, { arrayMerge: combineMerge });

const processArgs = process.argv.slice(2);

let files = [];

if (!process.stdin.isTTY && process.platform !== 'win32') {
	// When Git BASH terminal is used we can't get data from STDIN.
	// That's why it's turned off here, and it's impossible to use STDIN in Windows.
	files.push(createVfile());
} else {
	files = processArgs
		.filter(file => fs.existsSync(file))
		.map(createVfile);
}

if (files.length) {
	check(files);
}

async function check(vfiles) {
	const spinner = createSpinner().start({ text: 'Processing...' });

	try {
		const { port } = await startLanguageToolServer();

		for (const vfile of vfiles) {
			const response = await fetch(`http://127.0.0.1:${port}/v2/check`, { // eslint-disable-line no-await-in-loop
				method: 'POST',
				body: new URLSearchParams({
					language: 'auto',
					text: String(vfile.value),
				}).toString(),
			});

			const { matches } = await response.json(); // eslint-disable-line no-await-in-loop

			const filteredMatches = matches.filter(match => {
				const ctx = match.context;
				const badWord = ctx.text.slice(ctx.offset, ctx.offset + ctx.length);

				return !appConfig.ignore.some(goodWord => RegExp(`^${goodWord}$`, 'i').test(badWord));
			});

			if (filteredMatches.length) {
				generateReport({ matches: filteredMatches, vfile });
				process.exitCode = 1;
			}
		}

		spinner.clear();
		console.log(reporter(vfiles, { quiet: true }));
	} catch (err) {
		spinner.clear();
		error(err);
		process.exitCode = 1;
	}

	process.exit();
}

process.on('unhandledRejection', error);
