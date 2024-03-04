#!/usr/bin/env node

const deepmerge = require('deepmerge');
const fs = require('fs');
const { createSpinner } = require('nanospinner');
const os = require('os');
const path = require('path');
const reporter = require('vfile-reporter');

const checkJavaInstalled = require('./lib/check-java-installed');
const createVfile = require('./lib/create-vfile');
const generateReport = require('./lib/generate-report');
const { error, info } = require('./lib/log');
const startLanguageToolServer = require('./lib/start-language-tool-server');

if (!checkJavaInstalled()) {
	error('To use this command-line tool you need to install a JDK.');
	info('Please visit the Java Developer Kit download website: https://www.java.com');
	process.exit(1);
}

const configName = '.languagetoolrc.js';
const defaultConfig = require(`./${configName}`);
const externalConfigPath = path.join(os.homedir(), configName);
const appConfig = fs.existsSync(externalConfigPath)
	? deepmerge(defaultConfig, require(externalConfigPath))
	: defaultConfig;

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
					text: String(vfile.contents),
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
