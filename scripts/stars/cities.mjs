// Builds the list of cities for the sky map from the answers of Wikidata (CC0): the capitals of the states
// of Europe and, when that answer has been fetched, its other large cities.
//
//   node scripts/stars/cities.mjs <folder with the unpacked answers>
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const raw = process.argv[2];
const capitalsFile = join(raw ?? '', 'queue', '04-capitals.csv');
if (!raw || !existsSync(capitalsFile)) throw new Error('Give the folder with queue/04-capitals.csv.');

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
const qid = (url) => url.slice(url.lastIndexOf('/') + 1);

/** States of the past that Wikidata also lists as sovereign states of Europe: their capitals are not today's. */
const STATES_OF_THE_PAST = new Map([
  ['Q161885', 'Kingdom of Great Britain'],
  ['Q203493', 'Kingdom of Romania'],
  ['Q172107', 'Polish–Lithuanian Commonwealth'],
]);

/** Places smaller than this are left out of the "other large cities" (C). */
const LEAST_PEOPLE = 400_000;

const cities = new Map();
// A name written once for all languages.
const worldName = new Map();
const mulFile = join(raw ?? '', 'queue', '05a-citymul.csv');
if (existsSync(mulFile) && readFileSync(mulFile, 'utf8').startsWith('city,')) for (const r of csv(readFileSync(mulFile, 'utf8'))) worldName.set(qid(r.city), r.l);

const take = (r, capital) => {
  const point = /Point\(([-\d.]+) ([-\d.]+)\)/.exec(r.coord);
  r.en ||= worldName.get(qid(r.city)) ?? '';
  if (!point || !r.en || STATES_OF_THE_PAST.has(qid(r.country))) return;
  const id = qid(r.city);
  const people = Number(r.pop) || 0;
  const had = cities.get(id);
  if (had && had.people >= people) return void (had.capital ||= capital);
  cities.set(id, {
    id,
    lat: Number(Number(point[2]).toFixed(2)),
    lon: Number(Number(point[1]).toFixed(2)),
    names: { en: r.en, uk: r.uk || r.en, hu: r.hu || r.en },
    country: { en: r.countryEn, uk: r.countryUk || r.countryEn, hu: r.countryHu || r.countryEn },
    people,
    capital: capital || had?.capital || false,
  });
};
const capitals = csv(readFileSync(capitalsFile, 'utf8'));
for (const r of capitals) take(r, true);
const countryNames = new Map(capitals.map((r) => [r.country, { uk: r.countryUk, hu: r.countryHu }]));
const othersFile = join(raw, 'queue', '06-cities.csv');
let others = 0;
if (existsSync(othersFile) && readFileSync(othersFile, 'utf8').startsWith('city,')) {
  for (const r of csv(readFileSync(othersFile, 'utf8'))) {
    if ((Number(r.pop) || 0) < LEAST_PEOPLE) continue;
    const names = countryNames.get(r.country) ?? {};
    take({ ...r, countryUk: names.uk, countryHu: names.hu }, false);
    others++;
  }
}

const list = [...cities.values()].sort((a, b) => a.names.en.localeCompare(b.names.en, 'en'));
const named = (en) => list.find((city) => city.names.en === en)?.id;
const kyiv = list.find((city) => city.names.en === 'Kyiv');
if (kyiv) kyiv.zoneNames = ['kiev'];
const byLanguage = { uk: named('Kyiv'), hu: named('Budapest'), en: named('London') };
for (const [lang, id] of Object.entries(byLanguage)) if (!id) throw new Error(`No capital to begin with for "${lang}".`);

writeFileSync(
  join(root, 'src', 'data', 'cities.json'),
  `${JSON.stringify(
    {
      source: { title: 'Wikidata', url: 'https://www.wikidata.org/', licence: 'CC0', read: '2026-11-24' },
      note: 'Capitals of the sovereign states of Europe and its other large cities, as Wikidata has them; degrees north and east. Built by scripts/stars/cities.mjs.',
      byLanguage,
      cities: list.map(({ people: _people, capital: _capital, ...city }) => city),
    },
    null,
    1,
  )}\n`,
);
console.log(`${list.length} cities: ${list.filter((c) => c.capital).length} capitals, ${list.filter((c) => !c.capital).length} others (rows read: ${others})`);
