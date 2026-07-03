import path from 'path';
import { describe, expect, it } from 'vitest';
import INSTALLCMD from './index.js';

const srcPath = path.join(import.meta.dirname, 'README.md');

describe('markdown-magic-install-command', () => {
  it('builds an install command from the nearest package.json', () => {
    expect(
      INSTALLCMD({ content: 'foo', options: {}, srcPath }),
    ).toMatchSnapshot();
  });

  it('omits peer dependencies when package.json has none, without throwing', () => {
    expect(
      INSTALLCMD({
        content: 'untouched',
        options: { pkg: './__fixtures__/no-peer-deps/package.json' },
        srcPath,
      }),
    ).toBe('```sh\nnpm install --save no-peer-deps-fixture\n```');
  });
});
