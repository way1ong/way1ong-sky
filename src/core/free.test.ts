import { describe, expect, it } from 'vitest';
import { SKY } from '../config.ts';
import { WORLD_IDS, type WorldId } from './bodies.ts';
import { positionsKm } from './ephemeris.ts';
import { eye, flightAt, type View } from './flight.ts';
import { advance, clearWay, freeFrom, keepOutside, lookDirection, lookPoint, nearest, turnFree } from './free.ts';
import { SCALES, scenePositions, sceneRadius } from './scale.ts';
import { dot, length, sub, type Vec3 } from './vec.ts';

const date = new Date('2026-11-24T12:00:00Z');
const world = (mode: (typeof SCALES)[number]) => {
  const where = scenePositions(positionsKm(date), mode);
  const radius = Object.fromEntries(WORLD_IDS.map((id) => [id, sceneRadius(id, mode)])) as Record<WorldId, number>;
  return { where, radius };
};
const view: View = { yaw: 0.6, pitch: 0.4, distance: 3 };

describe('free flight', () => {
  it('starts where the camera stood, looking the way it looked', () => {
    const { where, radius } = world('handy');
    const free = freeFrom(where.earth, { ...view, distance: radius.earth * 4 });
    expect(free.at).toEqual(eye(where.earth, { ...view, distance: radius.earth * 4 }));
    // The Earth is straight ahead.
    const toEarth = sub(where.earth, free.at);
    expect(dot(lookDirection(free), toEarth) / length(toEarth)).toBeCloseTo(1, 12);
    // And the point the picture is drawn around puts the camera back on the same spot.
    const look = lookPoint(free, where, radius);
    const back = eye(look.target, { yaw: free.yaw, pitch: free.pitch, distance: look.distance });
    for (const i of [0, 1, 2] as const) expect(back[i]).toBeCloseTo(free.at[i], 9);
  });

  it('finds the body whose surface is nearest', () => {
    for (const mode of SCALES) {
      const { where, radius } = world(mode);
      for (const id of WORLD_IDS) {
        const near = nearest(eye(where[id], { ...view, distance: radius[id] * 2 }), where, radius);
        expect(near.id, `${mode} ${id}`).toBe(id);
        expect(near.gap).toBeCloseTo(radius[id], 9);
      }
    }
  });

  it('moves along the line of sight by a share of the gap, forwards and backwards', () => {
    const { where, radius } = world('true');
    const free = freeFrom(where.mars, { ...view, distance: radius.mars * 10 });
    const gap = nearest(free.at, where, radius).gap;
    const nearer = advance(free, 0.5, where, radius, 1e9);
    const farther = advance(free, -0.5, where, radius, 1e9);
    expect(length(sub(nearer.at, free.at))).toBeCloseTo(gap / 2, 9);
    expect(length(sub(nearer.at, where.mars))).toBeLessThan(length(sub(free.at, where.mars)));
    expect(length(sub(farther.at, where.mars))).toBeGreaterThan(length(sub(free.at, where.mars)));
  });

  it('never comes nearer to a body than the ordinary view may, however long it flies at it', () => {
    for (const mode of SCALES) {
      const { where, radius } = world(mode);
      for (const id of WORLD_IDS) {
        let free = freeFrom(where[id], { ...view, distance: radius[id] * 40 });
        for (let i = 0; i < 400; i++) free = advance(free, 0.9, where, radius, 1e9);
        for (const other of WORLD_IDS) expect(length(sub(free.at, where[other])) / radius[other], `${mode} ${id} ${other}`).toBeGreaterThanOrEqual(SKY.camera.closest - 1e-9);
        expect(length(sub(free.at, where[id])) / radius[id]).toBeCloseTo(SKY.camera.closest, 6);
      }
    }
  });

  it('stops before a body on its line, and passes one that is off the line', () => {
    const { where, radius } = world('handy');
    const least = radius.saturn * SKY.camera.closest;
    const from: Vec3 = [where.saturn[0] + radius.saturn * 10, where.saturn[1], where.saturn[2]];
    expect(clearWay(from, [-1, 0, 0], radius.saturn * 100, where, radius)).toBeCloseTo(radius.saturn * 10 - least, 9);
    expect(clearWay(from, [1, 0, 0], radius.saturn * 3, where, radius)).toBe(radius.saturn * 3);
    const aside: Vec3 = [from[0], from[1] + least * 1.01, from[2]];
    expect(clearWay(aside, [-1, 0, 0], radius.saturn * 12, where, radius)).toBe(radius.saturn * 12);
    // Already as near as it may be and still looking at the body: no way.
    expect(clearWay([where.saturn[0] + least, where.saturn[1], where.saturn[2]], [-1, 0, 0], 1, where, radius)).toBe(0);
  });

  it('is pushed out of a body that has moved over it, and never past the far limit', () => {
    const { where, radius } = world('handy');
    const inside: Vec3 = [where.jupiter[0] + radius.jupiter * 0.3, where.jupiter[1], where.jupiter[2]];
    expect(length(sub(keepOutside(inside, where, radius), where.jupiter))).toBeCloseTo(radius.jupiter * SKY.camera.closest, 9);
    expect(length(sub(keepOutside(where.jupiter, where, radius), where.jupiter))).toBeCloseTo(radius.jupiter * SKY.camera.closest, 9);
    let free = freeFrom(where.neptune, { ...view, distance: radius.neptune * 5 });
    const limit = length(where.neptune) * 1.2;
    for (let i = 0; i < 200; i++) free = advance(free, -0.9, where, radius, limit);
    expect(length(sub(free.at, where.sun))).toBeLessThanOrEqual(limit * (1 + 1e-12));
  });

  it('turns on the spot: the place stays, the sight follows the drag back', () => {
    const { where, radius } = world('handy');
    const free = freeFrom(where.earth, { ...view, distance: radius.earth * 4 });
    const turned = turnFree(free, 0.2, 0.1);
    expect(turned.at).toEqual(free.at);
    expect(turned.yaw).toBeCloseTo(free.yaw - 0.2, 12);
    expect(turned.pitch).toBeCloseTo(free.pitch - 0.1, 12);
  });

  it('hands over to a flight that starts on the very spot', () => {
    const { where, radius } = world('handy');
    const free = advance(freeFrom(where.earth, { ...view, distance: radius.earth * 6 }), -0.7, where, radius, 1e9);
    const look = lookPoint(free, where, radius);
    const flight = { from: 'earth' as const, fromPoint: look.target, to: 'saturn' as const, startDistance: look.distance, endDistance: radius.saturn * 4, startedAt: 0, durationMs: 1000 };
    const start = flightAt(flight, 0, where);
    const camera = eye(start.target, { yaw: free.yaw, pitch: free.pitch, distance: start.distance });
    for (const i of [0, 1, 2] as const) expect(camera[i]).toBeCloseTo(free.at[i], 9);
    const end = flightAt(flight, 1000, where);
    expect(end.target).toEqual(where.saturn);
    expect(end.distance).toBeCloseTo(radius.saturn * 4, 9);
  });
});
