// One address everywhere: the one the app is told (src/config.ts) and the one Cloudflare serves (wrangler.jsonc).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';
import { STORE_PREFIX, skyManifest } from '../scripts/pwa.ts';
import { SKY } from './config.ts';

it('lives at the address Cloudflare is told to serve, and nowhere else', () => {
  const text = readFileSync(fileURLToPath(new URL('../wrangler.jsonc', import.meta.url)), 'utf8');
  const config = JSON.parse(text.replace(/^\s*\/\/.*$/gm, '')) as { routes: { pattern: string; custom_domain: boolean }[]; workers_dev: boolean; preview_urls: boolean; previews: object; assets: { directory: string } };
  expect(config.routes).toEqual([{ pattern: new URL(SKY.address).host, custom_domain: true }]);
  expect(config.workers_dev).toBe(false);
  expect(config.preview_urls).toBe(false);
  expect(config.previews).toEqual({});
  expect(config.assets.directory).toBe('./dist');
});

it('is an app of its own for the browser: started from its folder, with icons, standing alone', () => {
  const manifest = skyManifest({ name: 'way1ong Sky', shortName: 'Sky', description: 'x', lang: 'en' }, '#000000');
  expect(manifest.start_url).toBe('./');
  expect(manifest.scope).toBe('./');
  expect(manifest.display).toBe('standalone');
  expect(manifest).not.toHaveProperty('id');
  expect(manifest.icons.map((icon) => icon.purpose).sort()).toEqual(['any', 'any', 'maskable']);
  expect(STORE_PREFIX).toBe('way1ong-sky-');
});
