# Install command plugin

Add install command to markdown files via [markdown-magic](https://github.com/DavidWells/markdown-magic)

## Install

```
npm i markdown-magic markdown-magic-install-command --save-dev
```

## Adding the plugin

See `example.js` for usage.

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./example.js) -->
<!-- The below code snippet is automatically added from ./example.js -->
```js
const fs = require('fs');
const path = require('path');
const markdownMagic = require('markdown-magic');

const config = {
  transforms: {
    INSTALLCMD: require('./index.js'),
  }
}

const markdownPath = path.join(__dirname, 'README.md');
markdownMagic(markdownPath, config);
```
<!-- AUTO-GENERATED-CONTENT:END *-->

## Usage in markdown

<!-- AUTO-GENERATED-CONTENT:START (INSTALLCMD:flags=["--save-dev"]&exact=true) -->
```sh
npm install --save-dev markdown-magic-install-command@1.2.0
```
<!-- AUTO-GENERATED-CONTENT:END -->

## Options

* **flags** (`["--save"]` by default) - any flags to be included (like `-g`)
* **peers** (`true` by default) - include peer dependencies in install command
* **pkg** (closest `package.json` by default) - `package.json` path (relative to the Markdown file)
* **exact** (`false` by default) - add the exact version to the install command
