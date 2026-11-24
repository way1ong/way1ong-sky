import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { skyAppPlugin } from './scripts/pwa.ts';

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url));

// A test page for claude.ai is the whole app in one file (scripts/claude-page.mjs sets ONE_FILE): textures
// go inside the script as data, nothing is fetched.
const oneFile = process.env.ONE_FILE === '1';

export default defineConfig({
  root: here('src'),
  // public/ holds what the host needs beside the app: _headers for Cloudflare. The one-file page takes none of it.
  publicDir: oneFile ? false : here('public'),
  // The built app can be installed and works without internet; the one-file test page is neither.
  plugins: oneFile ? [] : [skyAppPlugin(here('.'), { name: 'way1ong Sky', shortName: 'Sky', description: 'A flight through the Solar System and a map of the sky. No ads, no tracking; works without internet.', lang: 'en' })],
  base: './',
  build: {
    outDir: oneFile ? here('node_modules/.cache/way1ong-claude') : here('dist'),
    emptyOutDir: true,
    modulePreload: { polyfill: false },
    assetsInlineLimit: oneFile ? 100_000_000 : 0,
    chunkSizeWarningLimit: 1500,
  },
  define: { __ONE_FILE__: JSON.stringify(oneFile) },
  test: {
    root: here('.'),
    include: ['src/**/*.test.ts'],
    css: { include: [/\.css(\?raw)?$/] },
  },
});
