// Dictionaries: the same keys and parameters in every language, a name for every body and every scale.
import { describe, expect, it } from 'vitest';
import { SKY } from '../config.ts';
import { BODY_IDS } from '../core/bodies.ts';
import { SUPERLATIVES } from '../core/facts.ts';
import { SCALES } from '../core/scale.ts';
import { CREW_ROLES, SITE_IDS, SITES } from '../core/sites.ts';
import en from './en.json';
import hu from './hu.json';
import uk from './uk.json';

type Tree = { [key: string]: string | Tree };
const dictionaries: Record<string, Tree> = { en, hu, uk };

const PLURAL_FORMS = new Set(['zero', 'one', 'two', 'few', 'many', 'other']);
const isPlural = (value: Tree) => Object.keys(value).every((k) => PLURAL_FORMS.has(k));

/** Key path → its texts (all forms of a plural set). */
function texts(tree: Tree, prefix = ''): Map<string, Record<string, string>> {
  const out = new Map<string, Record<string, string>>();
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') out.set(path, { text: value });
    else if (isPlural(value)) out.set(path, value as Record<string, string>);
    else for (const [p, t] of texts(value, path)) out.set(p, t);
  }
  return out;
}
const params = (forms: Record<string, string>) => [...new Set(Object.values(forms).flatMap((text) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1])))].sort();
const reference = texts(en);

describe.each(Object.entries(dictionaries))('dictionary %s', (lang, dict) => {
  const own = texts(dict);
  it('has the same keys as English, the same parameters, the plural forms its language uses, and no empty text', () => {
    expect([...own.keys()].sort()).toEqual([...reference.keys()].sort());
    const needed = new Intl.PluralRules(lang).resolvedOptions().pluralCategories.slice().sort();
    for (const [key, forms] of own) {
      expect(params(forms), key).toEqual(params(reference.get(key) ?? {}));
      if (!('text' in forms)) expect(Object.keys(forms).sort(), key).toEqual(needed);
      for (const text of Object.values(forms)) expect(text.trim(), key).not.toBe('');
    }
  });
});

it('Ukrainian texts use the typographic apostrophe', () => {
  for (const [key, forms] of texts(uk)) for (const text of Object.values(forms)) expect(text.includes("'"), key).toBe(false);
});

it('names every body and every scale — and nothing else', () => {
  expect(Object.keys(en.bodies).sort()).toEqual([...BODY_IDS].sort());
  for (const mode of SCALES) {
    expect(mode in en.scale, mode).toBe(true);
    expect(`${mode}Note` in en.scale, mode).toBe(true);
  }
});

it('names every speed of the clock and every kind of eclipse', () => {
  for (const name of SKY.time.names) expect(name in en.time.rates, name).toBe(true);
  expect(Object.keys(en.time.lunarAt).sort()).toEqual(['partial', 'total']);
  expect(Object.keys(en.time.solarAt).sort()).toEqual(['annular', 'partial', 'total']);
});

it('has words for everything a planet can lead in', () => {
  expect(Object.keys(en.card.most).sort()).toEqual([...SUPERLATIVES].sort());
});

it('every language of the app has a flag beside its name', async () => {
  const flags = await import('../ui/flags.ts');
  expect([...flags.FLAG_LANGS].sort()).toEqual(Object.keys(dictionaries).sort());
});

it('describes every body, in every language', () => {
  for (const dict of Object.values(dictionaries)) expect(Object.keys(((dict.card as Tree).about as Tree)).sort()).toEqual([...BODY_IDS].sort());
});

it('captions every body\'s photo, in every language', () => {
  for (const dict of Object.values(dictionaries)) expect(Object.keys(((dict.card as Tree).photo as Tree)).sort()).toEqual([...BODY_IDS].sort());
});

it('names every landing place, its photo, its crew and their roles, in every language', () => {
  for (const dict of Object.values(dictionaries)) {
    const sites = dict.sites as Tree;
    expect(Object.keys(sites.place as Tree).sort()).toEqual([...SITE_IDS].sort());
    expect(Object.keys(sites.photo as Tree).sort()).toEqual([...SITE_IDS].sort());
    expect(Object.keys(sites.roles as Tree).sort()).toEqual([...CREW_ROLES].sort());
    for (const id of SITE_IDS) for (const role of CREW_ROLES) expect((sites.people as Tree)[SITES[id].crew[role]], `${id} ${role}`).toBeTypeOf('string');
  }
});
