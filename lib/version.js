import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export default function version() {
	const here = path.dirname(fileURLToPath(import.meta.url));
	const manifestPath = path.resolve(here, '..', 'package.json');
	const { version: versionString } = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
	return versionString;
}
