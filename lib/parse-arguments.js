const flags = new Set(['--help', '-h', '--version', '-V', '--url', '-u']);

function applyToken(token, argv, index, result) {
	switch (token) {
		case '--help':
		case '-h': {
			result.help = true;
			return 0;
		}

		case '--version':
		case '-V': {
			result.version = true;
			return 0;
		}

		case '--url':
		case '-u': {
			const next = argv[index + 1];
			if (next === undefined || next === '' || flags.has(next)) {
				throw new Error(`Flag "${token}" requires a value.`);
			}
			result.url = next;
			return 1; // consume the value
		}

		default: {
			result.files.push(token);
			return 0;
		}
	}
}

export default function parseArguments(argv) {
	const result = {
		help: false,
		version: false,
		url: undefined,
		files: [],
	};

	for (let index = 0; index < argv.length; index++) {
		const consumed = applyToken(argv[index], argv, index, result);
		index += consumed;
	}

	return result;
}
