// The stars seen by the eye and the figures of the constellations. The stars are Wikidata's (CC0), which of
// them are joined into figures comes from d3-celestial (BSD-3-Clause); scripts/stars/build.mjs makes both
// files, docs/research/ tells what was checked and what was left out.
import figuresFile from '../data/constellations.json';
import starsFile from '../data/stars.json';
import { starDirection } from './sky.ts';
import type { Vec3 } from './vec.ts';

export interface Star {
  /** Right ascension and declination, degrees, equator and equinox of J2000. */
  ra: number;
  dec: number;
  /** Visual magnitude: the smaller, the brighter. */
  mag: number;
  /** A unit vector to the star in the same axes. */
  at: Vec3;
}

/** Brightest first: an index into this list is what the figures and the names refer to. */
export const STARS: readonly Star[] = (starsFile.stars as [number, number, number][]).map(([ra, dec, mag]) => ({ ra, dec, mag, at: starDirection(ra, dec) }));

/** The faintest magnitude the file holds. */
export const STARS_LIMIT: number = starsFile.limit;

export type StarName = Partial<Record<'en' | 'uk' | 'hu', string>>;
const NAMES = starsFile.names as Record<string, StarName>;

/**
 * The proper name of a star in a language, else in Latin letters as the world writes it; undefined — the
 * file has no name a reader of that language could read.
 */
export function starName(index: number, lang: string): string | undefined {
  const names = NAMES[String(index)];
  return names?.[lang as keyof StarName] ?? names?.en;
}
export const NAMED_STARS: readonly number[] = Object.keys(NAMES).map(Number);

/** A figure is a list of lines, each joins two stars. The key is the constellation's three letters (Ser1 and Ser2 — the two halves of the Serpent). */
export const FIGURES: Readonly<Record<string, readonly (readonly [number, number])[]>> = figuresFile.figures as unknown as Record<string, [number, number][]>;

export const STAR_SOURCES = { stars: starsFile.source, figures: figuresFile.source };
