// Builds the whole app as one self-contained file for a claude.ai test page: styles, script and pictures
// inline (ONE_FILE in vite.config.ts), plus src/styles/claude-page.css. claude.ai wraps the file in its own
// <html>/<head>/<body>, so the file starts with <title> and <style>.
//   node scripts/claude-page.mjs   →   dist/claude/sky.html
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const built = join(root, 'node_modules', '.cache', 'way1ong-claude');
const run = spawnSync('npx', ['vite', 'build', '--logLevel', 'warn'], { cwd: root, stdio: 'inherit', env: { ...process.env, ONE_FILE: '1' } });
if (run.status !== 0) throw new Error('The build failed');

const assets = readdirSync(join(built, 'assets'));
const only = (ext) => {
  const found = assets.filter((name) => name.endsWith(ext));
  if (found.length !== 1) throw new Error(`Expected one ${ext} file, found ${found.length}: a picture was not taken inside the script`);
  return readFileSync(join(built, 'assets', found[0]), 'utf8');
};
if (assets.length !== 2) throw new Error(`Expected a script and a style sheet only, found: ${assets.join(', ')}`);
const js = only('.js');
const css = only('.css');
const pageCss = readFileSync(join(root, 'src', 'styles', 'claude-page.css'), 'utf8');

const page = [
  '<title>way1ong Sky</title>',
  '<meta name="claude:viewport-fit-sides" content="cover">',
  '<meta name="description" content="">',
  '<meta name="theme-color" content="#05070d">',
  `<style>${css.replace(/<\/style/gi, '<\\/style')}</style>`,
  `<style>${pageCss.replace(/<\/style/gi, '<\\/style')}</style>`,
  '<div id="app"></div>',
  `<script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>`,
  '',
].join('\n');

const out = join(root, 'dist', 'claude', 'sky.html');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, page);
console.log(`${out} (${Math.round(page.length / 1024)} KB)`);
