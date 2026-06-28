export default function colorize(...arguments_) {
	const string_ = arguments_.join(' ');

	return {
		reset: `\u{1B}[0m${string_}\u{1B}[0m`,
		dim: `\u{1B}[2m${string_}\u{1B}[22m`,

		black: `\u{1B}[30m${string_}\u{1B}[39m`,
		red: `\u{1B}[31m${string_}\u{1B}[39m`,
		green: `\u{1B}[32m${string_}\u{1B}[39m`,
		yellow: `\u{1B}[33m${string_}\u{1B}[39m`,
		blue: `\u{1B}[34m${string_}\u{1B}[39m`,
		magenta: `\u{1B}[35m${string_}\u{1B}[39m`,
		cyan: `\u{1B}[36m${string_}\u{1B}[39m`,
		white: `\u{1B}[37m${string_}\u{1B}[39m`,

		bgBlack: `\u{1B}[40m${string_}\u{1B}[0m`,
		bgRed: `\u{1B}[41m${string_}\u{1B}[0m`,
		bgGreen: `\u{1B}[42m${string_}\u{1B}[0m`,
		bgYellow: `\u{1B}[43m${string_}\u{1B}[0m`,
		bgBlue: `\u{1B}[44m${string_}\u{1B}[0m`,
		bgMagenta: `\u{1B}[45m${string_}\u{1B}[0m`,
		bgCyan: `\u{1B}[46m${string_}\u{1B}[0m`,
		bgWhite: `\u{1B}[47m${string_}\u{1B}[0m`,
	};
}
