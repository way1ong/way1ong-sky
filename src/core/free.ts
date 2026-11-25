// Free flight: the camera is not tied to a body. It stands at a point, looks where the player turns it and
// moves along its line of sight. A step is a share of the gap to the nearest body's surface — so the same
// press crosses the emptiness between planets quickly and creeps up to a planet slowly — and the camera never
// goes nearer to a body than it may in the ordinary view.
import { SKY } from '../config.ts';
import { WORLD_IDS, type WorldId } from './bodies.ts';
import { clampPitch, eye, type View } from './flight.ts';
import { add, dot, length, scale, sub, type Vec3 } from './vec.ts';

export interface FreeView {
  /** Where the camera stands, scene units. */
  at: Vec3;
  /** As in View: the camera looks from this side, so it looks the opposite way. */
  yaw: number;
  pitch: number;
}

type Places = Record<WorldId, Vec3>;
type Radii = Record<WorldId, number>;

/** The unit vector the camera looks along. */
export function lookDirection(free: Pick<FreeView, 'yaw' | 'pitch'>): Vec3 {
  return scale(eye([0, 0, 0], { yaw: free.yaw, pitch: free.pitch, distance: 1 }), -1);
}

/** Leaves a body's view where the camera stands, looking the way it looked. */
export function freeFrom(target: Vec3, view: View): FreeView {
  return { at: eye(target, view), yaw: view.yaw, pitch: view.pitch };
}

/** A drag in free flight turns the camera on the spot: the sky follows the finger, as a body's face does. */
export function turnFree(free: FreeView, yaw: number, pitch: number): FreeView {
  return { ...free, yaw: free.yaw - yaw, pitch: clampPitch(free.pitch - pitch) };
}

/** The body whose surface is nearest, how far that surface is and how far its middle. */
export function nearest(at: Vec3, where: Places, radius: Radii): { id: WorldId; gap: number; distance: number } {
  let best = { id: WORLD_IDS[0] as WorldId, gap: Infinity, distance: Infinity };
  for (const id of WORLD_IDS) {
    const distance = length(sub(at, where[id]));
    const gap = distance - radius[id];
    if (gap < best.gap) best = { id, gap, distance };
  }
  return best;
}

/** Out of every body: no nearer to a middle than the ordinary view may come. */
export function keepOutside(at: Vec3, where: Places, radius: Radii): Vec3 {
  let out = at;
  for (const id of WORLD_IDS) {
    const from = sub(out, where[id]);
    const distance = length(from);
    const least = radius[id] * SKY.camera.closest;
    if (distance >= least) continue;
    // In the very middle there is no way out to choose: straight up.
    out = add(where[id], distance > 0 ? scale(from, least / distance) : [0, least, 0]);
  }
  return out;
}

/**
 * How far the camera may go from a point along a unit direction, up to `wanted`, before it comes as near to a
 * body as it may. It stops there, on its line: pushed aside instead, it would slide round the body and away.
 */
export function clearWay(at: Vec3, direction: Vec3, wanted: number, where: Places, radius: Radii): number {
  let way = wanted;
  for (const id of WORLD_IDS) {
    const least = radius[id] * SKY.camera.closest;
    const from = sub(at, where[id]);
    const along = dot(from, direction);
    // Going away from the body, or past it at a distance: nothing to stop for.
    if (along >= 0) continue;
    const off = dot(from, from) - least * least;
    if (off <= 0) return 0;
    const under = along * along - off;
    if (under > 0) way = Math.min(way, Math.max(0, -along - Math.sqrt(under)));
  }
  return way;
}

/**
 * A move along the line of sight by a share of the gap to the nearest surface (below zero — backwards),
 * stopped before any body and no farther from the Sun than `limit`.
 */
export function advance(free: FreeView, share: number, where: Places, radius: Radii, limit: number): FreeView {
  const gap = Math.max(nearest(free.at, where, radius).gap, 0);
  const direction = scale(lookDirection(free), Math.sign(share));
  let at = keepOutside(add(free.at, scale(direction, clearWay(free.at, direction, Math.abs(share) * gap, where, radius))), where, radius);
  const fromSun = sub(at, where.sun);
  if (length(fromSun) > limit) at = add(where.sun, scale(fromSun, limit / length(fromSun)));
  return { ...free, at };
}

/**
 * The same camera as a body's view has it: a point looked at, ahead by the distance to the nearest body's
 * middle — the picture is drawn around that point, so what is near stays sharp.
 */
export function lookPoint(free: FreeView, where: Places, radius: Radii): { target: Vec3; distance: number } {
  const distance = nearest(free.at, where, radius).distance;
  return { target: add(free.at, scale(lookDirection(free), distance)), distance };
}

/** A body's radius as it is seen from a point, CSS pixels on a screen whose shorter side is `shortSidePx`. */
export function radiusOnScreenPx(bodyRadius: number, distance: number, shortSidePx: number): number {
  return ((bodyRadius / distance) * (shortSidePx / 2)) / Math.tan((SKY.fovDeg * Math.PI) / 360);
}
