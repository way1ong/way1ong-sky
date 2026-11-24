// Dictionaries: the same keys and parameters in every language, a name for every body and every scale.
import { describe, expect, it } from 'vitest';
import { SKY } from '../config.ts';
import { BODY_IDS } from '../core/bodies.ts';
import { SCALES } from '../core/scale.ts';
import en from './en.json';
import hu from './hu.json';
import uk from './uk.json';

type Tree = { [key: string]: string | Tree };
const dictionaries: Record<string, Tree> = { en, hu, uk };

function texts(tree: Tree, prefix = ''): Map<string, string> {
  const out = new Map<string, string>();
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') out.set(path, value);
    else for (const [p, t] of texts(value, path)) out.set(p, t);
  }
  return out;
}
const params = (text: string) => [...new Set([...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]))].sort();
const reference = texts(en);

describe.each(Object.entries(dictionaries))('dictionary %s', (_lang, dict) => {
  const own = texts(dict);
  it('has the same keys as English, the same parameters, and no empty text', () => {
    expect([...own.keys()].sort()).toEqual([...reference.keys()].sort());
    for (const [key, text] of own) {
      expect(params(text), key).toEqual(params(reference.get(key) ?? ''));
      expect(text.trim(), key).not.toBe('');
    }
  });
});

it('Ukrainian texts use the typographic apostrophe', () => {
  for (const [key, text] of texts(uk)) expect(text.includes("'"), key).toBe(false);
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
