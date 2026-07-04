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
