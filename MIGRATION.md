# Migration Guide

## 2.0.2 → 3.0.0

The package no longer installs, downloads, starts, or manages LanguageTool. The `postinstall` script that downloaded and unpacked a LanguageTool archive, the automatic Java checks and local Java-based LanguageTool server startup, and the project `Dockerfile` have all been removed. Installer-only dependencies `node-stream-zip` and `progress` are no longer required.

The CLI now connects to an externally managed LanguageTool HTTP service.

### Run an external LanguageTool HTTP service

You must run a LanguageTool HTTP service yourself. For example, use one of the community Docker images:

- [`meyay/languagetool`](https://hub.docker.com/r/meyay/languagetool)
- [`erikvl87/languagetool`](https://hub.docker.com/r/erikvl87/languagetool)

### Configure the service URL

If your LanguageTool service is not available at the default address `http://127.0.0.1:8081`, configure it in `~/.languagetoolrc.js`:

```javascript
export default {
  languageTool: {
    url: 'http://127.0.0.1:8081',
  },
};
```

### How the check endpoint is resolved

`/v2/check` is appended to the configured base URL, preserving any path prefix. For example, a base URL of `http://127.0.0.1:8081` resolves to `http://127.0.0.1:8081/v2/check`, and a base URL of `http://127.0.0.1:8081/languagetool` resolves to `http://127.0.0.1:8081/languagetool/v2/check`.
