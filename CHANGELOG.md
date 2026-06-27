# Changelog

## 3.0.0

**Breaking change.** The package no longer manages the LanguageTool lifecycle.

* Removed the `postinstall` script that downloaded and unpacked a LanguageTool archive during installation.
* Removed automatic Java checks and local Java-based LanguageTool server startup.
* Removed the project `Dockerfile`.
* Removed installer-only dependencies `node-stream-zip` and `progress`.

The CLI now connects to an externally managed LanguageTool HTTP service.

Migration:

1. Run a LanguageTool HTTP service yourself (e.g. the `meyay/languagetool` or `erikvl87/languagetool` Docker images).
2. If it is not reachable at `http://127.0.0.1:8081`, configure it in `~/.languagetoolrc.js`:

   ```javascript
   export default {
     languageTool: {
       url: 'http://127.0.0.1:8081',
     },
   };
   ```

`/v2/check` is appended to the configured base URL, preserving any path prefix.

## 2.0.0 (21.03.2024)

* Package now is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
* Minimum Node.js version is 18.17.
* LanguageTool version is set to 6.3. See [CHANGES.md](https://languagetool.org/download/CHANGES.md).

## 1.0.4 (10.06.2021)

Fixed several security vulnerabilities:

- [Use of a Broken or Risky Cryptographic Algorithm](https://github.com/advisories/GHSA-r9p9-mrjm-926w) in [elliptic](https://github.com/indutny/elliptic). Updated from 6.5.3 to 6.5.4.

- [Regular Expression Denial of Service](https://github.com/advisories/GHSA-43f8-2h32-f4cj) in [hosted-git-info](https://github.com/npm/hosted-git-info). Updated from 2.8.8 to 2.8.9.

- [Command Injection](https://github.com/advisories/GHSA-35jh-r3h4-6jhm) in [lodash](https://github.com/lodash/lodash). Updated from 4.17.20 to 4.17.21.

- and others.

## 1.0.3 (05.02.2021)

* Replaced `findFreePort` helper with
  [@funboxteam/free-port-finder](https://github.com/funbox/free-port-finder).
* Replaced `colorize` and `formatBytes` helpers with self-titled helpers from
  [@funboxteam/diamonds](https://github.com/funbox/diamonds).
* Fixed symbols order in `log` helper.

## 1.0.2 (16.10.2020)

* Added LICENSE file.
* Updated the deps.

## 1.0.1 (06.06.2019)

* Fixed an error in the exception handler.

## 1.0.0 (26.04.2019)

* Init version.
