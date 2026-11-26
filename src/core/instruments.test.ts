import { readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import en from '../i18n/en.json';
import hu from '../i18n/hu.json';
import uk from '../i18n/uk.json';
import { DIAGRAMS } from '../ui/diagrams/index.ts';
import { INSTRUMENTS, INSTRUMENT_IDS, INSTRUMENT_SOURCE, agencyOf, instrumentById, instrumentCredit, neighbours } from './instruments.ts';

const DICTIONARIES = { en, hu, uk } as const;

describe('the instruments of the section', () => {
  it('are the eleven of the list, in its order, each once', () => {
    expect(INSTRUMENTS.map((one) => one.id)).toEqual([...INSTRUMENT_IDS]);
  });

  it('each is written after something: an article of Wikipedia or a page of an agency', () => {
    for (const one of INSTRUMENTS) {
      const articles = Object.values(one.pages).flatMap((pages) => pages ?? []);
      expect(articles.length + one.agency.length, one.id).toBeGreaterThan(0);
      for (const page of articles) {
        expect(page.url, one.id).toMatch(/^https:\/\/(en|uk|hu)\.wikipedia\.org\/wiki\//);
        expect(page.revision, `${one.id} ${page.title}`).toBeGreaterThan(0);
      }
      for (const url of one.agency) expect(url, one.id).toMatch(/^https:\/\/(science\.nasa\.gov|esahubble\.org)\//);
    }
  });

  it('a card that follows Wikipedia names an English article; Hubble and Webb follow the agencies alone', () => {
    for (const one of INSTRUMENTS) {
      const agencyOnly = one.id === 'hubble' || one.id === 'webb';
      expect((one.pages.en ?? []).length > 0, one.id).toBe(!agencyOnly);
      if (agencyOnly) expect(one.agency.length, one.id).toBeGreaterThan(0);
    }
    expect(INSTRUMENT_SOURCE.wikipedia.licenceUrl).toContain('creativecommons.org/licenses/by-sa/4.0');
  });

  it('are found by their key, with their neighbours in time', () => {
    expect(instrumentById('refractor')?.id).toBe('refractor');
    expect(instrumentById('sextant')).toBeUndefined();
    expect(neighbours('gnomon').before).toBeUndefined();
    expect(neighbours('gnomon').after?.id).toBe('armillary');
    expect(neighbours('refractor').before?.id).toBe('quadrant');
    expect(neighbours('refractor').after?.id).toBe('reflector');
    expect(neighbours('webb').after).toBeUndefined();
  });
});

describe('whom a card names under its text', () => {
  it('the articles of the language and the English ones, each once', () => {
    const quadrant = instrumentById('quadrant')!;
    const told = instrumentCredit(quadrant, 'uk');
    expect(told.filter((one) => one.lang === 'uk').length).toBe((quadrant.pages.uk ?? []).length);
    expect(told.filter((one) => one.lang === 'en').length).toBe((quadrant.pages.en ?? []).length);
    expect(instrumentCredit(quadrant, 'en').every((one) => one.lang === 'en')).toBe(true);
    expect(new Set(told.map((one) => one.page.url)).size).toBe(told.length);
  });

  it('a language with no article of its own names the English ones; a card after the agencies — none', () => {
    const plate = instrumentById('plate')!;
    expect(plate.pages.hu).toBeUndefined();
    expect(instrumentCredit(plate, 'hu').every((one) => one.lang === 'en')).toBe(true);
    expect(instrumentCredit(instrumentById('hubble')!, 'uk')).toEqual([]);
  });

  it('an agency is told by its address', () => {
    expect(agencyOf('https://science.nasa.gov/universe/telescopes-101/')).toBe('nasa');
    expect(agencyOf('https://esahubble.org/about/general/fact_sheet/')).toBe('esa');
  });
});

describe('the texts and the drawings', () => {
  it('every instrument has its card in every language, and no card is left without its instrument', () => {
    for (const [lang, d] of Object.entries(DICTIONARIES)) {
      const items = d.instruments.items as Record<string, { name: string; when: string; how: string; story: string; gave: string; alt: string; labels: Record<string, string> }>;
      for (const id of INSTRUMENT_IDS) {
        const card = items[id];
        expect(card, `${id} ${lang}`).toBeDefined();
        for (const key of ['name', 'when', 'how', 'story', 'gave', 'alt'] as const) expect(card?.[key], `${id}.${key} ${lang}`).toBeTruthy();
      }
      for (const id of Object.keys(items)) expect(instrumentById(id), `${id} ${lang}`).toBeDefined();
    }
  });

  it('every instrument has a drawing, and every label of a drawing has its word in every language', () => {
    for (const id of INSTRUMENT_IDS) {
      const drawing = DIAGRAMS[id];
      expect(drawing, id).toBeDefined();
      expect(drawing.labels.length, id).toBeGreaterThanOrEqual(3);
      for (const [lang, d] of Object.entries(DICTIONARIES)) {
        const words = (d.instruments.items as Record<string, { labels: Record<string, string> }>)[id]?.labels ?? {};
        for (const label of drawing.labels) expect(words[label.key], `${id}.${label.key} ${lang}`).toBeTruthy();
        // No word without its place in the drawing.
        for (const key of Object.keys(words)) expect(drawing.labels.some((label) => label.key === key), `${id}.${key} ${lang}`).toBe(true);
      }
    }
  });

  it('a label stands inside its drawing', () => {
    for (const id of INSTRUMENT_IDS) {
      const { width, height, labels } = DIAGRAMS[id];
      for (const label of labels) {
        expect(label.x, `${id}.${label.key}`).toBeGreaterThanOrEqual(0);
        expect(label.x, `${id}.${label.key}`).toBeLessThanOrEqual(width);
        expect(label.y, `${id}.${label.key}`).toBeGreaterThan(0);
        expect(label.y, `${id}.${label.key}`).toBeLessThanOrEqual(height);
      }
    }
  });

  it('an engraving has its file, its page on Wikimedia Commons and its caption in every language — and nothing is left over', () => {
    const files = new Set(readdirSync(new URL('../instruments/', import.meta.url)).filter((name) => name.endsWith('.webp')).map((name) => name.replace('.webp', '')));
    for (const one of INSTRUMENTS) {
      expect(files.has(one.id), one.id).toBe(one.picture !== undefined);
      if (!one.picture) continue;
      expect(one.picture.page, one.id).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      expect(one.picture.width * one.picture.height, one.id).toBeGreaterThan(0);
    }
    for (const id of files) expect(instrumentById(id), id).toBeDefined();
    for (const [lang, d] of Object.entries(DICTIONARIES)) {
      const captions = d.instruments.picture.captions as Record<string, string>;
      for (const one of INSTRUMENTS) expect(Boolean(captions[one.id]), `${one.id} ${lang}`).toBe(one.picture !== undefined);
    }
  });
});
