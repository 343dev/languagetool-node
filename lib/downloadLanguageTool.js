const fs = require('fs');
const ProgressBar = require('progress');
const { Readable } = require('stream');

const formatBytes = require('./formatBytes');
const getFileMD5Hash = require('./getFileMD5Hash');
const { info, success } = require('./log');

function downloadLanguageTool({ url, md5, savePath } = {}) {
	return new Promise(async (resolve, reject) => { // eslint-disable-line no-async-promise-executor
		info(`Getting LanguageTool from: ${url} ...`);

		if (fs.existsSync(savePath)) {
			if (await getFileMD5Hash(savePath) === md5) {
				success('Done! Already downloaded');

				resolve();
			}
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

			const contentLength = parseInt(response.headers.get('content-length'), 10);
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

module.exports = downloadLanguageTool;
