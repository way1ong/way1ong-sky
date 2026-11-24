// Builds the star file of the sky map from the raw answers of Wikidata (CC0), and the constellation figures
// from the lines of d3-celestial (BSD-3-Clause, see d3-celestial-LICENSE) — from the latter only which stars
// are joined; the stars themselves and their places are Wikidata's.
//
//   node scripts/stars/build.mjs <folder with the unpacked answers>
//
// The folder holds data/v_*.csv, data/det_*.csv (docs/research/wikidata-stars-*.tgz) and, when they have
// been fetched, queue/*.csv. What was left out and why goes to docs/research/STARS-BUILD.md.
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const raw = process.argv[2];
if (!raw || !existsSync(join(raw, 'data'))) throw new Error('Give the folder with the unpacked answers of Wikidata.');

/** The choices of this build (C): how faint, how close two records are one star, how near a line's end must be. */
const LIMIT_MAG = 6.5;
const SAME_STAR_ARCSEC = 60;
const LINE_END_ARCMIN = 3;
const NAMES_TO_MAG = 3.5;

// ---------- reading ----------
function csv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') (cell += '"'), i++;
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') (row.push(cell), (cell = ''));
    else if (c === '\n') (row.push(cell), rows.push(row), (row = []), (cell = ''));
    else if (c !== '\r') cell += c;
  }
  if (cell !== '' || row.length > 0) (row.push(cell), rows.push(row));
  const [head, ...body] = rows;
  return body.filter((r) => r.length === head.length).map((r) => Object.fromEntries(head.map((k, i) => [k, r[i]])));
}
const files = (folder, pattern) => (existsSync(join(raw, folder)) ? readdirSync(join(raw, folder)).filter((f) => pattern.test(f)).sort() : []);
const read = (folder, file) => csv(readFileSync(join(raw, folder, file), 'utf8'));
const qid = (url) => url.slice(url.lastIndexOf('/') + 1);

// Visual magnitudes: the preferred statement of a record, else its brightest one that is not deprecated.
const magnitudes = new Map();
for (const file of files('data', /^v_.*\.csv$/)) {
  for (const r of read('data', file)) {
    const rank = r.rank.slice(r.rank.lastIndexOf('#') + 1);
    if (rank === 'DeprecatedRank') continue;
    const id = qid(r.s);
    const m = Number(r.m);
    const had = magnitudes.get(id);
    if (!had || (rank === 'PreferredRank' && !had.preferred) || (rank === 'PreferredRank') === had.preferred && m < had.m) magnitudes.set(id, { m, preferred: rank === 'PreferredRank' });
  }
}

const records = new Map();
for (const file of files('data', /^det_.*\.csv$/)) {
  for (const r of read('data', file)) {
    const id = qid(r.s);
    let rec = records.get(id);
    if (!rec) records.set(id, (rec = { id, ra: [], dec: [], types: new Set(), en: '', uk: '', hu: '' }));
    if (r.ra) rec.ra.push(Number(r.ra));
    if (r.dec) rec.dec.push(Number(r.dec));
    if (r.inst) rec.types.add(qid(r.inst));
    // "Везен (зоря)": the note in brackets tells articles apart, it is not a part of the name.
    for (const lang of ['en', 'uk', 'hu']) if (r[lang]) rec[lang] = r[lang].replace(/\s*\((зоря|зірка|star|csillag)\)$/i, '');
  }
}

const optional = (name) => (files('queue', new RegExp(`^${name}\\.csv$`)).length ? read('queue', `${name}.csv`) : []);
const typeName = new Map(optional('01-types').map((r) => [qid(r.x), r.l]));
if (typeName.size === 0) throw new Error('queue/01-types.csv is needed: the names of the types decide what is a star.');
// A name written once for all languages.
for (const r of optional('03-mul')) {
  const rec = records.get(qid(r.s));
  if (rec && !rec.en) rec.en = r.l;
}
// Stars with no visual magnitude in Wikidata: the G band of Gaia stands in for it.
const gaia = [];
for (const file of files('queue', /^1\d-g_.*\.csv$/)) {
  for (const r of read('queue', file)) {
    if (!r.ra || !r.dec) continue;
    gaia.push({ id: qid(r.s), ra: [Number(r.ra)], dec: [Number(r.dec)], types: new Set(), en: r.en ?? '', uk: r.uk ?? '', hu: r.hu ?? '', m: Number(r.m) });
  }
}

// ---------- what is a star ----------
const NOT_A_STAR = /cluster|nebula|galaxy|galactic|H II region|\bmoon\b|planet|asteroid|asterism|association|moving group|stellar kinematics|supernova|\bnova\b|gamma-ray burst|trans-Neptunian/i;
const A_STAR = /\bstar\b|variable|binary|giant|subgiant|double|Cepheid|hypergiant/i;
const EVER_A_FLASH = /supernova|\bnova\b|gamma-ray burst|exoplanet|\bmoon\b|asteroid|trans-Neptunian|^(inner|outer|inferior|superior) planet|gas giant|ice giant/i;
const excluded = new Map(JSON.parse(readFileSync(join(here, 'exclude.json'), 'utf8')).records.map((r) => [r.id, r.reason]));
const left = { 'no place among the stars': [], 'not a star': [], 'a flash, a planet or a moon': [], 'a broken record': [], 'not confirmed by the check': [] };
const stars = [];
for (const [id, mag] of magnitudes) {
  const rec = records.get(id);
  if (!rec || mag.m > LIMIT_MAG) continue;
  const names = [...rec.types].map((t) => typeName.get(t) ?? t);
  const label = rec.en || rec.uk || id;
  if (rec.ra.length === 0 || rec.dec.length === 0) left['no place among the stars'].push(`${label} (${mag.m})`);
  else if (rec.ra.some((ra) => rec.dec.includes(ra))) left['a broken record'].push(`${label} (${mag.m}): declination equals right ascension`);
  else if (excluded.has(id)) left['not confirmed by the check'].push(`${label} (${mag.m}) — ${id}`);
  else if (names.some((n) => EVER_A_FLASH.test(n))) left['a flash, a planet or a moon'].push(`${label} (${mag.m}): ${names.join(', ')}`);
  else if (names.some((n) => NOT_A_STAR.test(n)) && !names.some((n) => A_STAR.test(n) && !NOT_A_STAR.test(n))) left['not a star'].push(`${label} (${mag.m}): ${names.join(', ')}`);
  else stars.push({ ...rec, ra: Math.min(...rec.ra), dec: Math.min(...rec.dec), m: mag.m, band: 'V' });
}
const known = new Set(stars.map((s) => s.id));
let fromGaia = 0;
for (const g of gaia) {
  if (known.has(g.id) || magnitudes.has(g.id) || g.m > LIMIT_MAG) continue;
  known.add(g.id);
  stars.push({ ...g, ra: g.ra[0], dec: g.dec[0], band: 'G' });
  fromGaia++;
}

// ---------- records of one star: a system and its members stand on one spot ----------
const RAD = Math.PI / 180;
const unit = (ra, dec) => [Math.cos(dec * RAD) * Math.cos(ra * RAD), Math.cos(dec * RAD) * Math.sin(ra * RAD), Math.sin(dec * RAD)];
const apartArcsec = (a, b) => (Math.acos(Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])) / RAD) * 3600;
for (const s of stars) s.at = unit(s.ra, s.dec);
stars.sort((a, b) => a.dec - b.dec);
const group = stars.map((_, i) => i);
const top = (i) => (group[i] === i ? i : (group[i] = top(group[i])));
for (let i = 0; i < stars.length; i++) {
  for (let j = i + 1; j < stars.length && stars[j].dec - stars[i].dec <= SAME_STAR_ARCSEC / 3600; j++) {
    if (apartArcsec(stars[i].at, stars[j].at) <= SAME_STAR_ARCSEC) group[top(j)] = top(i);
  }
}
const groups = new Map();
stars.forEach((s, i) => (groups.get(top(i)) ?? groups.set(top(i), []).get(top(i))).push(s));
const merged = [];
const mergedNotes = [];
for (const members of groups.values()) {
  // A Gaia stand-in never overrides a visual magnitude of the same spot.
  const measured = members.some((s) => s.band === 'V') ? members.filter((s) => s.band === 'V') : members;
  const brightest = measured.reduce((a, b) => (b.m < a.m ? b : a));
  const langs = (s) => (s.uk ? 1 : 0) + (s.hu ? 1 : 0) + (s.en ? 1 : 0);
  const named = [...members].sort((a, b) => langs(b) - langs(a) || a.m - b.m || Number(a.id.slice(1)) - Number(b.id.slice(1)))[0];
  merged.push({ id: named.id, ra: brightest.ra, dec: brightest.dec, at: brightest.at, m: brightest.m, band: brightest.band, en: named.en, uk: named.uk, hu: named.hu });
  if (members.length > 1 && brightest.m <= 2.5) mergedNotes.push(`${named.en || named.uk || named.id} (${brightest.m}): ${members.map((s) => `${s.en || s.id} ${s.m}`).join(' + ')}`);
}
merged.sort((a, b) => a.m - b.m || a.ra - b.ra);

// ---------- the figures: every end of a line is the star nearest to it ----------
const lineFile = JSON.parse(readFileSync(join(here, 'd3-celestial-constellations.lines.json'), 'utf8'));
const figures = {};
const lostEnds = [];
let segments = 0;
for (const feature of lineFile.features) {
  const pairs = (figures[feature.id] ??= []);
  for (const line of feature.geometry.coordinates) {
    const ends = line.map(([lon, lat]) => {
      const at = unit((lon + 360) % 360, lat);
      let best = -1;
      let bestApart = LINE_END_ARCMIN * 60;
      for (let i = 0; i < merged.length; i++) {
        if (Math.abs(merged[i].dec - lat) > 0.1) continue;
        const apart = apartArcsec(at, merged[i].at);
        if (apart < bestApart) (best = i), (bestApart = apart);
      }
      if (best < 0) lostEnds.push(`${feature.id}: ${((lon + 360) % 360).toFixed(3)}°, ${lat.toFixed(3)}°`);
      return best;
    });
    for (let i = 1; i < ends.length; i++) {
      if (ends[i - 1] >= 0 && ends[i] >= 0 && ends[i - 1] !== ends[i]) (pairs.push([ends[i - 1], ends[i]]), segments++);
    }
  }
}

// ---------- names: a name, not a catalogue's designation ----------
const GREEK = 'alpha|alfa|beta|béta|gamma|delta|epsilon|zeta|dzéta|eta|éta|theta|théta|iota|ióta|kappa|lambda|mu|nu|xi|omicron|omikron|pi|rho|sigma|szigma|tau|upsilon|üpszilon|phi|chi|khi|psi|pszi|omega|ómega|альфа|бета|гамма|дельта|епсилон|дзета|ета|тета|йота|каппа|лямбда|мю|ню|ксі|омікрон|пі|ро|сигма|тау|іпсилон|фі|хі|псі|омега';
const DESIGNATION = new RegExp(`^(${GREEK})[\\d¹²³⁴-⁹]*\\s|\\d|^[a-zа-яіїє]{1,3}\\s`, 'iu');
// A Greek letter itself ("δ Cygni") marks a designation too; "Fomalhaut A" is Fomalhaut to the eye.
const proper = (name) => (name && !DESIGNATION.test(name) && !/^[\u0370-\u03FF]/u.test(name) ? name.replace(/\s+A$/u, '') : undefined);

// ---------- writing ----------
const round = (x, digits) => Number(x.toFixed(digits));
const names = {};
merged.forEach((s, i) => {
  const own = { en: proper(s.en), uk: proper(s.uk), hu: proper(s.hu) };
  if (s.m <= NAMES_TO_MAG && (own.en || own.uk || own.hu)) names[i] = own;
});
const out = {
  source: { title: 'Wikidata', url: 'https://www.wikidata.org/', licence: 'CC0', read: '2026-11-24' },
  note: 'Right ascension and declination in degrees (J2000), magnitude; brightest first. Built by scripts/stars/build.mjs.',
  limit: LIMIT_MAG,
  stars: merged.map((s) => [round(s.ra, 4), round(s.dec, 4), round(s.m, 2)]),
  names,
};
writeFileSync(join(root, 'src', 'data', 'stars.json'), `${JSON.stringify(out)}\n`);
writeFileSync(
  join(root, 'src', 'data', 'constellations.json'),
  `${JSON.stringify({
    source: { title: 'd3-celestial 0.7.35, data/constellations.lines.json', licence: 'BSD-3-Clause', read: '2026-11-24' },
    note: 'Which stars are joined: pairs of indexes into stars.json. Built by scripts/stars/build.mjs.',
    figures,
  })}\n`,
);

const list = (items, most = 400) => (items.length === 0 ? '- немає\n' : `${items.slice(0, most).map((x) => `- ${x}`).join('\n')}\n${items.length > most ? `- … і ще ${items.length - most}\n` : ''}`);
const report = `# Файл зір — що зібрано й що відкинуто

Зібрано скриптом \`scripts/stars/build.mjs\` із сирих відповідей Вікіданих (\`wikidata-stars-2026-11-24.tgz\`). Цей файл скрипт пише сам — руками не правити.

- Записів з видимою величиною до ${LIMIT_MAG}: ${[...magnitudes.values()].filter((m) => m.m <= LIMIT_MAG).length}.
- Зір у файлі після відсіву й злиття: **${merged.length}** (з них ${merged.filter((s) => s.band === 'G').length} — з величиною Gaia G замість видимої; записів Gaia взято ${fromGaia}).
- Записи ближче ніж ${SAME_STAR_ARCSEC}″ один до одного вважаються однією зорею: місце й величина — найяскравішого, назва — того запису, що має назви більшою кількістю мов.
- Назви збережено для зір до ${NAMES_TO_MAG} величини: ${Object.keys(names).length}.
- Ліній сузір'їв: ${segments} відрізків у ${Object.keys(figures).length} фігурах; кінців ліній без зорі: ${lostEnds.length}.

## Кінці ліній, для яких зорі не знайшлось
${list(lostEnds)}
## Відкинуто: не має місця серед зір (планети, супутники тощо)
${list(left['no place among the stars'])}
## Відкинуто: спалах, планета чи супутник
${list(left['a flash, a planet or a moon'])}
## Відкинуто: не зоря (скупчення, туманність, галактика)
${list(left['not a star'])}
## Відкинуто: зіпсований запис
${list(left['a broken record'])}
## Відкинуто: не підтверджено звіркою (\`scripts/stars/exclude.json\`)
${list(left['not confirmed by the check'])}
## Злито в одну зорю (серед найяскравіших, до 2,5)
${list(mergedNotes)}
## Сорок найяскравіших у файлі
${list(merged.slice(0, 40).map((s, i) => `${i}. ${s.en || '—'} / ${s.uk || '—'} / ${s.hu || '—'}: ${s.m}${s.band === 'G' ? ' (G)' : ''}, ${s.ra.toFixed(3)}°, ${s.dec.toFixed(3)}° — ${s.id}`))}`;
writeFileSync(join(root, 'docs', 'research', 'STARS-BUILD.md'), report);
// For checks outside the repository: which record every star of the file is.
writeFileSync(join(raw, 'built-ids.json'), JSON.stringify(merged.map((s) => ({ id: s.id, en: s.en, uk: s.uk, m: s.m, band: s.band }))));
console.log(`${merged.length} stars, ${segments} line segments, ${lostEnds.length} line ends lost, ${Object.keys(names).length} names`);
