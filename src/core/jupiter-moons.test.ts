import { JupiterMoons, KM_PER_AU } from 'astronomy-engine';
import { describe, expect, it } from 'vitest';
import { radiusKm } from './bodies.ts';
import { skyDirection } from './dome.ts';
import { JUPITER_MOONS, JUPITER_MOON_IDS, moonsBesideJupiter, offsetInView } from './jupiter-moons.ts';
import { CITIES } from './places.ts';
import { skyTurn } from './sky.ts';

const budapest = CITIES.find((city) => city.names.en === 'Budapest') as (typeof CITIES)[number];
const start = Date.UTC(2026, 10, 25);
const HOUR = 3_600_000;

describe('where a second point of the sky lies as the eye sees it', () => {
  it('higher is up, a greater bearing is to the right — whichever way one looks', () => {
    for (const azimuth of [10, 100, 180, 265, 350]) {
      for (const altitude of [5, 40, 75]) {
        const looking = skyDirection(azimuth, altitude);
        const higher = offsetInView(looking, skyDirection(azimuth, altitude + 0.5));
        expect(higher.up).toBeGreaterThan(0);
        expect(Math.abs(higher.right)).toBeLessThan(1e-9);
        const clockwise = offsetInView(looking, skyDirection(azimuth + 0.5, altitude));
        expect(clockwise.right).toBeGreaterThan(0);
      }
    }
  });
});

describe('the four moons beside Jupiter', () => {
  it('are as far from Jupiter in the engine as NASA’s fact sheet says', () => {
    for (let hour = 0; hour < 24 * 20; hour += 6) {
      const moons = JupiterMoons(new Date(start + hour * HOUR));
      for (const id of JUPITER_MOON_IDS) {
        const km = Math.hypot(moons[id].x, moons[id].y, moons[id].z) * KM_PER_AU;
        expect(km / 1000 / JUPITER_MOONS[id].semiMajorAxisThousandKm, id).toBeGreaterThan(0.98);
        expect(km / 1000 / JUPITER_MOONS[id].semiMajorAxisThousandKm, id).toBeLessThan(1.02);
      }
    }
  });

  it('swing from one side of the planet to the other, each as far as its orbit is wide and no farther', () => {
    const farthest: Record<string, number> = {};
    const sides: Record<string, Set<number>> = {};
    for (let hour = 0; hour < 24 * 20; hour += 1) {
      for (const moon of moonsBesideJupiter(skyTurn(budapest, new Date(start + hour * HOUR)))) {
        const away = Math.hypot(moon.right, moon.up);
        farthest[moon.id] = Math.max(farthest[moon.id] ?? 0, away);
        (sides[moon.id] ??= new Set()).add(Math.sign(moon.right));
      }
    }
    for (const id of JUPITER_MOON_IDS) {
      // the orbit's half-width in radii of Jupiter, from the fact sheet and the radius the app already holds
      const orbit = (JUPITER_MOONS[id].semiMajorAxisThousandKm * 1000) / radiusKm('jupiter');
      expect(farthest[id], id).toBeLessThan(orbit * 1.02);
      expect(farthest[id], id).toBeGreaterThan(orbit * 0.9);
      expect(sides[id]?.has(1) && sides[id]?.has(-1), id).toBe(true);
    }
  });

  it('a moon within the disc is behind the planet or in front of it — Io is both within a few days', () => {
    const seen = new Set<string>();
    for (let minute = 0; minute < 60 * 24 * 6; minute += 10) {
      const io = moonsBesideJupiter(skyTurn(budapest, new Date(start + minute * 60_000)))[0];
      if (!io) continue;
      const within = Math.hypot(io.right, io.up) < 1;
      expect(io.onDisc !== null).toBe(within);
      if (io.onDisc) seen.add(io.onDisc);
    }
    expect([...seen].sort()).toEqual(['behind', 'inFront']);
  });

  it('half a turn of Io later it stands on the other side', () => {
    let checked = 0;
    for (let hour = 0; hour < 24 * 10; hour += 5) {
      const now = moonsBesideJupiter(skyTurn(budapest, new Date(start + hour * HOUR)))[0];
      const half = moonsBesideJupiter(skyTurn(budapest, new Date(start + hour * HOUR + (JUPITER_MOONS.io.periodDays / 2) * 24 * HOUR)))[0];
      if (!now || !half || Math.hypot(now.right, now.up) < 3) continue;
      // against the line of the orbit, not against the horizon, which turns with the hours
      expect(now.right * half.right + now.up * half.up).toBeLessThan(0);
      checked++;
    }
    expect(checked).toBeGreaterThan(10);
  });
});
