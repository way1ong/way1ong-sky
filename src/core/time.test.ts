// The clock of the app, the shadows and the eclipses. The shadows are held against a second source: the
// eclipses astronomy-engine finds by its own search must be dark where and when our geometry says so.
import { describe, expect, it } from 'vitest';
import { SKY } from '../config.ts';
import { radiusKm } from './bodies.ts';
import { LIMITS, RATES, REAL_RATE, atLimit, isLive, isRunningFast, jumpTo, liveClock, showsSpin, shownAt, stepRate, togglePause } from './clock.ts';
import { nextLunarEclipse, nextSolarEclipse } from './eclipses.ts';
import { positionKm } from './ephemeris.ts';
import { lightAt, overlap, shadeOf, type Shade } from './shadow.ts';
import { add, cross, normalize, scale, sub, type Vec3 } from './vec.ts';

describe('the clock', () => {
  const start = Date.UTC(2026, 10, 24, 12);

  it('keeps up with the real clock until told otherwise', () => {
    const clock = liveClock(start);
    expect(shownAt(clock, start + 5000)).toBe(start + 5000);
    expect(isLive(clock, start + 5000)).toBe(true);
    expect(isRunningFast(clock)).toBe(false);
    expect(RATES[REAL_RATE]).toBe(1);
  });

  it('runs faster, slower and backwards by steps, without a jump at the change', () => {
    const fast = stepRate(liveClock(start), start + 1000, 1);
    expect(shownAt(fast, start + 1000)).toBe(start + 1000);
    expect(shownAt(fast, start + 2000)).toBe(start + 1000 + 3_600_000); // an hour a second
    expect(isLive(fast, start + 2000)).toBe(false);
    expect(isRunningFast(fast)).toBe(true);
    const back = stepRate(stepRate(fast, start + 2000, -1), start + 2000, -1);
    expect(shownAt(back, start + 3000)).toBe(start + 1000 + 3_600_000 - 3_600_000);
    let top = fast;
    for (let i = 0; i < 20; i++) top = stepRate(top, start + 2000, 1);
    expect(top.rate).toBe(RATES.length - 1);
  });

  it('stands still when paused and goes on from the same moment', () => {
    const paused = togglePause(liveClock(start), start + 4000);
    expect(shownAt(paused, start + 90_000)).toBe(start + 4000);
    const again = togglePause(paused, start + 90_000);
    expect(shownAt(again, start + 91_000)).toBe(start + 5000);
    expect(isLive(again, start + 91_000)).toBe(false); // it runs, but it is behind the present now
  });

  it('jumps to a moment and waits there; never leaves the years it may show', () => {
    const there = jumpTo(liveClock(start), start, Date.UTC(2028, 0, 12));
    expect(there.paused).toBe(true);
    expect(shownAt(there, start + 60_000)).toBe(Date.UTC(2028, 0, 12));
    expect(shownAt(jumpTo(there, start, Date.UTC(1500, 0, 1)), start)).toBe(LIMITS.from);
    let fastest = liveClock(start);
    for (let i = 0; i < 9; i++) fastest = stepRate(fastest, start, 1);
    const far = start + 1e10;
    expect(shownAt(fastest, far)).toBe(LIMITS.to);
    expect(atLimit(fastest, far)).toBe(true);
    expect(atLimit(fastest, start + 1000)).toBe(false);
  });

  it('turns the bodies up to a day a second, not faster', () => {
    let clock = liveClock(start);
    const turning: boolean[] = [showsSpin(clock)];
    for (let i = 0; i < 4; i++) {
      clock = stepRate(clock, start, 1);
      turning.push(showsSpin(clock));
    }
    expect(turning).toEqual([true, true, true, false, false]);
    expect(showsSpin(togglePause(clock, start))).toBe(true);
    expect(SKY.time.names.length).toBe(RATES.length);
  });
});

describe('two discs', () => {
  it('share nothing when apart, the smaller one when it lies inside, and something in between otherwise', () => {
    expect(overlap(1, 1, 2)).toBe(0);
    expect(overlap(1, 3, 0.5)).toBeCloseTo(Math.PI, 12);
    expect(overlap(2, 1, 0)).toBeCloseTo(Math.PI, 12);
    const half = overlap(1, 1, 1);
    expect(half).toBeGreaterThan(0);
    expect(half).toBeLessThan(Math.PI);
    expect(overlap(1, 1, 1e-9)).toBeCloseTo(Math.PI, 6);
  });
});

/** The shadow of `occ` on `body` at a moment. */
function shade(body: 'moon' | 'earth', occ: 'moon' | 'earth', date: Date): Shade {
  return shadeOf(positionKm(body, date), radiusKm(body), [0, 0, 0], radiusKm('sun'), positionKm(occ, date), radiusKm(occ));
}

/** A few directions all over a body. */
const AROUND: Vec3[] = [];
for (let i = 0; i < 400; i++) {
  const y = 1 - (2 * (i + 0.5)) / 400;
  const r = Math.sqrt(1 - y * y);
  const a = i * 2.399963;
  AROUND.push([Math.cos(a) * r, y, Math.sin(a) * r]);
}

describe('the Earth’s shadow on the Moon', () => {
  const from = new Date(Date.UTC(2026, 0, 1));
  const eclipses = [nextLunarEclipse(from)];
  for (let i = 0; i < 7; i++) eclipses.push(nextLunarEclipse(new Date((eclipses[i] as (typeof eclipses)[number]).peak.getTime() + 86_400_000)));

  it('finds eclipses one after another, some of them total', () => {
    for (let i = 1; i < eclipses.length; i++) expect(eclipses[i]?.peak.getTime()).toBeGreaterThan(eclipses[i - 1]?.peak.getTime() as number);
    expect(eclipses.some((e) => e.kind === 'total')).toBe(true);
    expect(eclipses.some((e) => e.kind === 'partial')).toBe(true);
  });

  it('at the middle of a total eclipse no point of the Moon sees the Sun; of a partial one — some do, some do not', () => {
    for (const eclipse of eclipses) {
      const s = shade('moon', 'earth', eclipse.peak);
      // only the half that faces the Sun matters: the other half is night anyway
      const day = AROUND.filter((dir) => dir[0] * s.sunDir[0] + dir[1] * s.sunDir[1] + dir[2] * s.sunDir[2] > 0.05);
      const light = day.map((dir) => lightAt(s, dir));
      if (eclipse.kind === 'total') expect(Math.max(...light), eclipse.peak.toISOString()).toBe(0);
      else {
        expect(Math.min(...light), eclipse.peak.toISOString()).toBe(0);
        expect(Math.max(...light), eclipse.peak.toISOString()).toBeGreaterThan(0);
      }
    }
  });

  it('a week before the eclipse the whole Moon is in full light', () => {
    for (const eclipse of eclipses) {
      const s = shade('moon', 'earth', new Date(eclipse.peak.getTime() - 7 * 86_400_000));
      for (const dir of AROUND) expect(lightAt(s, dir)).toBe(1);
    }
  });
});

describe('the Moon’s shadow on the Earth', () => {
  const eclipses = [nextSolarEclipse(new Date(Date.UTC(2026, 0, 1)))];
  for (let i = 0; i < 7; i++) eclipses.push(nextSolarEclipse(new Date((eclipses[i] as (typeof eclipses)[number]).peak.getTime() + 86_400_000)));

  it('at the middle of every solar eclipse some of the Earth’s day side is dimmed, most of it is not', () => {
    for (const eclipse of eclipses) {
      const s = shade('earth', 'moon', eclipse.peak);
      const light = AROUND.map((dir) => lightAt(s, dir));
      expect(Math.min(...light), eclipse.peak.toISOString()).toBeLessThan(1);
      expect(light.filter((l) => l === 1).length, eclipse.peak.toISOString()).toBeGreaterThan(AROUND.length / 2);
    }
  });

  it('under a total eclipse the point right under the Moon is dark; under an annular one a ring of the Sun is left', () => {
    for (const eclipse of eclipses) {
      if (eclipse.kind === 'partial') continue;
      const earth = positionKm('earth', eclipse.peak);
      const moon = positionKm('moon', eclipse.peak);
      const s = shade('earth', 'moon', eclipse.peak);
      // the darkest point of the day side: looked for around the direction to the Moon, coarsely, then finely
      const toMoon = normalize(sub(moon, earth));
      const u = normalize(cross(toMoon, [0, 1, 0]));
      const v = cross(toMoon, u);
      let darkest = 1;
      let best: [number, number] = [0, 0];
      // a point of the day side by its angle from the direction to the Moon and its turn around that direction
      const at = (tilt: number, turn: number) => normalize(add(scale(toMoon, Math.cos(tilt)), scale(add(scale(u, Math.cos(turn)), scale(v, Math.sin(turn))), Math.sin(tilt))));
      const look = (around: [number, number], reach: [number, number], step: [number, number]) => {
        for (let tilt = Math.max(0, around[0] - reach[0]); tilt <= Math.min(Math.PI / 2, around[0] + reach[0]); tilt += step[0]) {
          for (let turn = around[1] - reach[1]; turn <= around[1] + reach[1]; turn += step[1]) {
            const light = lightAt(s, at(tilt, turn));
            if (light < darkest) {
              darkest = light;
              best = [tilt, turn];
            }
          }
        }
      };
      look([Math.PI / 4, 0], [Math.PI / 4, Math.PI], [0.005, 0.02]);
      look(best, [0.01, 0.05], [0.0005, 0.002]);
      if (eclipse.kind === 'total') expect(darkest, eclipse.peak.toISOString()).toBeLessThan(0.02);
      else {
        expect(darkest, eclipse.peak.toISOString()).toBeGreaterThan(0);
        expect(darkest, eclipse.peak.toISOString()).toBeLessThan(0.25);
      }
    }
  });

  it('two weeks earlier, at full moon, nothing of the Earth is dimmed by the Moon', () => {
    for (const eclipse of eclipses) {
      const s = shade('earth', 'moon', new Date(eclipse.peak.getTime() - 14 * 86_400_000));
      for (const dir of AROUND) expect(lightAt(s, dir)).toBe(1);
    }
  });
});
