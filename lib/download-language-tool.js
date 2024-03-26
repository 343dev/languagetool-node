import ProgressBar from 'progress';

import fs from 'node:fs';
import { Readable } from 'node:stream';

import formatBytes from './format-bytes.js';
import getFileMD5Hash from './get-file-md5-hash.js';
import { info, success } from './log.js';

function downloadLanguageTool({ url, md5, savePath } = {}) {
	return new Promise(async (resolve, reject) => { // eslint-disable-line no-async-promise-executor
		info(`Getting LanguageTool from: ${url} ...`);

		if (fs.existsSync(savePath) && await getFileMD5Hash(savePath) === md5) {
			success('Done! Already downloaded');

			resolve();
		}

		const writeStream = fs.createWriteStream(savePath);

		writeStream
			.on('error', reject)
			.on('close', async () => {
				if (await getFileMD5Hash(savePath) !== md5) {
					return reject(new Error('File checksum mismatch'));
				}

				success('Done!');

				resolve();
			});

		try {
			const response = await fetch(url);
			const responseData = Readable.fromWeb(response.body);

			const contentLength = Number.parseInt(response.headers.get('content-length'), 10);
			const bar = new ProgressBar(
				`  downloading [:bar] :percent of ${formatBytes(contentLength)} | :etas ETA`,
				{
					complete: '=',
					incomplete: ' ',
					width: 20,
					total: contentLength,
				});

			responseData.on('data', chunk => bar.tick(chunk.length));
			responseData.pipe(writeStream);
		} catch (error) {
			writeStream.destroy();
			fs.unlinkSync(savePath);
			reject(error);
		}
	});
}

export default downloadLanguageTool;
