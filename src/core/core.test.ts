// The logic against the sources: NASA's fact sheets for how near and how far the bodies come, the calendar
// and the clock for how the Earth is turned; and the app's own rules for the scales and the camera.
import { describe, expect, it } from 'vitest';
import { SKY } from '../config.ts';
import { BODY_IDS, MOON_DISTANCE_RANGE_KM, PLANET_IDS, parentOf, radiusKm, ringSpanKm, sunDistanceRangeKm } from './bodies.ts';
import { attitude, orbitKm, orbitalPeriodDays, positionKm, positionsKm } from './ephemeris.ts';
import { arrivalDistance, clampDistance, clampPitch, distanceToFit, ease, eye, flightAt, progress, type Flight } from './flight.ts';
import { sceneFromSun, scenePositions, sceneRadius, sceneRing } from './scale.ts';
import { cross, dot, length, normalize, sub, type Vec3 } from './vec.ts';

/** A day in every month of several years, at different hours. */
const DATES = Array.from({ length: 60 }, (_, i) => new Date(Date.UTC(2024 + Math.floor(i / 12), i % 12, 1 + (i % 27), (i * 7) % 24)));

describe('where the bodies are', () => {
  it.each(PLANET_IDS)('%s stays between its nearest and its farthest from the Sun (NASA)', (id) => {
    const { min, max } = sunDistanceRangeKm(id);
    for (const date of DATES) {
      const d = length(positionKm(id, date));
      // the fact sheet rounds to a tenth of a million kilometres
      expect(d, date.toISOString()).toBeGreaterThan(min * 0.995);
      expect(d, date.toISOString()).toBeLessThan(max * 1.005);
    }
  });

  it('the Moon stays about as far from the Earth as NASA says', () => {
    for (const date of DATES) {
      const d = length(sub(positionKm('moon', date), positionKm('earth', date)));
      // the fact sheet gives the usual nearest and farthest; single months go a little beyond
      expect(d).toBeGreaterThan(MOON_DISTANCE_RANGE_KM.min * 0.97);
      expect(d).toBeLessThan(MOON_DISTANCE_RANGE_KM.max * 1.01);
    }
  });

  it('the planets lie near the plane of the Earth’s orbit, the Earth in it', () => {
    for (const date of DATES) {
      const earth = positionKm('earth', date);
      expect(Math.abs(earth[1]) / length(earth)).toBeLessThan(1e-4);
      for (const id of PLANET_IDS) expect(Math.abs(positionKm(id, date)[1]) / length(positionKm(id, date)), id).toBeLessThan(0.13);
    }
  });

  it('an orbit’s line closes: its last point is next to its first', () => {
    const date = DATES[0] as Date;
    for (const id of ['mercury', 'earth', 'jupiter', 'moon'] as const) {
      const line = orbitKm(id, date, 64);
      const step = length(sub(line[1] as Vec3, line[0] as Vec3));
      expect(length(sub(line[63] as Vec3, line[0] as Vec3)), id).toBeLessThan(step * 2.5);
    }
    expect(orbitalPeriodDays('earth')).toBeCloseTo(365.256, 2);
  });
});

describe('how the Earth is turned', () => {
  /** Longitude and latitude (degrees) of the place on Earth that has the Sun overhead. */
  function subsolar(date: Date): { lon: number; lat: number } {
    const { north, meridian } = attitude('earth', date);
    const toSun = normalize(sub([0, 0, 0], positionKm('earth', date)));
    const east = cross(north, meridian);
    return { lon: (Math.atan2(dot(toSun, east), dot(toSun, meridian)) * 180) / Math.PI, lat: (Math.asin(dot(toSun, north)) * 180) / Math.PI };
  }

  it('at noon in Greenwich the Sun stands over the Greenwich meridian — within the clock’s yearly drift', () => {
    for (let month = 0; month < 12; month++) {
      const { lon } = subsolar(new Date(Date.UTC(2026, month, 15, 12)));
      expect(Math.abs(lon), `month ${month + 1}`).toBeLessThan(5);
    }
  });

  it('six hours later it stands a quarter of the globe to the west', () => {
    const { lon } = subsolar(new Date(Date.UTC(2026, 5, 15, 18)));
    expect(lon).toBeGreaterThan(-95);
    expect(lon).toBeLessThan(-85);
  });

  it('in June the Sun is over the northern half, in December over the southern, in March over the equator', () => {
    expect(subsolar(new Date(Date.UTC(2026, 5, 21, 12))).lat).toBeGreaterThan(23);
    expect(subsolar(new Date(Date.UTC(2026, 11, 21, 12))).lat).toBeLessThan(-23);
    expect(Math.abs(subsolar(new Date(Date.UTC(2026, 2, 20, 12))).lat)).toBeLessThan(1);
  });

  it('pole and meridian are unit vectors at a right angle, for every body', () => {
    for (const id of BODY_IDS) {
      const { north, meridian } = attitude(id, DATES[3] as Date);
      expect(length(north), id).toBeCloseTo(1, 9);
      expect(length(meridian), id).toBeCloseTo(1, 9);
      expect(Math.abs(dot(north, meridian)), id).toBeLessThan(1e-9);
    }
  });
});

describe('the two scales', () => {
  it('true scale is the kilometres themselves', () => {
    expect(sceneRadius('earth', 'true')).toBeCloseTo(radiusKm('earth') * SKY.trueUnitsPerKm, 12);
    expect(sceneFromSun([1e6, 0, 0], 'true')).toEqual([1, 0, 0]);
  });

  it('handy scale keeps every direction from the Sun and the order of the planets', () => {
    for (const date of DATES.slice(0, 12)) {
      const km = positionsKm(date);
      const scene = scenePositions(km, 'handy');
      let last = 0;
      for (const id of PLANET_IDS) {
        expect(length(sub(normalize(scene[id]), normalize(km[id]))), id).toBeLessThan(1e-9);
        expect(length(scene[id]), id).toBeGreaterThan(last);
        last = length(scene[id]);
      }
    }
  });

  it('in handy scale no body touches another, and the Moon stands clear of the Earth', () => {
    for (const date of DATES) {
      const scene = scenePositions(positionsKm(date), 'handy');
      for (const a of BODY_IDS) {
        for (const b of BODY_IDS) {
          if (a >= b) continue;
          const gap = length(sub(scene[a], scene[b])) - sceneRadius(a, 'handy') - sceneRadius(b, 'handy');
          expect(gap, `${a}–${b} ${date.toISOString()}`).toBeGreaterThan(0.1);
        }
      }
      // Saturn's rings reach farther than Saturn itself: nothing comes inside them either
      const ring = sceneRing('handy').outer;
      for (const id of BODY_IDS) if (id !== 'saturn') expect(length(sub(scene[id], scene.saturn)), id).toBeGreaterThan(ring + sceneRadius(id, 'handy'));
    }
  });

  it('in true scale the Moon is where it is, in handy scale it keeps its direction from the Earth', () => {
    const km = positionsKm(DATES[5] as Date);
    for (const mode of ['true', 'handy'] as const) {
      const scene = scenePositions(km, mode);
      expect(length(sub(normalize(sub(scene.moon, scene.earth)), normalize(sub(km.moon, km.earth)))), mode).toBeLessThan(1e-6);
    }
    expect(parentOf('moon')).toBe('earth');
  });

  it('the rings start at Saturn’s equator and end beyond ring A; they keep their proportion to the planet', () => {
    const span = ringSpanKm();
    expect(span.inner).toBe(radiusKm('saturn'));
    expect(span.outer).toBeGreaterThan(136_780);
    for (const mode of ['true', 'handy'] as const) expect(sceneRing(mode).outer / sceneRadius('saturn', mode)).toBeCloseTo(span.outer / span.inner, 9);
  });
});

describe('the camera', () => {
  it('stands at its distance from the point looked at, above the plane when tilted up', () => {
    const at = eye([1, 2, 3], { yaw: 0.7, pitch: 0.4, distance: 5 });
    expect(length(sub(at, [1, 2, 3]))).toBeCloseTo(5, 9);
    expect(at[1]).toBeGreaterThan(2);
  });

  it('never goes over the pole, into a body, or farther than allowed', () => {
    expect(clampPitch(3)).toBeLessThan(Math.PI / 2);
    expect(clampPitch(-3)).toBeGreaterThan(-Math.PI / 2);
    expect(clampDistance(0.1, 2, 100)).toBe(2 * SKY.camera.closest);
    expect(clampDistance(500, 2, 100)).toBe(100);
    expect(clampDistance(50, 2, 100)).toBe(50);
    expect(arrivalDistance('earth', 2)).toBe(2 * SKY.camera.arrive);
    expect(arrivalDistance('sun', 2)).toBe(2 * SKY.camera.arriveSun);
    expect(distanceToFit(10)).toBeGreaterThan(10 / Math.tan((SKY.fovDeg * Math.PI) / 360));
  });

  it('a flight starts at one body and ends at the other, changing the distance by a ratio', () => {
    const where = { sun: [0, 0, 0], earth: [10, 0, 0] } as unknown as Record<(typeof BODY_IDS)[number], Vec3>;
    const flight: Flight = { from: 'sun', to: 'earth', startDistance: 100, endDistance: 1, startedAt: 1000, durationMs: 2000 };
    expect(flightAt(flight, 1000, where)).toEqual({ target: [0, 0, 0], distance: 100 });
    expect(flightAt(flight, 3000, where).target).toEqual([10, 0, 0]);
    expect(flightAt(flight, 3000, where).distance).toBeCloseTo(1, 9);
    const half = flightAt(flight, 2000, where);
    expect(half.target[0]).toBeCloseTo(5, 9);
    expect(half.distance).toBeCloseTo(10, 9); // the geometric middle of 100 and 1
    expect(progress({ ...flight, durationMs: 0 }, 0)).toBe(1); // "reduce motion": there at once
    expect(ease(0)).toBe(0);
    expect(ease(1)).toBe(1);
    expect(ease(0.25)).toBeLessThan(0.25);
  });
});
