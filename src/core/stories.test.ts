import { describe, expect, it } from 'vitest';
import en from '../i18n/en.json';
import hu from '../i18n/hu.json';
import uk from '../i18n/uk.json';
import { FIGURES } from './stars.ts';
import { ORIGINS, ORIGINS_SOURCE, STORIES, STORY_SOURCE, creditPages } from './stories.ts';

const DICTIONARIES = { en, hu, uk } as const;

describe('the stories of the constellations', () => {
  it('each story is of a constellation on the map and has its text in every language', () => {
    for (const id of Object.keys(STORIES)) {
      expect(FIGURES[id], id).toBeDefined();
      for (const [lang, d] of Object.entries(DICTIONARIES)) expect((d.sky.story.about as Record<string, string>)[id], `${id} ${lang}`).toBeTruthy();
    }
  });

  it('no text of a story is left without its record of sources', () => {
    for (const d of Object.values(DICTIONARIES)) for (const id of Object.keys(d.sky.story.about)) expect(STORIES[id], id).toBeDefined();
  });

  it('each story credits the English article and the article of the language it is read in, with the revision read', () => {
    for (const [id, story] of Object.entries(STORIES)) {
      expect(story.pages.en, id).toBeDefined();
      for (const lang of ['en', 'uk', 'hu'] as const) {
        const credited = creditPages(story, lang);
        expect(credited.length, `${id} ${lang}`).toBeGreaterThan(0);
        expect(credited.some((one) => one.lang === 'en')).toBe(true);
        if (story.pages[lang]) expect(credited[0]?.lang).toBe(lang);
        for (const { lang: key, page } of credited) {
          expect(page.url.startsWith(`https://${key}.wikipedia.org/wiki/`), page.url).toBe(true);
          expect(Number.isInteger(page.revision) && page.revision > 0).toBe(true);
        }
      }
    }
  });

  it('the licence of the stories is the one of the articles', () => {
    expect(STORY_SOURCE.licence).toBe('CC BY-SA 4.0');
    expect(STORY_SOURCE.licenceUrl).toBe('https://creativecommons.org/licenses/by-sa/4.0/');
  });
});

describe('who put each constellation on the list', () => {
  it('is told for each of the 88, in words every language has, with a year where the words ask for one', () => {
    expect(Object.keys(ORIGINS).sort()).toEqual(Object.keys(FIGURES).sort());
    for (const [id, origin] of Object.entries(ORIGINS)) {
      for (const [lang, d] of Object.entries(DICTIONARIES)) {
        const words = (d.sky.story.listed as Record<string, string>)[origin.by];
        expect(words, `${id} ${lang}`).toBeTruthy();
        expect(words!.includes('{year}'), `${id} ${lang}`).toBe(origin.year !== undefined);
      }
    }
  });

  it('counts as the table of the 88 does (Wikipedia, revision 1387250710): 47 of Ptolemy, 14 of Lacaille, 7 of Hevelius, the three parts of Argo Navis', () => {
    const count = (by: string) => Object.values(ORIGINS).filter((origin) => origin.by === by).length;
    expect(ORIGINS_SOURCE.revision).toBe(1387250710);
    expect(count('ptolemy')).toBe(47);
    expect(count('lacaille')).toBe(14);
    expect(count('hevelius')).toBe(7);
    expect(Object.keys(ORIGINS).filter((id) => ORIGINS[id]!.by === 'argo').sort()).toEqual(['Car', 'Pup', 'Vel']);
    // every constellation with a story so far is one of Ptolemy's
    for (const id of Object.keys(STORIES)) expect(ORIGINS[id]?.by, id).toBe('ptolemy');
  });
});
