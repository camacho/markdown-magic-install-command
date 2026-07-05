> **📦 This package has moved.** It now lives in the [markdown-magic-plugins](https://github.com/camacho/markdown-magic-plugins) monorepo at [`packages/install-command`](https://github.com/camacho/markdown-magic-plugins/tree/main/packages/install-command). This repository is archived; issues and contributions go to the monorepo.

# Install command plugin

Add install command to markdown files via [markdown-magic](https://github.com/DavidWells/markdown-magic)

## Install

<!-- AUTO-GENERATED-CONTENT:START (INSTALLCMD:flags=["-D"]&optional=true) -->

```sh
npm add -D markdown-magic-install-command markdown-magic@^4
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
npm add --save-dev markdown-magic-install-command@3.0.0 markdown-magic@^4
```

<!-- AUTO-GENERATED-CONTENT:END -->

## Options

- **client** (defaults to 'npm' unless `bun.lock`, `bun.lockb`, `pnpm-lock.yaml`, or `yarn.lock` found) - specify the client for the install command
- **flags** (`["--save"]` by default) - any flags to be included (like `-g`)
- **peers** (`true` by default) - include peer dependencies in install command
- **pkg** (closest `package.json` by default) - `package.json` path (relative to the Markdown file)
- **exact** (`false` by default) - add the exact version to the install command