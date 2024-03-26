#!/usr/bin/env node

import deepmerge from 'deepmerge';
import { createSpinner } from 'nanospinner';
import { reporter } from 'vfile-reporter';

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
	const destination = [...target];

	for (const [index, item] of source.entries()) {
		if (destination[index] === undefined) {
			destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
		} else if (options.isMergeableObject(item)) {
			destination[index] = deepmerge(target[index], item, options);
		} else if (!target.includes(item)) {
			destination.push(item);
		}
	}

	return destination;
};

const appConfig = deepmerge(defaultAppConfig, currentConfigData, { arrayMerge: combineMerge });

const processArguments = process.argv.slice(2);

let files = [];

if (!process.stdin.isTTY && process.platform !== 'win32') {
	// When Git BASH terminal is used we can't get data from STDIN.
	// That's why it's turned off here, and it's impossible to use STDIN in Windows.
	files.push(createVfile());
} else {
	files = processArguments
		.filter(file => fs.existsSync(file))
		.map(createVfile); // eslint-disable-line unicorn/no-array-callback-reference
}

if (files.length > 0) {
	await check(files);
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
				const { context } = match;
				const badWord = context.text.slice(context.offset, context.offset + context.length);

				return !appConfig.ignore.some(goodWord => new RegExp(`^${goodWord}$`, 'i').test(badWord));
			});

			if (filteredMatches.length > 0) {
				generateReport({ matches: filteredMatches, vfile });
				process.exitCode = 1;
			}
		}

		spinner.clear();
		console.log(reporter(vfiles, { quiet: true }));
	} catch (error_) {
		spinner.clear();
		error(error_);
		process.exitCode = 1;
	}

	process.exit();
}

process.on('unhandledRejection', error);
