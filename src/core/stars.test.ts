import { Constellation } from 'astronomy-engine';
import { describe, expect, it } from 'vitest';
import { FIGURES, NAMED_STARS, STARS, STARS_LIMIT, starName } from './stars.ts';

describe('the stars and the figures', () => {
  it('holds stars with places on the sphere, brightest first, none fainter than the limit', () => {
    expect(STARS.length).toBeGreaterThan(5000);
    STARS.forEach((star, i) => {
      expect(star.ra).toBeGreaterThanOrEqual(0);
      expect(star.ra).toBeLessThan(360);
      expect(Math.abs(star.dec)).toBeLessThanOrEqual(90);
      expect(star.mag).toBeLessThanOrEqual(STARS_LIMIT);
      expect(Math.hypot(...star.at)).toBeCloseTo(1, 12);
      if (i > 0) expect(star.mag).toBeGreaterThanOrEqual((STARS[i - 1] as (typeof STARS)[number]).mag);
    });
  });

  it('has no two stars on one spot: a system and its members are one star', () => {
    const sorted = [...STARS].sort((a, b) => a.dec - b.dec);
    let close = 0;
    for (let i = 0; i < sorted.length; i++) {
      const a = sorted[i] as (typeof STARS)[number];
      for (let j = i + 1; j < sorted.length && (sorted[j] as (typeof STARS)[number]).dec - a.dec < 30 / 3600; j++) {
        const b = sorted[j] as (typeof STARS)[number];
        const apart = (Math.acos(Math.min(1, a.at[0] * b.at[0] + a.at[1] * b.at[1] + a.at[2] * b.at[2])) * 180 * 3600) / Math.PI;
        if (apart < 30) close++;
      }
    }
    expect(close).toBe(0);
  });

  it('joins stars that exist, and never a star with itself', () => {
    let lines = 0;
    for (const [id, figure] of Object.entries(FIGURES)) {
      for (const [a, b] of figure) {
        expect(STARS[a], id).toBeDefined();
        expect(STARS[b], id).toBeDefined();
        expect(a, id).not.toBe(b);
        lines++;
      }
    }
    expect(lines).toBeGreaterThan(600);
  });

  it('draws every figure mostly inside its own constellation, by the borders the engine knows', () => {
    // Lines come from one source, stars from another, borders from a third: they agree if the joining is right.
    for (const [id, figure] of Object.entries(FIGURES)) {
      const ends = [...new Set(figure.flat())];
      if (ends.length === 0) continue;
      const own = id.slice(0, 3);
      const inside = ends.filter((i) => Constellation((STARS[i] as (typeof STARS)[number]).ra / 15, (STARS[i] as (typeof STARS)[number]).dec).symbol === own).length;
      // Most, not all: a figure may borrow a star from a neighbour, and the Serpent runs through the Serpent Bearer.
      expect(inside / ends.length, id).toBeGreaterThan(0.5);
    }
  });

  it('names stars that are in the file, in a language or as the world writes them', () => {
    expect(NAMED_STARS.length).toBeGreaterThan(100);
    for (const i of NAMED_STARS) {
      expect(STARS[i]).toBeDefined();
      for (const lang of ['en', 'uk', 'hu']) expect(starName(i, lang), String(i)).toBeTruthy();
    }
    expect(starName(STARS.length + 5, 'en')).toBeUndefined();
  });
});
