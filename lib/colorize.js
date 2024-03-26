function colorize(...arguments_) {
	const string_ = arguments_.join(' ');

	return {
		reset: `\u001B[0m${string_}\u001B[0m`,
		dim: `\u001B[2m${string_}\u001B[22m`,

		black: `\u001B[30m${string_}\u001B[39m`,
		red: `\u001B[31m${string_}\u001B[39m`,
		green: `\u001B[32m${string_}\u001B[39m`,
		yellow: `\u001B[33m${string_}\u001B[39m`,
		blue: `\u001B[34m${string_}\u001B[39m`,
		magenta: `\u001B[35m${string_}\u001B[39m`,
		cyan: `\u001B[36m${string_}\u001B[39m`,
		white: `\u001B[37m${string_}\u001B[39m`,

		bgBlack: `\u001B[40m${string_}\u001B[0m`,
		bgRed: `\u001B[41m${string_}\u001B[0m`,
		bgGreen: `\u001B[42m${string_}\u001B[0m`,
		bgYellow: `\u001B[43m${string_}\u001B[0m`,
		bgBlue: `\u001B[44m${string_}\u001B[0m`,
		bgMagenta: `\u001B[45m${string_}\u001B[0m`,
		bgCyan: `\u001B[46m${string_}\u001B[0m`,
		bgWhite: `\u001B[47m${string_}\u001B[0m`,
	};
}

export default colorize;
