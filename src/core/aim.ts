// "Point the phone at the sky": from the tilt a phone's browser reports, where the back of the phone points.
//
// The browser gives three angles (the Device Orientation API of the W3C): `alpha` — the turn about the axis
// out of the screen, `beta` — about the axis across the screen, `gamma` — about the axis along the screen,
// applied in that order to a phone that lies flat, screen up, its top to the north. The frame of the ground is
// the one of the sky map: [east, north, up].
//
// None of this is checked against a real phone here — only against the definition above. The compass inside
// a phone is a rough one, and the app says so.
import { SKY } from '../config.ts';
import { length, lerp, normalize, type Vec3 } from './vec.ts';

/** The three angles as the browser reports them, degrees; `alpha` counted from the north. */
export interface Tilt {
  alpha: number;
  beta: number;
  gamma: number;
}

/** What of a browser's orientation event the logic reads. `webkitCompassHeading` is what iPhones add. */
export interface TiltEvent {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
  absolute?: boolean;
  webkitCompassHeading?: number | null;
}

const RAD = Math.PI / 180;
const turn = (degrees: number): number => ((degrees % 360) + 360) % 360;

/** Where the back of the phone points — the way one looks through it: [east, north, up], length 1. */
export function backOfPhone(tilt: Tilt): Vec3 {
  const [a, b, g] = [tilt.alpha * RAD, tilt.beta * RAD, tilt.gamma * RAD];
  // The back is [0, 0, -1] in the phone; turned about its long axis (gamma), its short axis (beta), then the vertical (alpha).
  const afterGamma: Vec3 = [-Math.sin(g), 0, -Math.cos(g)];
  const afterBeta: Vec3 = [afterGamma[0], -Math.sin(b) * afterGamma[2], Math.cos(b) * afterGamma[2]];
  return [Math.cos(a) * afterBeta[0] - Math.sin(a) * afterBeta[1], Math.sin(a) * afterBeta[0] + Math.cos(a) * afterBeta[1], afterBeta[2]];
}

/** The compass bearing (north 0, east 90) and the height over the horizon of a direction, degrees. */
export function bearingOf(direction: Vec3): { azimuth: number; altitude: number } {
  const [east, north, up] = normalize(direction);
  return { azimuth: turn(Math.atan2(east, north) / RAD), altitude: Math.asin(Math.max(-1, Math.min(1, up))) / RAD };
}

/**
 * The `alpha` of a phone whose top points along a compass heading (clockwise from the north) while it lies
 * flat: `alpha` is counted the other way round.
 */
export function alphaOfHeading(heading: number): number {
  return turn(360 - heading);
}

/** Does the phone lie flat enough for its compass heading to mean "where its top points"? */
export function liesLevel(event: { beta: number; gamma: number }): boolean {
  return Math.abs(event.beta) <= SKY.aim.levelDeg && Math.abs(event.gamma) <= SKY.aim.levelDeg;
}

/** What is known about the north so far, for a phone that counts `alpha` from wherever it was switched on. */
export interface North {
  /** Added to the phone's own `alpha` to count it from the north; null — not found yet. */
  offset: number | null;
}

export const noNorth = (): North => ({ offset: null });

/** The shortest way round from one angle to another, degrees, -180…180. */
export function angleBetween(from: number, to: number): number {
  return turn(to - from + 180) - 180;
}

/**
 * One event of the browser turned into angles counted from the north, or null when it cannot be.
 *
 * Three kinds of phones: one that says its `alpha` is counted from the north (`absolute`) is believed; an
 * iPhone counts `alpha` from where it was switched on and gives a compass heading beside it — the difference
 * is learnt while the phone lies level and kept when it is raised, since what the heading means for a raised
 * phone is not known here; a phone with neither cannot tell where the north is.
 */
export function readTilt(event: TiltEvent, north: North): { tilt: Tilt | null; north: North; needsLevel: boolean } {
  const { alpha, beta, gamma } = event;
  if (alpha === null || beta === null || gamma === null || ![alpha, beta, gamma].every(Number.isFinite)) return { tilt: null, north, needsLevel: false };
  if (event.absolute === true) return { tilt: { alpha, beta, gamma }, north, needsLevel: false };
  const heading = event.webkitCompassHeading;
  if (typeof heading !== 'number' || !Number.isFinite(heading) || heading < 0) return { tilt: null, north, needsLevel: false };
  let offset = north.offset;
  if (liesLevel({ beta, gamma })) {
    const now = turn(alphaOfHeading(heading) - alpha);
    offset = offset === null ? now : turn(offset + angleBetween(offset, now) * SKY.aim.northShare);
  }
  if (offset === null) return { tilt: null, north, needsLevel: true };
  return { tilt: { alpha: turn(alpha + offset), beta, gamma }, north: { offset }, needsLevel: false };
}

/**
 * The view follows the phone softly: of the way to where the phone points now it covers a share that grows
 * with the time passed, so a trembling hand does not shake the sky. `ms` — since the last step.
 */
export function eased(from: Vec3, to: Vec3, ms: number): Vec3 {
  const share = 1 - Math.exp(-Math.max(0, ms) / SKY.aim.settleMs);
  const between = lerp(from, to, share);
  // Straight opposite directions have no way between them: jump.
  return length(between) < 1e-6 ? to : normalize(between);
}
