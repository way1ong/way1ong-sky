import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { ART_SET, PLATES } from './art.ts';
import { FIGURES } from './stars.ts';
import { STORIES } from './stories.ts';

const file = (id: string) => fileURLToPath(new URL(`../art/${id}.webp`, import.meta.url));

describe('the old drawings of the constellations', () => {
  it('every constellation with a story has a drawing, and every drawing is of a constellation on the map', () => {
    for (const id of Object.keys(STORIES)) expect(PLATES[id], id).toBeDefined();
    for (const id of Object.keys(PLATES)) expect(FIGURES[id], id).toBeDefined();
  });

  it('each drawing has its picture file, its size and the page of its file on Wikimedia Commons', () => {
    for (const [id, plate] of Object.entries(PLATES)) {
      expect(existsSync(file(id)), `${id}: src/art/${id}.webp`).toBe(true);
      expect(plate.page.startsWith('https://commons.wikimedia.org/wiki/File:'), plate.page).toBe(true);
      expect(plate.width).toBeGreaterThan(200);
      expect(plate.height).toBeGreaterThan(200);
      expect(Math.max(plate.width, plate.height)).toBeLessThanOrEqual(840);
    }
  });

  it('who is to be named is known for each: the set, and the restorer where the file\'s page asks for it', () => {
    expect(ART_SET.artist).toBe('Sidney Hall');
    expect(ART_SET.licence).toBe('public domain');
    for (const [id, plate] of Object.entries(PLATES)) {
      expect(['loc', 'nms', 'dolby'], id).toContain(plate.holder);
      expect(typeof plate.restored, id).toBe('boolean');
    }
    // the one file whose page carries no such request (docs/ART.md)
    expect(Object.keys(PLATES).filter((id) => !PLATES[id]!.restored)).toEqual(['Peg']);
  });
});
