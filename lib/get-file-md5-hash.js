import crypto from 'node:crypto';
import fs from 'node:fs';

function getFileMD5Hash(filePath) {
	return new Promise((resolve, reject) => {
		const hash = crypto.createHash('md5');
		const readStream = fs.createReadStream(filePath);

		readStream
			.on('error', reject)
			.on('data', chunk => hash.update(chunk))
			.on('end', () => resolve(hash.digest('hex')));
	});
}

export default getFileMD5Hash;
