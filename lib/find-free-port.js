import net from 'node:net';

function isPortFree(port) {
	return new Promise(resolve => {
		const server = net.createServer();

		server.once('error', error => {
			if (error.code === 'EADDRINUSE') {
				resolve(false);
			} else {
				throw error;
			}
		});

		server.once('listening', () => {
			server.once('close', () => {
				resolve(true);
			});
			server.close();
		});

		server.listen(port, '127.0.0.1');
	});
}

function findFreePort(port) {
	return isPortFree(port).then(isFree => {
		if (isFree) {
			return port;
		}

		return findFreePort(port + 1);
	});
}

export default findFreePort;
