import { location as vfileLocation } from 'vfile-location';

import { EOL } from 'node:os';

import colorize from './colorize.js';

function generateReport({ vfile, matches = [] } = {}) {
	const matchesTotal = matches.length;

	if (vfile === null || !matchesTotal) {
		return;
	}

	const location = vfileLocation(vfile);

	for (const [index, match] of matches.entries()) {
		const isLast = matchesTotal === index + 1;
		const { line = 1, column = 1 } = location.toPoint(match.offset);

		const replacements = match.replacements.map(r => r.value).join(', ');

		const { context } = match;
		const contextPrefix = context.text.slice(0, context.offset);
		const contextPostfix = context.text.slice(context.offset + context.length, context.text.length);
		const contextHighlighted = context.text.slice(context.offset, context.offset + context.length);

		vfile.message(
			`${match.message.replaceAll(/(\s{2})/g, '')}
${colorize(`Context: «${contextPrefix}`).dim}\
${colorize(colorize(contextHighlighted).bgRed).reset}\
${colorize(`${contextPostfix}»`).dim}\
${replacements.length > 0 ? `${EOL}${colorize(`Possible replacements: «${replacements}»`).dim}` : ''}\
${isLast ? '' : EOL}`,
			{ line, column },
			`spell:${match.rule.issueType}`,
		);
	}
}

export default generateReport;
