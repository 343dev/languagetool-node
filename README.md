# @343dev/languagetool-node

<img align="right" width="124" height="124" src="./logo.png">

[![NPM Downloads](https://img.shields.io/npm/dw/@343dev/languagetool-node)](https://www.npmjs.com/package/@343dev/languagetool-node)
[![npm](https://img.shields.io/npm/v/@343dev/languagetool-node.svg)](https://www.npmjs.com/package/@343dev/languagetool-node)

CLI spell and grammar checker. Sends checks to an externally managed [LanguageTool](https://github.com/languagetool-org/languagetool) HTTP service.

## Rationale

Some projects have a lot of documentation inside the repos. Once we decided to start linting their grammar and check for spelling errors. But we didn’t want to send our docs to the unknown servers of the well-known services.

Hence, we decided to build our own CLI tool upon the LanguageTool.

## Getting Started

Install the package:

```shell
npm i -g @343dev/languagetool-node
```

Run a LanguageTool service. The easiest way is an official-style Docker image, for example:

- [`meyay/languagetool`](https://hub.docker.com/r/meyay/languagetool)
- [`erikvl87/languagetool`](https://hub.docker.com/r/erikvl87/languagetool)

Example:

```shell
docker run --rm -p 8081:8081 erikvl87/languagetool
```

Check the selected image’s documentation for its exposed port and configuration. The CLI defaults to `http://127.0.0.1:8081`. If your service runs elsewhere, set `languageTool.url` in `~/.languagetoolrc.js` (see below).

## Usage

The tool can check the passed files or the text from STDIN.

Check files:

```shell
languagetool-node README.md CHANGELOG.md
```

Check files defined using globs:

```shell
languagetool-node ~/project1/**/*.txt ~/project2/*.md
```

Check the text from STDIN:

```shell
echo "Insert your text here .. or check this textt. LanguageTool 4.0 were releasd on Thursday 29 december 2017." | languagetool-node
```

Running `languagetool-node` with no arguments (and no piped stdin) prints usage and exits non-zero, so you can always rediscover how to drive the tool.

### Options

- `-h`, `--help` — Print usage and exit. Takes precedence over everything else.
- `-V`, `--version` — Print the CLI version and exit.
- `-u`, `--url <url>` — Override the LanguageTool service URL for this run only (beats config).

The `--url` flag accepts the same forms as `languageTool.url` in config: an origin (`http://127.0.0.1:8081`), a URL with a path prefix (`https://example.com/languagetool`), or a URL with a trailing slash (trimmed). `/v2/check` is appended automatically.

```shell
languagetool-node --url http://127.0.0.1:9090 README.md
```

<details>
  <summary>Output example</summary>

  ```shell
  $ echo "Insert your text here .. or check this textt. LanguageTool 4.0 were releasd on Thursday 29 december 2017." | languagetool-node

  <stdin>
    1:23  warning  Two consecutive dots                                        typographical  spell
  Context: «Insert your text here .. or check this textt. LanguageTool 4.0 w...»
  Possible replacements: «.»

    1:26  warning  This sentence does not start with an uppercase letter       typographical  spell
  Context: «Insert your text here .. or check this textt. LanguageTool 4.0 were...»
  Possible replacements: «Or»

    1:40  warning  Possible spelling mistake found                             misspelling    spell
  Context: «Insert your text here .. or check this textt. LanguageTool 4.0 were releasd on Thurs...»
  Possible replacements: «text, texts, text t»

    1:69  warning  Possible spelling mistake found                             misspelling    spell
  Context: «...check this textt. LanguageTool 4.0 were releasd on Thursday 29 december 2017. »
  Possible replacements: «released, release»

    1:80  warning  The date 29 december 2017 is not a Thursday, but a Friday.  inconsistency  spell
  Context: «...textt. LanguageTool 4.0 were releasd on Thursday 29 december 2017. »

  ⚠ 5 warnings
  ```
</details>

## External configuration file

It’s possible to override default options by creating file `~/.languagetoolrc.js`. It will be merged with default config.

Example of external config:

```javascript
export default {
  // LanguageTool HTTP service base URL. `/v2/check` is appended to it,
  // so a path prefix is preserved, e.g. `https://example.com/languagetool`
  // becomes `https://example.com/languagetool/v2/check`.
  languageTool: {
    url: 'http://127.0.0.1:8081',
  },
  // allowed words (regexps are supported)
  ignore: [
    '(T|O)TF',
  ],
};
```

## Credits

The picture for the project was made by [Sergey Mylnikov](https://www.behance.net/s_mylnikov) & [Igor Garybaldi](https://pandabanda.com/).

## Other projects

- 🖼 [optimizt](https://github.com/343dev/optimizt) — CLI tool for image optimization: compresses PNG, JPEG, GIF, SVG, and creates AVIF/WebP
- 📦 [harold](https://github.com/343dev/harold) — CLI tool that compares frontend project bundle sizes between snapshots
- 🐳 [jailbot](https://github.com/343dev/jailbot) — Docker container wrapper with automatic filesystem path mounting
- 📝 [markdown-lint](https://github.com/343dev/markdown-lint) — Markdown code style linter based on Prettier, Remark, and Typograf
