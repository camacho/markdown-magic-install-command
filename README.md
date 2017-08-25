# Install command plugin

Add install command to markdown files via [markdown-magic](https://github.com/DavidWells/markdown-magic)

## Install

<!-- AUTO-GENERATED-CONTENT:START (INSTALLCMD:flags=["-D"]&optional=true) -->
```sh
yarn add -D markdown-magic-install-command
```
<!-- AUTO-GENERATED-CONTENT:END -->

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
yarn add --dev markdown-magic-install-command@1.3.1
```
<!-- AUTO-GENERATED-CONTENT:END -->

## Options
* **client** (defaults to 'npm' unless `yarn.lock` found) - specify the client for the install command
* **flags** (`["--save"]` by default) - any flags to be included (like `-g`)
* **peers** (`true` by default) - include peer dependencies in install command
* **pkg** (closest `package.json` by default) - `package.json` path (relative to the Markdown file)
* **exact** (`false` by default) - add the exact version to the install command
