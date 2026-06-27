#!/usr/bin/env node
/* eslint-disable n/no-process-exit -- the CLI intentionally controls its exit codes */

import deepmerge from 'deepmerge';
import { createSpinner } from 'nanospinner';
import { reporter } from 'vfile-reporter';

import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

import defaultAppConfig from './.languagetoolrc.js';

import createVfile from './lib/create-vfile.js';
import findConfig from './lib/find-config.js';
import generateReport from './lib/generate-report.js';
import { error, info } from './lib/log.js';

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

const languageToolBaseUrl = String(appConfig.languageTool.url).replace(/\/+$/, '');
const checkEndpoint = `${languageToolBaseUrl}/v2/check`;

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
		for (const vfile of vfiles) {
			let response;
			try {
				response = await fetch(checkEndpoint, {
					method: 'POST',
					body: new URLSearchParams({
						language: 'auto',
						text: String(vfile.value),
					}).toString(),
				});
			} catch (error_) {
				spinner.clear();
				error(`Cannot reach the LanguageTool service at "${languageToolBaseUrl}".`);
				info('Start a LanguageTool HTTP service externally (e.g. a LanguageTool Docker image) or configure it in your ~/.languagetoolrc.js:');
				info('{ languageTool: { url: \'http://127.0.0.1:8081\' } }');
				info(`Original error: ${error_.message}`);
				process.exitCode = 1;
				process.exit();
			}

			if (!response.ok) {
				spinner.clear();
				error(`LanguageTool service at "${checkEndpoint}" responded with HTTP ${response.status} ${response.statusText}.`);
				info('Check that the configured service is healthy or adjust languageTool.url in your ~/.languagetoolrc.js.');
				process.exitCode = 1;
				process.exit();
			}

			const { matches } = await response.json();

			const filteredMatches = matches.filter((match) => {
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
