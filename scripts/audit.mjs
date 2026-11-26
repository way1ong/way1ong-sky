// The built app in a browser: layout, accessibility and both modes, on five screen sizes and in three
// languages. Run after a build:
//   npm run build && npm run audit
//   npm run audit -- --axe <path to axe.min.js>   also the WCAG 2.2 rules of axe-core (get it with
//                                                  `npm pack axe-core` into a temporary folder; it is not
//                                                  a dependency of the project)
//   npm run audit -- --shots <folder>              screenshots of the main states
// Needs Playwright (preinstalled in the cloud session). Starts its own preview server and stops it.
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
if (!existsSync(join(root, 'dist', 'index.html'))) {
  console.error('audit: dist/ not found — run npm run build first');
  process.exit(1);
}
const args = process.argv.slice(2);
const option = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);
const axePath = option('--axe');
const shots = option('--shots');
if (shots) mkdirSync(shots, { recursive: true });
const axeSource = axePath ? readFileSync(axePath, 'utf8') : null;

const PORT = 4387;
/** How long the program waits for a phone's tilt before saying there is none: `SKY.aim.waitMs` in src/config.ts. */
const AIM_WAIT_MS = 1500;
const ORIGIN = `http://localhost:${PORT}`;
const SIZES = [
  [320, 568],
  [360, 640],
  [390, 844],
  [768, 1024],
  [1366, 768],
  // a phone lying on its side: the bars stand in columns at the sides
  [740, 360],
];
const LANGS = [
  ['en', 'en-GB', 'Europe/London'],
  ['hu', 'hu-HU', 'Europe/Budapest'],
  ['uk', 'uk-UA', 'Europe/Kyiv'],
];
/** The least side of anything made to be pressed, CSS px (CLAUDE.md, rule 8). */
const TARGET = 44;

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { cwd: root, stdio: 'ignore', detached: true });
const stop = () => {
  try {
    process.kill(-server.pid);
  } catch {
    // already gone
  }
};
process.on('exit', stop);
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(ORIGIN)).ok) break;
  } catch {
    await new Promise((done) => setTimeout(done, 250));
  }
}

const { chromium } = createRequire(import.meta.url)('playwright');
// Software WebGL: the cloud session has no graphics card.
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const problems = [];
let checks = 0;
const note = (where, text) => problems.push(`${where}: ${text}`);

/** What must hold in every state of the screen. */
async function look(page, where, name) {
  checks++;
  const found = await page.evaluate((least) => {
    const out = [];
    const sideways = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    if (sideways > 0) out.push(`the page scrolls sideways by ${sideways}px`);
    const dialog = document.querySelector('dialog[open]');
    if (dialog && dialog.scrollWidth > dialog.clientWidth) out.push(`the window scrolls sideways by ${dialog.scrollWidth - dialog.clientWidth}px`);
    const scope = dialog ?? document;
    for (const el of scope.querySelectorAll('button, a[href], input, [role="switch"]')) {
      if (!el.offsetParent || el.closest('[hidden]')) continue;
      // A link inside a sentence is as high as its line: it is not a button.
      if (el.tagName === 'A' && getComputedStyle(el).display === 'inline') continue;
      const box = el.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) continue;
      if (box.width < least - 0.5 || box.height < least - 0.5) out.push(`"${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 30)}" is ${Math.round(box.width)}×${Math.round(box.height)}px`);
      if (!(el.getAttribute('aria-label') ?? el.textContent ?? '').trim() && el.tagName !== 'INPUT') out.push(`a ${el.tagName.toLowerCase()} without a name`);
    }
    for (const img of scope.querySelectorAll('img')) if (!img.getAttribute('alt')) out.push('a picture without a description');
    // A phone lying on its side: the columns at the sides, the note and the buttons of free flight between
    // them never lie on one another.
    if (!dialog && getComputedStyle(document.querySelector('.app')).getPropertyValue('--side').trim() === '1') {
      const parts = [...document.querySelectorAll('.bar--time, .bar--scale, .dock, .sky-bar, .fly, .note')].filter((el) => el.offsetParent).map((el) => [el.className, el.getBoundingClientRect()]);
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const [a, b] = [parts[i][1], parts[j][1]];
          if (a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1) out.push(`"${parts[i][0]}" lies on "${parts[j][0]}"`);
        }
      }
    }
    return out;
  }, TARGET);
  for (const text of found) note(`${where} ${name}`, text);
  if (axeSource) {
    await page.evaluate(axeSource);
    const result = await page.evaluate(() => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }));
    for (const v of result.violations) note(`${where} ${name}`, `axe ${v.id}: ${v.help} (${v.nodes.length}) — ${v.nodes[0]?.target?.join(' ')}`);
  }
  if (shots) await page.screenshot({ path: join(shots, `${where.replace(/[^\w]+/g, '-')}-${name}.png`) });
}

const closeDialog = async (page) => {
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => !document.querySelector('dialog[open]'));
};
const chip = (page, i) => page.locator('.dock .chip').nth(i);
/**
 * The button that hides the panels: with them hidden only it and what `kept` names can be pressed, the
 * button has not moved from under the finger, and both the button and Escape bring the panels back.
 */
const panels = async (page, where, what, shot, kept) => {
  const button = page.locator('.top .icon-btn--wide');
  const controls = () => page.locator('.top button:visible, .bottom button:visible, .note button:visible').count();
  const before = await controls();
  const place = await button.boundingBox();
  const hide = await button.getAttribute('aria-label');
  await button.click();
  await page.waitForTimeout(200);
  let left = 1;
  for (const selector of kept) left += await page.locator(`${selector}:visible`).count();
  if ((await controls()) !== left) note(where, `${what}: with the panels hidden ${await controls()} buttons are left, not ${left}`);
  if (await page.locator('.top__text').isVisible()) note(where, `${what}: the heading stays with the panels hidden`);
  const now = await button.boundingBox();
  if (!now || !place || Math.abs(now.x - place.x) > 1 || Math.abs(now.y - place.y) > 1) note(where, `${what}: the button moved when the panels hid`);
  if ((await button.getAttribute('aria-label')) === hide) note(where, `${what}: the button's name did not change`);
  await look(page, where, `${shot}-wide`);
  await button.click();
  await page.waitForTimeout(150);
  if ((await controls()) !== before) note(where, `${what}: the panels did not come back by the button`);
  await button.click();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  if ((await controls()) !== before) note(where, `${what}: the panels did not come back by Escape`);
};
/** The dock: 0 the sky, 1 the whole system, 2 free flight, then the bodies from the Sun (3) on. */
const BODY = { sun: 3, earth: 6, moon: 7, jupiter: 9, saturn: 10 };

for (const [width, height] of SIZES) {
  for (const [lang, locale, timezoneId] of LANGS) {
    const where = `${width}×${height} ${lang}`;
    const context = await browser.newContext({ viewport: { width, height }, locale, timezoneId, deviceScaleFactor: 1, isMobile: width < 768, hasTouch: width < 768 });
    const page = await context.newPage();
    page.on('pageerror', (error) => note(where, `error on the page: ${error.message}`));
    page.on('console', (message) => message.type() === 'error' && !/GPU stall/.test(message.text()) && note(where, `console: ${message.text().slice(0, 160)}`));
    page.on('request', (request) => !request.url().startsWith(ORIGIN) && !request.url().startsWith('data:') && !request.url().startsWith('blob:') && note(where, `a request outside the app: ${request.url().slice(0, 120)}`));
    try {
      await page.goto(`${ORIGIN}/`);
      await page.waitForSelector('.dock .chip');
      await page.waitForTimeout(900);
      if ((await page.evaluate(() => document.documentElement.lang)) !== lang) note(where, 'the page is not in the language of the browser');
      await look(page, where, 'start');

      // ---------- the flight ----------
      await chip(page, BODY.earth).click();
      await page.waitForTimeout(2200);
      await look(page, where, 'earth');
      // The body looked at fills the view: its name is in the title, not over its face.
      const title = (await page.locator('.top__name').textContent()) ?? '';
      const over = await page.evaluate(() => [...document.querySelectorAll('.labels[aria-hidden] .label')].filter((label) => !label.hidden).map((label) => label.textContent));
      if (over.includes(title)) note(where, `the name "${title}" is written over the body looked at`);
      // At a body the heading has the most buttons beside it: they still stand in one row.
      const rows = await page.evaluate(() => new Set([...document.querySelectorAll('.top .icon-btn')].filter((b) => !b.hidden).map((b) => Math.round(b.getBoundingClientRect().top))).size);
      if (rows > 1) note(where, `the buttons of the heading stand in ${rows} rows`);
      await panels(page, where, 'at a body', 'earth', []);
      // A low wide screen: the bars stand at the sides and the picture keeps most of the height.
      if (width > height && height < 500) {
        const lying = await page.evaluate(() => ({
          side: getComputedStyle(document.querySelector('.app')).getPropertyValue('--side').trim() === '1',
          free: (innerHeight - document.querySelector('.top').getBoundingClientRect().bottom) / innerHeight,
          between: document.querySelector('.dock').getBoundingClientRect().left - document.querySelector('.bar--time').getBoundingClientRect().right,
        }));
        if (!lying.side) note(where, 'on a lying phone the bars do not stand at the sides');
        else if (lying.between < lying.free * height) note(where, `between the columns there are ${Math.round(lying.between)}px, less than the height left for the picture`);
        else console.log(`${where}: lying, the picture keeps ${Math.round(lying.free * 100)}% of the height`);
      }
      await page.locator('.top .icon-btn').first().click();
      await page.waitForSelector('dialog[open] .photo img');
      await page.waitForFunction(() => {
        const img = document.querySelector('dialog[open] .photo img');
        return img.complete && img.naturalWidth > 0;
      });
      // The card tells the body's history in a few sentences.
      if (((await page.locator('dialog[open] section[aria-labelledby="history-title"] p').textContent()) ?? '').trim().length < 80) note(where, 'the card tells no history of the body');
      // The card sets the body beside another, to one scale: two circles and words that say the same.
      if ((await page.locator('dialog[open] .size circle').count()) !== 2) note(where, 'the card has no drawing of the body beside another');
      if (!((await page.locator('dialog[open] .size figcaption').textContent()) ?? '').trim()) note(where, 'the drawing of sizes says nothing in words');
      await look(page, where, 'card');
      await closeDialog(page);

      // Jupiter's card leads to its four moons: the flight goes to the one chosen, and it has a card of its own.
      await chip(page, BODY.jupiter).click();
      await page.waitForTimeout(2200);
      await page.locator('.top .icon-btn').first().click();
      await page.waitForSelector('dialog[open] section[aria-labelledby="moons-title"]');
      const moons = page.locator('dialog[open] section[aria-labelledby="moons-title"] button');
      if ((await moons.count()) !== 4) note(where, `Jupiter's card lists ${await moons.count()} moons`);
      const moon = ((await moons.first().textContent()) ?? '').trim();
      // Beside Jupiter its moons are named over the picture (by a moon seen close up there may be nothing else in view).
      // On a narrow screen they may all stand past its edges at this hour: then a look from farther away shows them.
      const moonNames = (await moons.allTextContents()).map((text) => text.trim());
      const namedNow = async () => (await page.locator('.labels[aria-hidden] .label:not([hidden])').allTextContents()).map((text) => text.trim());
      let named = await namedNow();
      if (!named.some((text) => moonNames.includes(text))) {
        await closeDialog(page);
        await page.locator('canvas:not(.sky)').focus();
        for (let step = 0; step < 8 && !named.some((text) => moonNames.includes(text)); step++) {
          await page.keyboard.press('-');
          await page.waitForTimeout(300);
          named = await namedNow();
        }
        if (!named.some((text) => moonNames.includes(text))) note(where, `no moon is named over the picture beside Jupiter, even from farther away: ${named.join(', ')}`);
        await page.locator('.top .icon-btn').first().click();
        await page.waitForSelector('dialog[open] section[aria-labelledby="moons-title"]');
      }
      await moons.first().click();
      await page.waitForTimeout(2400);
      if (((await page.locator('.top__name').textContent()) ?? '').trim() !== moon) note(where, `the flight from Jupiter's card did not come to ${moon}: ${await page.locator('.top__name').textContent()}`);
      await look(page, where, 'jupiter-moon');
      await page.locator('.top .icon-btn').first().click();
      await page.waitForSelector('dialog[open] #satellite-title');
      if ((await page.locator('dialog[open] .fact').count()) < 5) note(where, 'the card of a moon of Jupiter has fewer than five rows');
      if (((await page.locator('dialog[open] .fact__about').textContent()) ?? '').trim().length < 60) note(where, 'the card of a moon of Jupiter tells nothing about it');
      await look(page, where, 'jupiter-moon-card');
      await closeDialog(page);

      await chip(page, BODY.moon).click();
      await page.waitForTimeout(2200);
      await page.locator('.top .icon-btn').first().click();
      await page.waitForSelector('dialog[open] .site-list');
      // "What if you were here?": a weight typed in is answered at once; on the Moon no age is asked for.
      await page.locator('dialog[open] #you-weight').fill('70');
      if (!((await page.locator('dialog[open] .you__out').textContent()) ?? '').trim()) note(where, 'a weight typed into the card gets no answer');
      if (await page.locator('dialog[open] #you-age').count()) note(where, 'the Moon’s card asks for an age though the Moon has no year of its own');
      await page.locator('dialog[open] .you').scrollIntoViewIfNeeded();
      await look(page, where, 'card-you');
      await page.locator('dialog[open] .site-list button').nth(3).click();
      await page.waitForSelector('dialog[open] #site-title');
      await look(page, where, 'landing');
      // "Show that moment": the clock goes to the landing (1969–1972) and stops, the note says so.
      await page.locator('dialog[open] .dialog__actions .chip').click();
      await page.waitForTimeout(2400);
      if (await page.locator('dialog[open]').count()) note(where, 'the window of the landing place stays open after "show that moment"');
      if (!/19(69|7[12])/.test((await page.locator('.top__line').first().textContent()) ?? '')) note(where, `"show that moment" did not take the clock to the landing: ${await page.locator('.top__line').first().textContent()}`);
      if (!(await page.locator('.note:not(.pick)').isVisible())) note(where, '"show that moment" says nothing');
      // The Moon is turned to the landing place: its mark is in view.
      if ((await page.locator('.site:visible').count()) === 0) note(where, 'no landing marks on the Moon turned to a landing place');
      await look(page, where, 'landing-moment');
      await page.locator('.note:not(.pick) .icon-btn').click();
      // Back to the present: the Moon has turned since 1969, the place may be out of sight — nothing to check here.
      await page.locator('.time .chip').first().click();
      await page.waitForTimeout(300);
      await look(page, where, 'moon');

      await chip(page, 2).click();
      await page.waitForTimeout(300);
      if (!(await page.locator('.fly').isVisible())) note(where, 'free flight shows no forward and back buttons');
      await look(page, where, 'free');
      await page.locator('.note .icon-btn').click();
      await panels(page, where, 'free flight', 'free', ['.fly .chip--fly']);

      // The clock: faster, then back to now.
      await page.locator('.time .icon-btn').nth(2).click();
      await page.waitForTimeout(300);
      await look(page, where, 'faster');
      await page.locator('.time .chip').first().click();
      await page.locator('.time .chip').last().click();
      await page.waitForSelector('dialog[open] #day');
      await look(page, where, 'date');
      await closeDialog(page);

      await page.locator('.scale .chip').nth(1).click();
      await page.waitForTimeout(300);
      await look(page, where, 'true-scale');
      await page.locator('.scale .chip').nth(0).click();
      await page.locator('.note .icon-btn').click().catch(() => undefined);

      // ---------- the sky ----------
      await chip(page, 0).click();
      await page.waitForTimeout(400);
      await look(page, where, 'sky');
      await page.locator('.note .icon-btn').click();
      await panels(page, where, 'the sky', 'sky', []);
      // A touch on the sky names what is there. Somewhere in the free sky a touch finds a star: try a few places.
      const room = await page.evaluate(() => {
        const side = getComputedStyle(document.querySelector('.app')).getPropertyValue('--side').trim() === '1';
        const top = document.querySelector('.top').getBoundingClientRect().bottom;
        const low = side ? innerHeight : document.querySelector('.bottom').getBoundingClientRect().top;
        return { x: innerWidth / 2, y: (top + low) / 2, w: Math.min(innerWidth, 360) / 4, h: (low - top) / 4 };
      });
      const card = page.locator('.pick');
      for (const [dx, dy] of [[0, 0], [-1, -1], [1, -1], [0, -1.5], [-0.5, 0.5], [0.5, 0.5], [-1, 0], [1, 0]]) {
        await page.mouse.click(room.x + dx * room.w, room.y + dy * room.h);
        // The touch may have landed on the name of a constellation or on the mark of a galaxy, a nebula or a
        // cluster: their cards are windows, looked at below.
        if (await page.locator('dialog[open] #constellation-title, dialog[open] #deep-title').count()) await closeDialog(page);
        if (await card.isVisible()) break;
      }
      if (!(await card.isVisible())) note(where, 'no touch on the sky opened the card of a star');
      else {
        if (!((await card.locator('h2').textContent()) ?? '').trim()) note(where, 'the card of a star has no name');
        if ((await card.locator('.pick__row').count()) < 3) note(where, 'the card of a star tells less than three things');
        const box = await card.boundingBox();
        if (box && (box.x < 0 || box.x + box.width > width + 1 || box.y + box.height > height + 1)) note(where, 'the card of a star runs off the screen');
        await look(page, where, 'sky-card');
        // A star's card leads to the card of its constellation: its name and what the program works out about it.
        // (A planet's card has no such button: a planet only passes through a constellation.)
        if (await card.locator('.pick__about').count()) {
          await card.locator('.pick__about').click();
          await page.waitForSelector('dialog[open] #constellation-title', { timeout: 3000 }).catch(() => undefined);
          if (!(await page.locator('dialog[open] #constellation-title').count())) note(where, 'the card of a star does not lead to the card of its constellation');
          else {
            if (!((await page.locator('#constellation-title').textContent()) ?? '').trim()) note(where, 'the card of a constellation has no name');
            if ((await page.locator('dialog[open] .fact').count()) < 2) note(where, 'the card of a constellation tells less than two things');
            // A story never stands without its credit: the articles and the licence.
            if ((await page.locator('dialog[open] .fact__about').count()) && (await page.locator('dialog[open] a[href*="wikipedia.org"]').count()) < 1) note(where, 'a story of a constellation without a link to its article');
            await look(page, where, 'constellation');
            await closeDialog(page);
          }
        }
        await page.keyboard.press('Escape');
        if (await card.isVisible()) note(where, 'Escape does not close the card of a star');
      }
      // Galaxies, nebulae and clusters: somewhere in the sky a touch finds the mark of one (the marks are on the
      // picture, so the touch feels for them across the free sky), and its card tells what it is. Felt for in
      // one language: it is the same sky in all of them. Not on the narrowest phone: there a star's card covers
      // the free sky, the sky moves up for every star named, and a search by touch drives the view into the
      // ground — the card itself is the same window as on the other screens.
      if (lang === 'en' && width >= 360) {
        const deep = page.locator('dialog[open] #deep-title');
        // On a small phone the free sky is a narrow band that may hold no mark at the moment: then the sky is
        // turned — higher, then to one side and to the other — and felt again.
        const turns = [null, [0, 1.4], [1.6, 0], [-3.2, 0]];
        search: for (const turn of turns) {
          if (turn) {
            await page.mouse.move(room.x - (turn[0] * room.w) / 2, room.y - (turn[1] * room.h) / 2);
            await page.mouse.down();
            await page.mouse.move(room.x + (turn[0] * room.w) / 2, room.y + (turn[1] * room.h) / 2, { steps: 6 });
            await page.mouse.up();
          }
          // Whole steps: with steps of 0.3 the sum misses the last row and the last column.
          for (let row = -6; row <= 6; row++) {
            for (let column = -6; column <= 6; column++) {
              await page.mouse.click(room.x + column * 0.3 * room.w, room.y + row * 0.3 * room.h);
              if (await deep.count()) break search;
              if (await page.locator('dialog[open]').count()) await closeDialog(page);
              // A star's card lies over the sky (over most of it on a small phone): it is put away, or the
              // next touches would land on it and its buttons.
              if (await card.isVisible()) await page.keyboard.press('Escape');
            }
          }
        }
        if (!(await deep.count())) note(where, 'no touch on the sky found a galaxy, a nebula or a cluster');
        else {
          if (!((await deep.textContent()) ?? '').trim()) note(where, 'the card of a galaxy, a nebula or a cluster has no name');
          if ((await page.locator('dialog[open] .fact').count()) < 4) note(where, 'the card of a galaxy, a nebula or a cluster tells less than four things');
          if (!(await page.locator('dialog[open] .fact__about').count())) note(where, 'the card of a galaxy, a nebula or a cluster does not say what it is');
          if (!(await page.locator('dialog[open] a[href*="science.nasa.gov"]').count())) note(where, 'the card of a galaxy, a nebula or a cluster has no link to its source');
          // A photograph never stands without whose it is.
          if ((await page.locator('dialog[open] figure img').count()) && !((await page.locator('dialog[open] figcaption').textContent()) ?? '').trim()) note(where, 'a photograph of a galaxy, a nebula or a cluster without its credit');
          await page.locator('dialog[open] figure img').evaluate((img) => img.decode().catch(() => undefined)).catch(() => undefined);
          await look(page, where, 'deep-sky');
          // Its card leads to the card of its constellation, and that one names it back.
          await page.locator('dialog[open] .dialog__actions .chip').click();
          await page.waitForSelector('dialog[open] #constellation-title', { timeout: 3000 }).catch(() => undefined);
          if (!(await page.locator('dialog[open] #constellation-title').count())) note(where, 'the card of a galaxy, a nebula or a cluster does not lead to its constellation');
          else if (!(await page.locator('dialog[open] .chips .chip').count())) note(where, 'the card of a constellation does not name what lies within it');
          await look(page, where, 'constellation-deep');
          await closeDialog(page);
        }
        await page.keyboard.press('Escape');
      }
      // A drag turns the sky and names nothing.
      await page.mouse.move(room.x, room.y);
      await page.mouse.down();
      await page.mouse.move(room.x + 50, room.y + 12, { steps: 4 });
      await page.mouse.up();
      if (await card.isVisible()) note(where, 'a drag across the sky opened a card');
      // The keyboard: Enter names what is in the middle, or says there is nothing there.
      await page.locator('canvas.sky').focus();
      await page.keyboard.press('Enter');
      // (A galaxy, a nebula or a cluster in the middle opens its own card, a window.)
      if (!(await card.isVisible()) && !(await page.locator('.note:not(.pick)').isVisible()) && !(await page.locator('dialog[open]').count())) note(where, 'Enter on the sky neither names a star nor says there is none');
      await page.keyboard.press('Escape');
      await page.locator('.note:not(.pick) .icon-btn').click().catch(() => undefined);
      // Jupiter through binoculars: when Jupiter is in view tonight, its card on the map opens a drawing of its
      // four moons and says their order in words.
      await page.locator('.sky-bar .chip').nth(2).click();
      await page.waitForSelector('dialog[open] #tonight-title');
      const planets = page.locator('dialog[open] .site-list').first().locator('button');
      const jupiter = (await planets.allTextContents()).findIndex((text) => /^(Jupiter|Юпітер)/.test(text.trim()));
      if (jupiter < 0) await closeDialog(page);
      else {
        await planets.nth(jupiter).click();
        await page.waitForTimeout(400);
        await page.locator('canvas.sky').focus();
        await page.keyboard.press('Enter');
        const more = card.locator('details');
        if (!(await more.count())) note(where, 'the card of Jupiter in the middle of the view has no drawing of its moons');
        else {
          await more.locator('summary').click();
          if ((await card.locator('.moons__planet').count()) !== 1) note(where, 'the drawing of Jupiter’s moons has no planet');
          if (!((await card.locator('.moons__said').textContent()) ?? '').trim()) note(where, 'the drawing of Jupiter’s moons says nothing in words');
          await look(page, where, 'sky-jupiter');
        }
        await page.keyboard.press('Escape');
        await page.locator('.note:not(.pick) .icon-btn').click().catch(() => undefined);
        await page.locator('.time .chip').first().click();
      }
      // The sky's clock stops at its fastest speed after one step: pressing on changes nothing.
      const faster = page.locator('.time .icon-btn').nth(2);
      await faster.click();
      const hour = await page.locator('.top__speed').textContent();
      for (let i = 0; i < 3; i++) await faster.click();
      if ((await page.locator('.top__speed').textContent()) !== hour) note(where, `the sky runs faster than its first speed: "${await page.locator('.top__speed').textContent()}"`);
      await page.locator('.time .chip').first().click();
      await page.locator('.sky-bar .chip').nth(1).click();
      await page.waitForSelector('dialog[open] .place-list');
      if ((await page.locator('dialog[open] .place-list button').count()) < 100) note(where, 'the list of cities is short');
      await look(page, where, 'place');
      await closeDialog(page);
      await page.locator('.sky-bar .chip').nth(2).click();
      await page.waitForSelector('dialog[open] #tonight-title');
      await look(page, where, 'tonight');
      // The events of the year: the four turns of the year are always among them; one that is seen can be shown.
      const events = page.locator('dialog[open] section[aria-labelledby="events-title"] li');
      if ((await events.count()) < 4) note(where, `the events of the year list ${await events.count()} events`);
      const shown = page.locator('dialog[open] section[aria-labelledby="events-title"] button').first();
      if (await shown.count()) {
        await shown.click();
        await page.waitForTimeout(400);
        if (await page.locator('dialog[open]').count()) note(where, 'the window stays open after an event is shown');
        if (!(await page.locator('.note:not(.pick)').isVisible())) note(where, 'showing an event says nothing');
        await look(page, where, 'sky-event');
        await page.locator('.note:not(.pick) .icon-btn').click();
        await page.locator('.time .chip').first().click();
      } else {
        await closeDialog(page);
      }
      // The instruments of astronomers: from the menu to the list, then card after card to the last one — each
      // with its drawing, whose labels stay inside it and do not lie on one another, its text and its sources.
      await page.locator('.top .icon-btn:not(.icon-btn--wide)').last().click();
      await page.waitForSelector('dialog[open] [role="switch"]');
      await page.locator('dialog[open] section[aria-labelledby="read-title"] .chip').click();
      await page.waitForSelector('dialog[open] .instruments', { timeout: 3000 }).catch(() => undefined);
      const instruments = await page.locator('dialog[open] .instrument').count();
      if (instruments < 10) note(where, `the list of instruments holds ${instruments} of them`);
      else {
        await look(page, where, 'instruments');
        await page.locator('dialog[open] .instrument').first().click();
        for (let i = 0; i < instruments; i++) {
          await page.waitForSelector('dialog[open] svg.diagram');
          const name = ((await page.locator('#instruments-title').textContent()) ?? '').trim();
          const drawing = await page.evaluate(() => {
            const svg = document.querySelector('dialog[open] svg.diagram');
            const [, , w, h] = svg.getAttribute('viewBox').split(' ').map(Number);
            const boxes = [...svg.querySelectorAll('text')].map((text) => ({ words: text.textContent, box: text.getBBox() }));
            const wrong = [];
            if (boxes.length < 3) wrong.push(`only ${boxes.length} labels`);
            for (const { words, box } of boxes) {
              if (!words.trim()) wrong.push('an empty label');
              if (box.x < 0 || box.x + box.width > w || box.y < 0 || box.y + box.height > h) wrong.push(`the label "${words}" runs out of the drawing`);
            }
            for (let a = 0; a < boxes.length; a++) {
              for (let b = a + 1; b < boxes.length; b++) {
                const [one, other] = [boxes[a].box, boxes[b].box];
                if (Math.min(one.x + one.width, other.x + other.width) - Math.max(one.x, other.x) > 0 && Math.min(one.y + one.height, other.y + other.height) - Math.max(one.y, other.y) > 1) wrong.push(`the labels "${boxes[a].words}" and "${boxes[b].words}" lie on one another`);
              }
            }
            return wrong;
          });
          for (const wrong of drawing) note(where, `the instrument "${name}": ${wrong}`);
          if (!name) note(where, `the card of instrument ${i + 1} has no name`);
          if ((await page.locator('dialog[open] .fact__about').count()) < 2) note(where, `the instrument "${name}" is told in less than two paragraphs`);
          if (!(await page.locator('dialog[open] .fact__source a[href]').count())) note(where, `the instrument "${name}" names no source`);
          // An engraving never stands without where it is from.
          if ((await page.locator('dialog[open] figure img').count()) && !(await page.locator('dialog[open] figure a[href*="commons.wikimedia.org"]').count())) note(where, `the engraving of "${name}" has no link to its file`);
          if (i === 1 || i === 4) {
            await page.locator('dialog[open] figure img').evaluate((img) => img.decode().catch(() => undefined)).catch(() => undefined);
            await look(page, where, `instrument-${i + 1}`);
          }
          if (i < instruments - 1) await page.locator('dialog[open] .steps .chip').last().click();
        }
        // From the last card back to the list: the focus returns to the instrument that was read.
        await page.locator('dialog[open] .dialog__actions .chip').click();
        await page.waitForSelector('dialog[open] .instruments', { timeout: 3000 }).catch(() => undefined);
        if (!(await page.evaluate(() => document.activeElement?.classList.contains('instrument')))) note(where, 'back in the list of instruments the focus is not on an instrument');
      }
      await closeDialog(page);

      await page.locator('.top .icon-btn:not(.icon-btn--wide)').last().click();
      await page.waitForSelector('dialog[open] [role="switch"]');
      await look(page, where, 'menu');
      if ((await page.locator('dialog[open] [role="switch"]').count()) !== 4) note(where, 'the menu must have four switches of the sky: lines, names, galaxies and nebulae, night mode');
      await page.locator('dialog[open] [role="switch"]').last().click();
      await closeDialog(page);
      await page.waitForTimeout(200);
      if (!(await page.evaluate(() => document.documentElement.hasAttribute('data-night')))) note(where, 'night mode did not turn on');
      await look(page, where, 'night');
      // "Point the phone" (a trial): offered only to a device held in the hand; an imitated tilt turns it on,
      // the button turns it off, and a device that reports no tilt is told so.
      const aimBtn = page.locator('.sky-bar .chip').nth(3);
      const handheld = await page.evaluate(() => matchMedia('(pointer: coarse)').matches);
      if ((await aimBtn.isVisible()) !== handheld) note(where, handheld ? 'no button to point the phone on a phone' : 'the button to point the phone is shown on a computer');
      if (handheld) {
        const tilt = (alpha, beta) => page.evaluate(([a, b]) => window.dispatchEvent(new DeviceOrientationEvent('deviceorientationabsolute', { alpha: a, beta: b, gamma: 0, absolute: true })), [alpha, beta]);
        await aimBtn.click();
        for (let i = 0; i < 12; i++) {
          await tilt(270, 130);
          await page.waitForTimeout(40);
        }
        if ((await aimBtn.getAttribute('aria-pressed')) !== 'true') note(where, 'pointing the phone did not turn on');
        await look(page, where, 'aim');
        await aimBtn.click();
        if ((await aimBtn.getAttribute('aria-pressed')) !== 'false') note(where, 'pointing the phone did not turn off');
        await aimBtn.click();
        await page.waitForTimeout(AIM_WAIT_MS + 400);
        if ((await aimBtn.getAttribute('aria-pressed')) !== 'false') note(where, 'pointing the phone stays on though the device reports no tilt');
        if (!(await page.locator('.note:not(.pick)').isVisible())) note(where, 'nothing is said when the device reports no tilt');
        await look(page, where, 'aim-none');
      }
      await page.locator('.sky-bar .chip').first().click();
      await page.waitForTimeout(300);
      if (await page.evaluate(() => document.documentElement.hasAttribute('data-night'))) note(where, 'night mode stays on in the flight');
    } catch (error) {
      note(where, `the walk stopped: ${String(error.message).split('\n')[0]}`);
    }
    await context.close();
  }
}

// ---------- the keyboard, large text, reduced motion, without internet: once, on a phone and on a computer ----------
for (const [width, height] of [SIZES[2], SIZES[4]]) {
  const where = `${width}×${height} extras`;
  const context = await browser.newContext({ viewport: { width, height }, locale: 'en-GB', timezoneId: 'Europe/London', reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', (error) => note(where, `error on the page: ${error.message}`));
  try {
    await page.goto(`${ORIGIN}/`);
    await page.waitForSelector('.dock .chip');
    await page.waitForTimeout(600);

    // Reduced motion: a flight takes no time.
    await chip(page, BODY.saturn).click();
    await page.waitForTimeout(250);
    if (!(await page.locator('.top .icon-btn').first().isVisible())) note(where, 'with reduced motion the flight still takes time');

    // The keyboard alone: every control of the screen can be reached with Tab, and focus can be seen.
    const reached = new Set();
    let unseen = 0;
    for (let i = 0; i < 60; i++) {
      await page.keyboard.press('Tab');
      const at = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const style = getComputedStyle(el);
        return { name: `${el.tagName}:${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 24)}`, seen: style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0 };
      });
      if (!at) continue;
      if (!at.seen && !reached.has(at.name)) unseen++;
      reached.add(at.name);
    }
    const wanted = await page.evaluate(() => [...document.querySelectorAll('.top button, .bottom button, canvas')].filter((el) => el.offsetParent && !el.closest('[hidden]')).length);
    if (reached.size < wanted) note(where, `Tab reaches ${reached.size} of ${wanted} controls`);
    if (unseen > 0) note(where, `${unseen} controls show no focus ring`);
    // Enter on the Moon's chip flies there; Escape closes a window opened from the keyboard.
    await chip(page, BODY.moon).focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(250);
    await page.locator('.top .icon-btn').first().focus();
    await page.keyboard.press('Enter');
    await page.waitForSelector('dialog[open] .site-list');
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('dialog[open]'));

    // Text twice as large: nothing runs off the side, and the picture keeps some room.
    await page.evaluate(() => (document.documentElement.style.fontSize = '200%'));
    await page.waitForTimeout(400);
    await look(page, where, 'text-200');
    const room = await page.evaluate(() => {
      const top = document.querySelector('.top').getBoundingClientRect().bottom;
      const bottom = document.querySelector('.bottom').getBoundingClientRect().top;
      return (bottom - top) / window.innerHeight;
    });
    // On a phone, text twice as large leaves little: a seventh of the height is still a picture to look at.
    if (room < 1 / 7) note(where, `with text twice as large the picture keeps ${Math.round(room * 100)}% of the height`);
    console.log(`${where}: with text twice as large the picture keeps ${Math.round(room * 100)}% of the height`);
    await chip(page, 0).click();
    await page.waitForTimeout(400);
    await look(page, where, 'sky-text-200');
    await page.evaluate(() => (document.documentElement.style.fontSize = ''));

    // Without internet: the worker has kept every file, and the app opens again.
    await page.waitForFunction(async () => (await navigator.serviceWorker.ready) && (await caches.keys()).some((key) => key.startsWith('way1ong-sky-')), null, { timeout: 30000 });
    await context.setOffline(true);
    await page.reload();
    await page.waitForSelector('.dock .chip', { timeout: 15000 });
    await chip(page, BODY.earth).click();
    await page.waitForTimeout(300);
    await page.locator('.top .icon-btn').first().click();
    await page.waitForSelector('dialog[open] .photo img');
    const kept = await page.evaluate(async () => {
      const img = document.querySelector('dialog[open] .photo img');
      await img.decode().catch(() => undefined);
      return img.naturalWidth > 0;
    });
    if (!kept) note(where, 'without internet a card has no photo');
    checks++;
  } catch (error) {
    note(where, `the walk stopped: ${String(error.message).split('\n')[0]}`);
  }
  await context.close();
}

// ---------- a browser without 3D graphics: no flight, but the sky opens ----------
{
  const where = 'no 3D';
  const plain = await chromium.launch({ args: ['--disable-gpu', '--disable-3d-apis'] });
  const context = await plain.newContext({ viewport: { width: 390, height: 844 }, locale: 'en-GB', timezoneId: 'Europe/London' });
  const page = await context.newPage();
  page.on('pageerror', (error) => note(where, `error on the page: ${error.message}`));
  try {
    await page.goto(`${ORIGIN}/`);
    await page.waitForSelector('.sky-bar .chip:not([hidden])', { timeout: 15000 });
    await page.waitForTimeout(500);
    if (!(await page.locator('canvas.sky').isVisible())) note(where, 'the sky is not shown');
    if (await page.locator('.sky-bar .chip').first().isVisible()) note(where, 'the button back to the flight is shown though there is no flight');
    if (!/3D/.test((await page.locator('.note__text').textContent()) ?? '')) note(where, 'nothing says why there is no flight');
    await look(page, where, 'sky');
  } catch (error) {
    note(where, `the walk stopped: ${String(error.message).split('\n')[0]}`);
  }
  await plain.close();
}

await browser.close();
stop();
const unique = [...new Set(problems)];
if (unique.length) {
  console.error(`audit: ${unique.length} problem(s) in ${checks} states\n- ${unique.join('\n- ')}`);
  process.exit(1);
}
console.log(`audit: ${checks} states on ${SIZES.length} screen sizes in ${LANGS.length} languages${axeSource ? ', with axe-core' : ''} — no problems`);
