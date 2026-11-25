import { describe, expect, it } from 'vitest';
import { SKY } from '../config.ts';
import { alphaOfHeading, angleBetween, backOfPhone, bearingOf, eased, liesLevel, noNorth, readTilt } from './aim.ts';
import { skyDirection } from './dome.ts';
import { dot, length, type Vec3 } from './vec.ts';

const near = (a: Vec3, b: Vec3) => {
  for (let i = 0; i < 3; i += 1) expect(a[i]).toBeCloseTo(b[i]!, 9);
};

describe('where the back of the phone points', () => {
  it('a phone flat on a table looks at the ground', () => {
    near(backOfPhone({ alpha: 0, beta: 0, gamma: 0 }), [0, 0, -1]);
    near(backOfPhone({ alpha: 123, beta: 0, gamma: 0 }), [0, 0, -1]);
  });

  it('a phone held upright, its top to the sky, looks at the horizon — north when alpha is 0', () => {
    near(backOfPhone({ alpha: 0, beta: 90, gamma: 0 }), [0, 1, 0]);
  });

  it('alpha is counted against the compass: a quarter turn of alpha looks west', () => {
    near(backOfPhone({ alpha: 90, beta: 90, gamma: 0 }), [-1, 0, 0]);
    expect(bearingOf(backOfPhone({ alpha: 90, beta: 90, gamma: 0 })).azimuth).toBeCloseTo(270, 9);
    expect(bearingOf(backOfPhone({ alpha: 270, beta: 90, gamma: 0 })).azimuth).toBeCloseTo(90, 9);
  });

  it('a phone held over the head, screen down, looks at the zenith', () => {
    near(backOfPhone({ alpha: 40, beta: 180, gamma: 0 }), [0, 0, 1]);
    near(backOfPhone({ alpha: 40, beta: -180, gamma: 0 }), [0, 0, 1]);
  });

  it('raised from the horizon by an angle, it looks that high, on the same bearing', () => {
    for (const up of [10, 35, 60, 85]) {
      const seen = bearingOf(backOfPhone({ alpha: 330, beta: 90 + up, gamma: 0 }));
      expect(seen.altitude).toBeCloseTo(up, 9);
      expect(seen.azimuth).toBeCloseTo(30, 9);
    }
  });

  it('a phone held on its side looks at the horizon too', () => {
    // top to the north, turned about its long axis: the screen faces east, the back looks west — and the other way round
    near(backOfPhone({ alpha: 0, beta: 0, gamma: 90 }), [-1, 0, 0]);
    near(backOfPhone({ alpha: 0, beta: 0, gamma: -90 }), [1, 0, 0]);
  });

  it('is a direction of length 1 whatever the angles', () => {
    for (let alpha = 0; alpha < 360; alpha += 37) for (let beta = -180; beta < 180; beta += 29) for (let gamma = -90; gamma < 90; gamma += 23) expect(length(backOfPhone({ alpha, beta, gamma }))).toBeCloseTo(1, 9);
  });

  it('turning alpha turns the bearing the other way and keeps the height', () => {
    const tilt = { alpha: 50, beta: 120, gamma: 15 };
    const first = bearingOf(backOfPhone(tilt));
    const turned = bearingOf(backOfPhone({ ...tilt, alpha: tilt.alpha + 70 }));
    expect(turned.altitude).toBeCloseTo(first.altitude, 9);
    expect(angleBetween(turned.azimuth, first.azimuth)).toBeCloseTo(70, 9);
  });
});

describe('the bearing and the height of a direction', () => {
  it('is what the sky map calls a bearing and a height', () => {
    for (const [azimuth, altitude] of [[0, 0], [90, 0], [200, 45], [359, -30], [123, 89]] as const) {
      const back = bearingOf(skyDirection(azimuth, altitude));
      expect(back.azimuth).toBeCloseTo(azimuth, 9);
      expect(back.altitude).toBeCloseTo(altitude, 9);
    }
  });
});

describe('the north of a phone that counts from where it was switched on', () => {
  it('a compass heading is alpha counted the other way: top to the east is alpha 270', () => {
    expect(alphaOfHeading(90)).toBe(270);
    expect(alphaOfHeading(0)).toBe(0);
    // a flat phone with that alpha does point its top to the east: its back raised to the horizon looks east
    expect(bearingOf(backOfPhone({ alpha: alphaOfHeading(90), beta: 90, gamma: 0 })).azimuth).toBeCloseTo(90, 9);
  });

  it('a phone that says its alpha is counted from the north is believed as it is', () => {
    const read = readTilt({ alpha: 10, beta: 100, gamma: 5, absolute: true }, noNorth());
    expect(read.tilt).toEqual({ alpha: 10, beta: 100, gamma: 5 });
    expect(read.needsLevel).toBe(false);
  });

  it('a phone with neither a north nor a compass gives nothing, and asks for nothing', () => {
    const read = readTilt({ alpha: 10, beta: 100, gamma: 5, absolute: false }, noNorth());
    expect(read.tilt).toBeNull();
    expect(read.needsLevel).toBe(false);
    expect(readTilt({ alpha: null, beta: null, gamma: null, absolute: true }, noNorth()).tilt).toBeNull();
  });

  it('an iPhone raised before it lay level is asked to lie level first', () => {
    const read = readTilt({ alpha: 200, beta: 100, gamma: 0, webkitCompassHeading: 45 }, noNorth());
    expect(read.tilt).toBeNull();
    expect(read.needsLevel).toBe(true);
  });

  it('learns the north while level and keeps it when raised, whatever the heading says then', () => {
    // level, top to the east (heading 90), the phone's own alpha happens to be 20
    const level = readTilt({ alpha: 20, beta: 5, gamma: -3, webkitCompassHeading: 90 }, noNorth());
    expect(level.tilt?.alpha).toBeCloseTo(270, 9);
    // raised to 30° over the horizon without turning: the heading is not trusted any more
    const raised = readTilt({ alpha: 20, beta: 120, gamma: 0, webkitCompassHeading: 301 }, level.north);
    expect(raised.north).toEqual(level.north);
    const seen = bearingOf(backOfPhone(raised.tilt!));
    expect(seen.azimuth).toBeCloseTo(90, 9);
    expect(seen.altitude).toBeCloseTo(30, 9);
  });

  it('while level, follows the compass a share at a time — across the north too', () => {
    const first = readTilt({ alpha: 0, beta: 0, gamma: 0, webkitCompassHeading: 2 }, noNorth());
    expect(first.north.offset).toBeCloseTo(358, 9);
    const next = readTilt({ alpha: 0, beta: 0, gamma: 0, webkitCompassHeading: 354 }, first.north);
    // the compass now says 6: the offset moves from 358 towards 6 the short way, through 0
    expect(angleBetween(358, next.north.offset!)).toBeCloseTo(8 * SKY.aim.northShare, 9);
  });

  it('a heading the phone marks as unknown (negative) is not used', () => {
    expect(readTilt({ alpha: 0, beta: 0, gamma: 0, webkitCompassHeading: -1 }, noNorth()).tilt).toBeNull();
  });

  it('level is level both ways', () => {
    expect(liesLevel({ beta: 0, gamma: 0 })).toBe(true);
    expect(liesLevel({ beta: SKY.aim.levelDeg + 1, gamma: 0 })).toBe(false);
    expect(liesLevel({ beta: 0, gamma: -SKY.aim.levelDeg - 1 })).toBe(false);
  });
});

describe('the view follows the phone softly', () => {
  const from = skyDirection(180, 20);
  const to = skyDirection(200, 40);

  it('no time — no move; a long time — there', () => {
    near(eased(from, to, 0), from);
    near(eased(from, to, SKY.aim.settleMs * 40), to);
  });

  it('gets nearer with every step and never passes', () => {
    let at = from;
    let left = Math.acos(dot(at, to));
    for (let i = 0; i < 20; i += 1) {
      at = eased(at, to, 16);
      const now = Math.acos(Math.min(1, dot(at, to)));
      expect(now).toBeLessThan(left);
      left = now;
      expect(length(at)).toBeCloseTo(1, 9);
    }
  });

  it('two short steps are one long step, nearly: the speed does not depend on how often the phone reports', () => {
    const twice = eased(eased(from, to, 30), to, 30);
    const once = eased(from, to, 60);
    expect(Math.acos(Math.min(1, dot(twice, once))) / (Math.PI / 180)).toBeLessThan(0.2);
  });

  it('straight opposite: jumps', () => {
    near(eased([0, 0, 1], [0, 0, -1], SKY.aim.settleMs * Math.LN2), [0, 0, -1]);
  });
});
