# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.1] - 2026-06-29

### Changed

- Split runtime and development Node.js version requirements so the runtime floor is no longer inflated by dev-only tooling. `engines.node` (the version consumers need to *run* the CLI) is restored to `>=18.17`; the `>=22.22.1` floor required by `lint-staged@17` now lives in `devEngines.runtime` and applies only to contributors working on the source.

## [3.0.0] - 2026-06-28

### Changed

- **BREAKING:** Minimum Node.js version is now 22.22.1 (raised from 18.17), required by `lint-staged@17`.
- **BREAKING:** The CLI now connects to an externally managed LanguageTool HTTP service instead of managing the LanguageTool lifecycle locally. See [MIGRATION.md](MIGRATION.md) for upgrade steps.
- **BREAKING:** Running the CLI interactively with no arguments now exits with code `1` (previously exited `0` silently). Scripts relying on the old silent no-op behavior must pass explicit input.
- An empty piped STDIN no longer triggers an HTTP request to the LanguageTool service; the CLI exits `0` immediately.
- All dependencies are now pinned to exact versions (caret ranges removed) for reproducible installs.

### Added

- `--help` / `-h` prints usage and exits `0`.
- `--version` / `-V` prints the package version and exits `0`.
- `--url` / `-u <url>` overrides `languageTool.url` for a single invocation with the highest precedence (flag > user config > default).
- Usage is now printed when the CLI is run interactively with no input (no piped stdin and no file arguments).
- A warning is now emitted for each file argument that does not resolve to an existing path.

### Removed

- The `postinstall` script that downloaded and unpacked a LanguageTool archive during installation.
- Automatic Java checks and local Java-based LanguageTool server startup.
- The project `Dockerfile`.
- `simple-git-hooks`, replaced by a native `pre-commit` hook in `.githooks/`. Contributors must run `npm run enable-git-hooks` once to activate it (`git config core.hooksPath .githooks`).

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

[3.0.1]: https://github.com/343dev/languagetool-node/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/343dev/languagetool-node/compare/v2.0.0...v3.0.0
[2.0.0]: https://github.com/343dev/languagetool-node/compare/1.0.2...v2.0.0
[1.0.2]: https://github.com/343dev/languagetool-node/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/343dev/languagetool-node/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/343dev/languagetool-node/releases/tag/1.0.0
