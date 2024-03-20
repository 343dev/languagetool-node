#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import url from 'node:url';

import appConfig from './.languagetoolrc.js';

import downloadLanguageTool from './lib/download-language-tool.js';
import { error, info, success } from './lib/log.js';
import unzipFile from './lib/unzip-file.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

install();

async function install() {
	try {
		const { url: zipUrl, md5 } = appConfig.downloadUrls.stable;

		const urlParts = url.parse(zipUrl, true);
		const { base, name } = path.parse(decodeURIComponent(urlParts.pathname));

		const savePath = path.resolve(fs.realpathSync(os.tmpdir()), base);
		const installPath = __dirname;
		const finalPath = path.join(installPath, 'languagetool');

		if (fs.existsSync(finalPath)) {
			return;
		}

		console.log();
		await downloadLanguageTool({ url: zipUrl, md5, savePath });

		console.log();
		await unzipFile(savePath, installPath);

		console.log();
		info(`Rename "${name}" to "languagetool" ...`);
		fs.renameSync(path.resolve(installPath, name), finalPath);
		success('Done!');

		console.log();
		info('Remove temp files ...');
		fs.unlinkSync(savePath);
		success('Done!');
	} catch (err) {
		error(err);
		process.exit(1);
	}
}
