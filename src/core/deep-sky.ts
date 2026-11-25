// Galaxies, nebulae and star clusters of the sky map: where each is among the stars, what kind it is and what
// the program itself can tell about it at a place and a moment. What they are, how far and how bright —
// NASA's pages of Hubble's Messier Catalog; where they are — Wikidata (data/deep-sky.json, docs/DEEP-SKY.md).
import { Constellation } from 'astronomy-engine';
import { SKY } from '../config.ts';
import file from '../data/deep-sky.json';
import { bestEveningOf } from './constellations.ts';
import { project, type Frame, type Look } from './dome.ts';
import { altAz, starDirection, toSky, type Place, type SkyTurn } from './sky.ts';
import { compassPoint } from './tonight.ts';
import type { Vec3 } from './vec.ts';

/** The four marks of the map: a galaxy, a nebula, an open cluster (or a cloud of stars), a globular cluster. */
export const DEEP_KINDS = ['galaxy', 'nebula', 'open', 'globular'] as const;
export type DeepKind = (typeof DEEP_KINDS)[number];

/** What it takes to see it, by NASA's page of the object. */
export const DEEP_VIEWS = ['eye', 'binoculars', 'telescope'] as const;
export type DeepView = (typeof DEEP_VIEWS)[number];

/** The photograph in the object's card. */
export interface DeepPhoto {
  /** The size of the picture in the program, px. */
  width: number;
  height: number;
  /** Who is to be named under it, as NASA's page names them. */
  credit: string;
  /** The photograph shows only a part of the object: Hubble's view is narrow. */
  part: boolean;
}

export interface DeepObject {
  /** "m31": the key of its texts and of its picture. */
  id: string;
  messier: number;
  kind: DeepKind;
  /** Right ascension and declination, degrees, equator and equinox of J2000. */
  ra: number;
  dec: number;
  /** Apparent magnitude: the smaller, the brighter. */
  mag: number;
  lightYears: number;
  view: DeepView;
  /** NASA's page of the object: what the card's facts and text are taken from. */
  page: string;
  photo?: DeepPhoto;
  /** A unit vector to it in the axes of the catalogues. */
  at: Vec3;
  /** The three letters of the constellation whose borders it lies within. */
  constellation: string;
}

type Stored = Omit<DeepObject, 'at' | 'constellation'>;

/** Brightest first. */
export const DEEP: readonly DeepObject[] = (file.objects as unknown as Stored[]).map((o) => ({
  ...o,
  at: starDirection(o.ra, o.dec),
  // The engine takes the right ascension in hours.
  constellation: Constellation(o.ra / 15, o.dec).symbol,
}));

export const DEEP_SOURCE = file.source;

export function deepById(id: string): DeepObject | undefined {
  return DEEP.find((o) => o.id === id);
}

/** The objects within the borders of a constellation (its three letters), brightest first. */
export function deepIn(constellation: string): readonly DeepObject[] {
  return DEEP.filter((o) => o.constellation === constellation);
}

/** "M31": what the catalogue calls it — the name of an object that has no other. */
export const messierName = (o: DeepObject): string => `M${o.messier}`;

/** How narrow the view is, 0 (widest) … 1 (narrowest). */
const nearness = (fov: number): number => Math.max(0, Math.min(1, (SKY.dome.fov.most - fov) / (SKY.dome.fov.most - SKY.dome.fov.least)));

/** Is the object's name written on the map at this width of the view: the nearer, the more names. */
export function deepNamed(o: DeepObject, fov: number): boolean {
  const { wide, narrow } = SKY.deep.named;
  return o.mag <= wide + (narrow - wide) * nearness(fov);
}

/**
 * The object whose mark is under a point of the screen: the nearest one over the horizon within reach of a
 * finger; null — none.
 */
export function deepAt(x: number, y: number, look: Look, frame: Frame, turn: SkyTurn): DeepObject | null {
  let best: { o: DeepObject; gap: number } | null = null;
  for (const o of DEEP) {
    const sky = toSky(turn, o.at);
    if (sky[2] < 0) continue;
    const p = project(look, frame, sky);
    if (!p) continue;
    const gap = Math.hypot(p.x - x, p.y - y);
    if (gap <= SKY.deep.reachPx && (!best || gap < best.gap)) best = { o, gap };
  }
  return best?.o ?? null;
}

/** Where it stands at the moment shown: height, degrees, and the point of the compass. */
export function deepNow(o: DeepObject, turn: SkyTurn): { altitude: number; compass: ReturnType<typeof compassPoint> } {
  const seen = altAz(toSky(turn, o.at));
  return { altitude: seen.altitude, compass: compassPoint(seen.azimuth) };
}

/**
 * How it lives in the sky of a place: it never sets, it never rises, or it comes and goes. `highest` — how
 * high it stands when it crosses the meridian, degrees.
 */
export function deepOverPlace(o: DeepObject, place: Place): { highest: number; stays: 'always' | 'never' | 'sometimes' } {
  const highest = 90 - Math.abs(place.lat - o.dec);
  const lowest = Math.abs(place.lat + o.dec) - 90;
  return { highest, stays: lowest > 0 ? 'always' : highest < 0 ? 'never' : 'sometimes' };
}

/** The day of its best evenings at a place: when it crosses the meridian at the evening hour (see the constellations). */
export function deepBestEvening(o: DeepObject, place: Place, from: Date): Date {
  return bestEveningOf(o.ra / 15, place, from);
}
