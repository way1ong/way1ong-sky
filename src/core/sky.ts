// The sky from a place on the Earth: where a star or a body stands over the horizon at a moment, and when a
// body rises and sets. astronomy-engine does the astronomy; this module turns it into what the sky map needs.
// A direction in the sky is a unit vector [east, north, up]: up is the zenith, the horizon is up = 0.
import { Body, Equator, Illumination, MakeTime, Observer, RotateVector, Rotation_EQJ_HOR, SearchRiseSet, Vector, type RotationMatrix } from 'astronomy-engine';
import type { BodyId } from './bodies.ts';
import type { Vec3 } from './vec.ts';

/** A place on the Earth: degrees north and east. */
export interface Place {
  lat: number;
  lon: number;
}

/** What is seen in the sky besides the stars: everything but the ground under the feet. */
export const SKY_BODY_IDS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'] as const satisfies readonly BodyId[];
export type SkyBodyId = (typeof SKY_BODY_IDS)[number];

/** The engine's own name of each body of the sky. */
export const ENGINE_BODY: Record<SkyBodyId, Body> = {
  sun: Body.Sun,
  moon: Body.Moon,
  mercury: Body.Mercury,
  venus: Body.Venus,
  mars: Body.Mars,
  jupiter: Body.Jupiter,
  saturn: Body.Saturn,
  uranus: Body.Uranus,
  neptune: Body.Neptune,
};

const observer = (place: Place) => new Observer(place.lat, place.lon, 0);

/** How the sky is turned over a place at a moment: made once, then used for every star. */
export interface SkyTurn {
  matrix: RotationMatrix;
  date: Date;
  place: Place;
}

export function skyTurn(place: Place, date: Date): SkyTurn {
  return { matrix: Rotation_EQJ_HOR(date, observer(place)), date, place };
}

/**
 * A star's place among the stars as a unit vector in the axes of the catalogues (equator and equinox of
 * J2000): right ascension and declination in degrees.
 */
export function starDirection(raDeg: number, decDeg: number): Vec3 {
  const ra = (raDeg * Math.PI) / 180;
  const dec = (decDeg * Math.PI) / 180;
  return [Math.cos(dec) * Math.cos(ra), Math.cos(dec) * Math.sin(ra), Math.sin(dec)];
}

/** Where a direction among the stars is in the sky of the place: [east, north, up]. */
export function toSky(turn: SkyTurn, direction: Vec3): Vec3 {
  const m = turn.matrix.rot as [[number, number, number], [number, number, number], [number, number, number]];
  const [x, y, z] = direction;
  // The engine's horizon axes are north, west, zenith; its matrix is stored by columns.
  const north = m[0][0] * x + m[1][0] * y + m[2][0] * z;
  const west = m[0][1] * x + m[1][1] * y + m[2][1] * z;
  const up = m[0][2] * x + m[1][2] * y + m[2][2] * z;
  return [-west, north, up];
}

/** Height over the horizon and the compass bearing (north 0, east 90), degrees. No bending of light by the air. */
export function altAz(sky: Vec3): { altitude: number; azimuth: number } {
  const azimuth = (Math.atan2(sky[0], sky[1]) * 180) / Math.PI;
  return { altitude: (Math.asin(Math.max(-1, Math.min(1, sky[2]))) * 180) / Math.PI, azimuth: (azimuth + 360) % 360 };
}

/** Where a body is among the stars as seen from the place — the Moon is near enough for the place to matter. */
export function bodyDirection(id: SkyBodyId, place: Place, date: Date): Vec3 {
  const at = Equator(ENGINE_BODY[id], date, observer(place), false, true).vec;
  const l = Math.hypot(at.x, at.y, at.z);
  return [at.x / l, at.y / l, at.z / l];
}

/** Where a body stands in the sky of the place: [east, north, up]. */
export function bodyInSky(id: SkyBodyId, turn: SkyTurn): Vec3 {
  return toSky(turn, bodyDirection(id, turn.place, turn.date));
}

/**
 * The next rising and the next setting of a body after a moment, each looked for within `days`; null — it
 * does not happen in that time (the Sun in a polar summer). The engine counts a rising as the moment the
 * upper edge shows over a flat horizon, the bending of light by the air taken into account.
 */
/** How bright a body is at a moment, as the engine reckons it: the smaller the number, the brighter. */
export function bodyMagnitude(id: SkyBodyId, date: Date): number {
  return Illumination(ENGINE_BODY[id], date).mag;
}

export function riseAndSet(id: SkyBodyId, place: Place, from: Date, days = 1): { rise: Date | null; set: Date | null } {
  const find = (direction: 1 | -1) => SearchRiseSet(ENGINE_BODY[id], observer(place), direction, from, days)?.date ?? null;
  return { rise: find(1), set: find(-1) };
}

/** For tests and checks: the same turn done the engine's long way, through coordinates of the date. */
export function engineVector(direction: Vec3, date: Date): Vector {
  return new Vector(direction[0], direction[1], direction[2], MakeTime(date));
}

export { RotateVector };
