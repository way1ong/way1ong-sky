import { describe, expect, it } from 'vitest';
import { SKY } from '../config.ts';
import { firstLook, horizonOnScreen, project, reach, skyDirection, turnLook, zoomLook, type Frame, type Look } from './dome.ts';

const frame: Frame = { cx: 200, cy: 300, half: 180 };
const south: Look = { azimuth: 180, altitude: 30, fov: 90 };

describe('the dome of the sky on the screen', () => {
  it('puts what the view looks at in the middle, and the edge of the view on the edge of the screen', () => {
    const middle = project(south, frame, skyDirection(180, 30));
    expect(middle?.x).toBeCloseTo(200, 9);
    expect(middle?.y).toBeCloseTo(300, 9);
    // Half of the field of view above the middle: half of the shorter side up.
    const above = project(south, frame, skyDirection(180, 75));
    expect(above?.x).toBeCloseTo(200, 9);
    expect(above?.y).toBeCloseTo(300 - 180, 9);
    expect(reach(south, frame, 45)).toBeCloseTo(180, 9);
  });

  it('shows the sky from inside: looking south, east is to the left and west to the right', () => {
    const east = project(south, frame, skyDirection(135, 30)) as { x: number; y: number };
    const west = project(south, frame, skyDirection(225, 30)) as { x: number; y: number };
    expect(east.x).toBeLessThan(200);
    expect(west.x).toBeGreaterThan(200);
    expect(east.y).toBeCloseTo(west.y, 9);
    // Looking north it is the other way round.
    const north: Look = { ...south, azimuth: 0 };
    expect((project(north, frame, skyDirection(45, 30)) as { x: number }).x).toBeGreaterThan(200);
  });

  it('puts higher things higher on the screen and leaves out what is behind the back', () => {
    const low = project(south, frame, skyDirection(180, 10)) as { y: number };
    const high = project(south, frame, skyDirection(180, 60)) as { y: number };
    expect(high.y).toBeLessThan(low.y);
    expect(project(south, frame, skyDirection(0, -30))).toBeNull();
    expect(project(south, frame, skyDirection(0, 20))).toBeNull();
  });

  it('keeps shapes: a small triangle is drawn with the same angles wherever it is in the view', () => {
    const angleAt = (look: Look, a: [number, number], b: [number, number], c: [number, number]) => {
      const [p, q, r] = [a, b, c].map(([az, alt]) => project(look, frame, skyDirection(az, alt)) as { x: number; y: number }) as [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }];
      return Math.atan2(r.y - p.y, r.x - p.x) - Math.atan2(q.y - p.y, q.x - p.x);
    };
    // Along the meridian and along the equal heights: a right angle on the sphere, in the middle and at the edge.
    for (const look of [south, { ...south, azimuth: 140, altitude: 55 }, { ...south, fov: 125 }]) {
      const drawn = angleAt(look, [170, 40], [170, 40.01], [170.013, 40]);
      expect(Math.abs(Math.sin(drawn))).toBeCloseTo(1, 4);
    }
  });

  it('follows the finger: a drag to the right brings the sky to the right, a drag down brings it down', () => {
    const star = skyDirection(170, 40);
    const before = project(south, frame, star) as { x: number; y: number };
    const right = project(turnLook(south, 30, 0, frame), frame, star) as { x: number; y: number };
    const down = project(turnLook(south, 0, 30, frame), frame, star) as { x: number; y: number };
    expect(right.x).toBeGreaterThan(before.x);
    expect(down.y).toBeGreaterThan(before.y);
    // In the middle of the view the sky moves as far as the finger.
    const centre = skyDirection(180, 30);
    expect((project(turnLook(south, 0, 3, frame), frame, centre) as { y: number }).y - 300).toBeCloseTo(3, 2);
  });

  it('never looks past the zenith or under the feet, and keeps the bearing on the circle', () => {
    expect(turnLook(south, 0, 5000, frame).altitude).toBe(90);
    expect(turnLook(south, 0, -5000, frame).altitude).toBe(-90);
    const round = turnLook({ ...south, azimuth: 5 }, 100, 0, frame).azimuth;
    expect(round).toBeGreaterThan(300);
    expect(round).toBeLessThan(360);
  });

  it('zooms within its limits and starts looking south, over the horizon', () => {
    expect(zoomLook(south, 0.001).fov).toBe(SKY.dome.fov.least);
    expect(zoomLook(south, 1000).fov).toBe(SKY.dome.fov.most);
    expect(zoomLook(south, 0.9).fov).toBeCloseTo(81, 9);
    const first = firstLook();
    expect(first.azimuth).toBe(180);
    expect(first.altitude).toBeGreaterThan(0);
    expect(first.fov).toBe(SKY.dome.fov.first);
  });

  it('draws the horizon as the circle on which every point of the horizon falls', () => {
    for (const look of [south, { ...south, altitude: 70 }, { ...south, altitude: -25, azimuth: 40 }, { ...south, altitude: 89 }]) {
      const line = horizonOnScreen(look, frame);
      expect(line.kind).toBe('circle');
      if (line.kind !== 'circle') continue;
      for (let az = 0; az < 360; az += 15) {
        const at = project({ ...look, fov: look.fov }, frame, skyDirection(az, 0));
        if (at) expect(Math.hypot(at.x - line.cx, at.y - line.cy)).toBeCloseTo(line.r, 6);
      }
      // The zenith is inside the circle exactly when the view looks up.
      const zenith = project(look, frame, [0, 0, 1]);
      if (zenith) expect(Math.hypot(zenith.x - line.cx, zenith.y - line.cy) < line.r).toBe(line.skyInside);
    }
    const level = horizonOnScreen({ ...south, altitude: 0 }, frame);
    expect(level).toEqual({ kind: 'line', y: 300 });
  });
});
