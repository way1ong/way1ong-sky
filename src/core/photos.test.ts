import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';
import { BODY_IDS } from './bodies.ts';
import { PHOTOS } from './photos.ts';

it('has a photo of every body, with its NASA record and the name to credit', () => {
  expect(Object.keys(PHOTOS).sort()).toEqual([...BODY_IDS].sort());
  for (const id of BODY_IDS) {
    const photo = PHOTOS[id];
    expect(photo.credit.startsWith('NASA'), id).toBe(true);
    expect(photo.page, id).toBe(`https://images.nasa.gov/details/${photo.nasaId}`);
    expect(existsSync(fileURLToPath(new URL(`../photos/${id}.webp`, import.meta.url))), id).toBe(true);
  }
});
