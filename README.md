# Install command plugin

Add install command to markdown files via [markdown-magic](https://github.com/DavidWells/markdown-magic)

## Install

<!-- AUTO-GENERATED-CONTENT:START (INSTALLCMD:flags=["-D"]&optional=true) -->

```sh
npm install -D markdown-magic-install-command markdown-magic@^4
```

<!-- AUTO-GENERATED-CONTENT:END -->

## Adding the plugin

See `example.js` for usage.

<!-- AUTO-GENERATED-CONTENT:START (CODE:src=./example.js) -->

```js
import path from 'path';
import { markdownMagic } from 'markdown-magic';
import INSTALLCMD from './index.js';

const config = {
  matchWord: 'AUTO-GENERATED-CONTENT',
  transforms: {
    INSTALLCMD,
  },
};

const markdownPath = path.join(import.meta.dirname, 'README.md');
await markdownMagic(markdownPath, config);
```

<!-- AUTO-GENERATED-CONTENT:END *-->

## Usage in markdown

<!-- AUTO-GENERATED-CONTENT:START (INSTALLCMD:flags=["--save-dev"]&exact=true) -->

```sh
npm install --save-dev markdown-magic-install-command@3.0.0 markdown-magic@^4
```

<!-- AUTO-GENERATED-CONTENT:END -->

## Options

- **client** (defaults to 'npm' unless `yarn.lock` found) - specify the client for the install command
- **flags** (`["--save"]` by default) - any flags to be included (like `-g`)
- **peers** (`true` by default) - include peer dependencies in install command
- **pkg** (closest `package.json` by default) - `package.json` path (relative to the Markdown file)
- **exact** (`false` by default) - add the exact version to the install command
