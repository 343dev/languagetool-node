# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **BREAKING:** Minimum Node.js version is now 22.22.1 (raised from 18.17), required by `lint-staged@17` and `@343dev/eslint-config@4`.
- **BREAKING:** The CLI now connects to an externally managed LanguageTool HTTP service instead of managing the LanguageTool lifecycle locally. See [MIGRATION.md](MIGRATION.md) for upgrade steps.
- All dependencies are now pinned to exact versions (caret ranges removed) for reproducible installs.
- Upgraded `vfile` 6.0.2 -> 6.0.3, `nanospinner` 1.1.0 -> 1.2.2.
- Upgraded dev dependencies: `lint-staged` 15.2.8 -> 17.0.7, `simple-git-hooks` 2.11.1 -> 2.13.1, `eslint` 8.57.0 -> 9.39.4, `@343dev/eslint-config` 1.0.0 -> 4.0.0.

### Added

- `eslint.config.js` flat config, replacing the legacy `eslintConfig` block in `package.json` (required by ESLint 9, which removed the eslintrc format).

### Removed

- The `postinstall` script that downloaded and unpacked a LanguageTool archive during installation.
- Automatic Java checks and local Java-based LanguageTool server startup.
- The project `Dockerfile`.
- Installer-only dependencies `node-stream-zip` and `progress`.

## [2.0.0] - 2024-03-21

### Changed

- Package is now [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
- Minimum Node.js version is 18.17.
- LanguageTool version is set to 6.3. See [CHANGES.md](https://languagetool.org/download/CHANGES.md).

## 1.0.4 - 2021-06-10

### Security

- Fixed several security vulnerabilities:

  - [Use of a Broken or Risky Cryptographic Algorithm](https://github.com/advisories/GHSA-r9p9-mrjm-926w) in [elliptic](https://github.com/indutny/elliptic). Updated from 6.5.3 to 6.5.4.

  - [Regular Expression Denial of Service](https://github.com/advisories/GHSA-43f8-2h32-f4cj) in [hosted-git-info](https://github.com/npm/hosted-git-info). Updated from 2.8.8 to 2.8.9.

  - [Command Injection](https://github.com/advisories/GHSA-35jh-r3h4-6jhm) in [lodash](https://github.com/lodash/lodash). Updated from 4.17.20 to 4.17.21.

  - and others.

## 1.0.3 - 2021-02-05

### Changed

- Replaced `findFreePort` helper with
  [@funboxteam/free-port-finder](https://github.com/funbox/free-port-finder).
- Replaced `colorize` and `formatBytes` helpers with self-titled helpers from
  [@funboxteam/diamonds](https://github.com/funbox/diamonds).

### Fixed

- Fixed symbols order in `log` helper.

## [1.0.2] - 2020-10-16

### Added

- Added LICENSE file.

### Changed

- Updated the deps.

## [1.0.1] - 2019-06-06

### Fixed

- Fixed an error in the exception handler.

## [1.0.0] - 2019-04-26

### Added

- Init version.

[Unreleased]: https://github.com/343dev/languagetool-node/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/343dev/languagetool-node/compare/1.0.2...v2.0.0
[1.0.2]: https://github.com/343dev/languagetool-node/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/343dev/languagetool-node/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/343dev/languagetool-node/releases/tag/1.0.0
