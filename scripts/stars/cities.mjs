// Builds the list of cities for the sky map from the answers of Wikidata (CC0): the capitals of the states
// of Europe and their cities of a hundred thousand people or more (queue/22-bigcities.csv — those Wikidata
// calls big cities, queue/24-bypop.csv — every kind of city by its population; names in queue/23-labels_*.csv).
//
//   node scripts/stars/cities.mjs <folder with the unpacked answers>
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
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

/** Left out by the owner's decision of 24.11.2026 ("Москву й Мінськ прибери"): the cities of these two states. */
const STATES_LEFT_OUT = new Map([
  ['Q159', 'Russia'],
  ['Q184', 'Belarus'],
]);

// A name written once for all languages.
const worldName = new Map();
const mulFile = join(raw ?? '', 'queue', '05a-citymul.csv');
if (existsSync(mulFile) && readFileSync(mulFile, 'utf8').startsWith('city,')) for (const r of csv(readFileSync(mulFile, 'utf8'))) worldName.set(qid(r.city), r.l);

const cities = new Map();
const take = (r, capital) => {
  const point = /Point\(([-\d.]+) ([-\d.]+)\)/.exec(r.coord);
  r.en ||= worldName.get(qid(r.city)) ?? '';
  const state = qid(r.country);
  // A record of a city with its surroundings ("Bordeaux Métropole") is not the city.
  if (/métropole|urban area|^metropolis of|metropolitan/i.test(r.en)) return;
  if (!point || !r.en || STATES_OF_THE_PAST.has(state) || STATES_LEFT_OUT.has(state)) return;
  const id = qid(r.city);
  const people = Number(r.pop) || 0;
  const had = cities.get(id);
  if (had && had.people >= people) return void (had.capital ||= capital);
  cities.set(id, {
    id,
    lat: Number(Number(point[2]).toFixed(2)),
    lon: Number(Number(point[1]).toFixed(2)),
    names: { en: r.en, uk: r.uk || r.en, hu: r.hu || r.en },
    country: had?.capital ? had.country : { en: r.countryEn, uk: r.countryUk || r.countryEn, hu: r.countryHu || r.countryEn },
    people,
    capital: capital || had?.capital || false,
  });
};
const capitals = csv(readFileSync(capitalsFile, 'utf8'));
for (const r of capitals) take(r, true);

// The other big cities: only of the states whose capitals were taken, named as those states are named there.
const states = new Map();
for (const r of capitals) if (!STATES_OF_THE_PAST.has(qid(r.country)) && !STATES_LEFT_OUT.has(qid(r.country))) states.set(qid(r.country), { countryEn: r.countryEn, countryUk: r.countryUk, countryHu: r.countryHu });
const othersFiles = ['22-bigcities.csv', '24-bypop.csv'].map((f) => join(raw, 'queue', f)).filter((f) => existsSync(f) && readFileSync(f, 'utf8').startsWith('city,'));
let others = 0;
if (othersFiles.length > 0) {
  const labels = new Map();
  for (const file of readdirSync(join(raw, 'queue')).filter((f) => /^23-labels_\d+\.csv$/.test(f))) {
    for (const r of csv(readFileSync(join(raw, 'queue', file), 'utf8'))) {
      const id = qid(r.x);
      labels.set(id, { ...(labels.get(id) ?? {}), [r.lang]: r.l });
    }
  }
  for (const r of othersFiles.flatMap((f) => csv(readFileSync(f, 'utf8')))) {
    const state = states.get(qid(r.country));
    const names = labels.get(qid(r.city)) ?? {};
    if (!state) continue;
    take({ ...r, ...state, en: names.en || names.mul || '', uk: names.uk, hu: names.hu }, false);
    others++;
  }
}

// One place under two records ("Madrid" and "Madrid city"): the capital stays, else the one with more people.
const NEAR_DEG = 0.06;
const kept = [];
for (const city of [...cities.values()].sort((a, b) => Number(b.capital) - Number(a.capital) || b.people - a.people)) {
  if (kept.some((k) => Math.abs(k.lat - city.lat) < NEAR_DEG && Math.abs(k.lon - city.lon) < NEAR_DEG / Math.cos((city.lat * Math.PI) / 180))) continue;
  kept.push(city);
}
// "Albacete City", "Madrid city": the word is the record's, not the city's.
for (const city of kept) city.names.en = city.names.en.replace(/^City of\s+|\s+city$/i, '');
const list = kept.sort((a, b) => a.names.en.localeCompare(b.names.en, 'en'));
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
      note: 'Capitals of the sovereign states of Europe and their big cities, as Wikidata has them; degrees north and east. Built by scripts/stars/cities.mjs.',
      byLanguage,
      cities: list.map(({ people: _people, capital: _capital, ...city }) => city),
    },
    null,
    1,
  )}\n`,
);
console.log(`${list.length} cities: ${list.filter((c) => c.capital).length} capitals, ${list.filter((c) => !c.capital).length} others (rows read: ${others})`);
