// The camera: it always looks at one body, from a direction (turn, tilt) and a distance counted in radii of
// that body — so a planet fills the screen alike whatever its size and whichever the scale. A flight moves
// the point looked at from body to body and changes the distance smoothly; distances change by a ratio, not
// by a difference, because they span from a moon's doorstep to the whole system.
import { SKY } from '../config.ts';
import type { BodyId } from './bodies.ts';
import { lerp, type Vec3 } from './vec.ts';

export interface View {
  /** Turn around the vertical axis and tilt above the plane of the orbits, radians. */
  yaw: number;
  pitch: number;
  /** Distance from the middle of the body looked at, scene units. */
  distance: number;
}

/** Almost straight down or up, never over the pole: the picture would flip. */
const MAX_PITCH = (89 * Math.PI) / 180;

export function clampPitch(pitch: number): number {
  return Math.min(MAX_PITCH, Math.max(-MAX_PITCH, pitch));
}

export function clampDistance(distance: number, bodyRadius: number, farthest: number): number {
  return Math.min(Math.max(farthest, bodyRadius * SKY.camera.closest), Math.max(bodyRadius * SKY.camera.closest, distance));
}

/** Where the camera stands, given the point it looks at. */
export function eye(target: Vec3, view: View): Vec3 {
  const flat = Math.cos(view.pitch) * view.distance;
  return [target[0] + flat * Math.sin(view.yaw), target[1] + Math.sin(view.pitch) * view.distance, target[2] + flat * Math.cos(view.yaw)];
}

/** The turn and the tilt from which the camera looks along a direction: it stands on that side of its target. */
export function facing(dir: Vec3, turnBy = 0): { yaw: number; pitch: number } {
  const l = Math.hypot(dir[0], dir[1], dir[2]) || 1;
  return { yaw: Math.atan2(dir[0], dir[2]) + turnBy, pitch: clampPitch(Math.asin(dir[1] / l)) };
}

/** How far the camera stops from a body it has flown to. */
export function arrivalDistance(id: BodyId, bodyRadius: number): number {
  return bodyRadius * (id === 'sun' ? SKY.camera.arriveSun : SKY.camera.arrive);
}

/**
 * From how far a circle of this radius around the point looked at fits the screen: the field of view is
 * measured across the shorter side, and the view is tilted, so the circle is seen as wide as it is.
 */
export function distanceToFit(radius: number, fovDeg: number = SKY.fovDeg): number {
  return (radius / Math.tan((fovDeg * Math.PI) / 360)) * 1.08;
}

/** Slow start, slow end. */
export function ease(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

export interface Flight {
  from: BodyId;
  /** A flight out of free flight starts from this point instead of a body. */
  fromPoint?: Vec3;
  to: BodyId;
  startDistance: number;
  endDistance: number;
  startedAt: number;
  durationMs: number;
}

/** How far a flight has gone at a moment, 0…1. */
export function progress(flight: Flight, now: number): number {
  return flight.durationMs <= 0 ? 1 : Math.min(1, Math.max(0, (now - flight.startedAt) / flight.durationMs));
}

/** The point looked at and the distance during a flight; `where` gives every body's place right now. */
export function flightAt(flight: Flight, now: number, where: Record<BodyId, Vec3>): { target: Vec3; distance: number } {
  const t = ease(progress(flight, now));
  return { target: lerp(flight.fromPoint ?? where[flight.from], where[flight.to], t), distance: flight.startDistance * (flight.endDistance / flight.startDistance) ** t };
}
