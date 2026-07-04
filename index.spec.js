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
    ).toBe('```sh\nnpm add --save no-peer-deps-fixture\n```');
  });

  it('detects a non-npm client from its lockfile and translates flags', () => {
    expect(
      INSTALLCMD({
        content: 'untouched',
        options: {
          pkg: './__fixtures__/yarn-client/package.json',
          flags: '["--save-dev"]',
        },
        srcPath,
      }),
    ).toBe('```sh\nyarn add --dev yarn-client-fixture\n```');
  });

  it('uses the yarn classic global subcommand for --global', () => {
    expect(
      INSTALLCMD({
        content: 'untouched',
        options: {
          pkg: './__fixtures__/yarn-client/package.json',
          flags: '["--global"]',
        },
        srcPath,
      }),
    ).toBe('```sh\nyarn global add yarn-client-fixture\n```');
  });

  it('uses the bun --global flag rather than a global subcommand', () => {
    expect(
      INSTALLCMD({
        content: 'untouched',
        options: {
          pkg: './__fixtures__/bun-client/package.json',
          flags: '["--global"]',
        },
        srcPath,
      }),
    ).toBe('```sh\nbun add --global bun-client-fixture\n```');
  });
});
