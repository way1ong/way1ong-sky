// A touch on the sky map: which star or body is under the finger, and what the map can tell about it —
// its constellation, how bright it is, where it stands now and, for a body, when it rises and sets.
import { Constellation, Equator, Observer } from 'astronomy-engine';
import { SKY } from '../config.ts';
import { project, type Frame, type Look } from './dome.ts';
import { ENGINE_BODY, SKY_BODY_IDS, altAz, bodyInSky, bodyMagnitude, riseAndSet, toSky, type Place, type SkyBodyId, type SkyTurn } from './sky.ts';
import { STARS } from './stars.ts';
import { compassPoint, moonPhaseName, type MoonPhaseName } from './tonight.ts';
import { moonLitFraction } from './ephemeris.ts';
import type { Vec3 } from './vec.ts';

/** What was touched: a body, or a star by its place in the list of stars. */
export type Picked = { kind: 'body'; id: SkyBodyId } | { kind: 'star'; index: number };

/** The faintest star drawn at a width of the view: the wider the view, the fewer faint stars. */
export function faintestShown(fov: number): number {
  const { wide, narrow } = SKY.paint.faintest;
  const near = Math.max(0, Math.min(1, (SKY.dome.fov.most - fov) / (SKY.dome.fov.most - SKY.dome.fov.least)));
  return wide + (narrow - wide) * near;
}

/** A planet too faint for the eye (the program's measure) — drawn smaller, said so in its card. */
export function tooFaintForTheEye(id: SkyBodyId, magnitude: number): boolean {
  return id !== 'sun' && id !== 'moon' && magnitude > SKY.tonight.eyeMagnitude;
}

/** The radius of a body's mark on the map, CSS px. */
export function markRadius(id: SkyBodyId, magnitude: number): number {
  const { discPx, faintPlanet } = SKY.paint;
  return id === 'sun' ? discPx.sun : id === 'moon' ? discPx.moon : tooFaintForTheEye(id, magnitude) ? faintPlanet.px : discPx.planet;
}

/** Where what was picked stands in the sky of the place: [east, north, up]. */
export function pickedInSky(what: Picked, turn: SkyTurn): Vec3 {
  return what.kind === 'body' ? bodyInSky(what.id, turn) : toSky(turn, (STARS[what.index] as (typeof STARS)[number]).at);
}

/**
 * What is under a point of the screen. A body wins over the stars round it (its name is on the map, so it is
 * what the finger is after), also under the horizon; of the stars — only those drawn and over the horizon,
 * the nearest, a brighter one a little farther. Null — nothing within reach.
 */
export function pickAt(x: number, y: number, look: Look, frame: Frame, turn: SkyTurn): Picked | null {
  const { reachPx, brighterPx } = SKY.pick;
  let body: { id: SkyBodyId; gap: number } | null = null;
  for (const id of SKY_BODY_IDS) {
    const p = project(look, frame, bodyInSky(id, turn));
    if (!p) continue;
    const gap = Math.hypot(p.x - x, p.y - y) - markRadius(id, bodyMagnitude(id, turn.date));
    if (gap <= reachPx && (!body || gap < body.gap)) body = { id, gap };
  }
  if (body) return { kind: 'body', id: body.id };

  const faintest = faintestShown(look.fov);
  let star: { index: number; cost: number } | null = null;
  for (let index = 0; index < STARS.length; index++) {
    const s = STARS[index] as (typeof STARS)[number];
    if (s.mag > faintest) break;
    const sky = toSky(turn, s.at);
    if (sky[2] < 0) continue;
    const p = project(look, frame, sky);
    if (!p) continue;
    const gap = Math.hypot(p.x - x, p.y - y);
    if (gap > reachPx) continue;
    const cost = gap + s.mag * brighterPx;
    if (!star || cost < star.cost) star = { index, cost };
  }
  return star ? { kind: 'star', index: star.index } : null;
}

export type Brightness = 'veryBright' | 'bright' | 'medium' | 'faint';

/** A magnitude in a word (the program's own measure, config.ts). */
export function brightnessWord(magnitude: number): Brightness {
  const { veryBright, bright, medium } = SKY.pick.words;
  return magnitude <= veryBright ? 'veryBright' : magnitude <= bright ? 'bright' : magnitude <= medium ? 'medium' : 'faint';
}

export interface SkyInfo {
  what: Picked;
  /** The three letters of the constellation it stands in, as the lines of the constellations are keyed. */
  constellation: string;
  /** How bright: the smaller the number, the brighter. Not told for the Sun and the Moon. */
  magnitude: number | null;
  brightness: Brightness | null;
  /** A planet too faint to be found by the eye. */
  tooFaint: boolean;
  /** Where it stands at the moment: degrees over the horizon (under it when negative) and the side of the world. */
  altitude: number;
  compass: ReturnType<typeof compassPoint>;
  /** For a body: the next rising and setting after the moment; null — none within a day. */
  rise: Date | null;
  set: Date | null;
  /** For the Moon: its look and how much of the disc is lit, 0…1. */
  moon: { phase: MoonPhaseName; lit: number } | null;
}

/** The constellation a body stands in as seen from the place: by its J2000 coordinates, as the engine wants. */
function bodyConstellation(id: SkyBodyId, place: Place, date: Date): string {
  const at = Equator(ENGINE_BODY[id], date, new Observer(place.lat, place.lon, 0), false, true);
  return Constellation(at.ra, at.dec).symbol;
}

/** What the map can tell about a star or a body at a moment over a place. */
export function skyInfo(what: Picked, turn: SkyTurn): SkyInfo {
  const { altitude, azimuth } = altAz(pickedInSky(what, turn));
  const here = { what, altitude, compass: compassPoint(azimuth) };
  if (what.kind === 'star') {
    const star = STARS[what.index] as (typeof STARS)[number];
    // The engine takes the right ascension in hours.
    return { ...here, constellation: Constellation(star.ra / 15, star.dec).symbol, magnitude: star.mag, brightness: brightnessWord(star.mag), tooFaint: false, rise: null, set: null, moon: null };
  }
  const disc = what.id === 'sun' || what.id === 'moon';
  const magnitude = disc ? null : bodyMagnitude(what.id, turn.date);
  const tooFaint = magnitude !== null && tooFaintForTheEye(what.id, magnitude);
  return {
    ...here,
    constellation: bodyConstellation(what.id, turn.place, turn.date),
    magnitude,
    brightness: magnitude === null || tooFaint ? null : brightnessWord(magnitude),
    tooFaint,
    ...riseAndSet(what.id, turn.place, turn.date, 1),
    moon: what.id === 'moon' ? { phase: moonPhaseName(turn.date), lit: moonLitFraction(turn.date) } : null,
  };
}
