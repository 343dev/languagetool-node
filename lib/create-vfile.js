import { VFile } from 'vfile';

import fs from 'node:fs';

function createVfile(path) {
	if (!path && !process.stdin.isTTY && process.platform !== 'win32') {
		// When Git BASH terminal is used we can't get data from STDIN.
		// That's why it's turned off here, and it's impossible to use STDIN in Windows.
		return new VFile(fs.readFileSync(0)); // File descriptor 0 is stdin
	}

	if (path && fs.existsSync(path)) {
		return new VFile({
			path,
			value: fs.readFileSync(path),
		});
	}
}

export default createVfile;
