/* eslint-disable no-console */
import { copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const clientDirectory = resolve(import.meta.dirname, '..', 'dist', 'client');
await copyFile(
  resolve(clientDirectory, 'index.html'),
  resolve(clientDirectory, '404.html')
);

console.info('Created GitHub Pages SPA fallback at dist/client/404.html.');
