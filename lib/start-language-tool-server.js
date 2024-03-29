import { execSync, spawn } from 'node:child_process';
import path from 'node:path';
import url from 'node:url';

import findFreePort from './find-free-port.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

function startLanguageToolServer() {
	return new Promise(async (resolve, reject) => { // eslint-disable-line no-async-promise-executor
		const port = await findFreePort(8081);
		const child = spawn(
			'java',
			['-cp', 'languagetool-server.jar', 'org.languagetool.server.HTTPServer', '--port', port],
			{
				cwd: path.resolve(__dirname, '../languagetool'),
				detached: process.platform !== 'win32',
				// 'detached' here for killing the process under *nix; for Windows taskkill is used
			},
		);

		let stderr = '';

		child.stderr
			.on('data', chunk => {
				stderr += chunk;
			})
			.on('end', () => reject(stderr));

		child.stdout
			.on('data', chunk => {
				if (/Server started/g.test(String(chunk))) {
					resolve({ child, port });
				}
			});

		child.on('error', reject);

		if (child.pid) {
			process.on('exit', () => {
				if (process.platform === 'win32') {
					execSync(`taskkill /PID ${child.pid} /T /F`);
				} else {
					// https://azimi.me/2014/12/31/kill-child_process-node-js.html
					process.kill(-child.pid);
				}
			});
		}
	});
}

export default startLanguageToolServer;
