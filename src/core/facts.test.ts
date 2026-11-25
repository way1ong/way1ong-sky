// The cards: every body has its facts, the comparisons follow from the numbers, and "now" agrees with the
// lasting numbers of the same source.
import { describe, expect, it } from 'vitest';
import { BODY_IDS, MOON_DISTANCE_RANGE_KM, PLANET_IDS, sunDistanceRangeKm } from './bodies.ts';
import { EARTH_YEAR_DAYS, SUPERLATIVES, factsOf, leader, nowOf, superlativesOf } from './facts.ts';

describe('facts', () => {
  it('every body has a card with sensible numbers', () => {
    for (const id of BODY_IDS) {
      const f = factsOf(id);
      expect(f.diameterKm, id).toBeGreaterThan(1000);
      expect(f.gravity, id).toBeGreaterThan(0);
      for (const ratio of Object.values(f.toEarth)) expect(ratio, id).toBeGreaterThan(0);
    }
    expect(factsOf('sun').kind).toBe('sun');
    expect(factsOf('moon').kind).toBe('moon');
    expect(factsOf('mars').kind).toBe('planet');
  });

  it('the Earth compared with itself is one, in everything', () => {
    expect(factsOf('earth').toEarth).toEqual({ diameter: 1, mass: 1, gravity: 1 });
    expect(EARTH_YEAR_DAYS).toBeGreaterThan(365);
    expect(EARTH_YEAR_DAYS).toBeLessThan(366);
  });

  it('comparisons follow from the numbers: bigger means a ratio above one', () => {
    for (const id of PLANET_IDS) {
      const f = factsOf(id);
      expect(f.toEarth.diameter > 1, id).toBe(f.diameterKm > factsOf('earth').diameterKm);
    }
    // NASA's own ratios for the Sun agree with the sizes we draw, to the rounding of the sheet
    const sun = factsOf('sun');
    expect(sun.diameterKm / factsOf('earth').diameterKm / sun.toEarth.diameter).toBeCloseTo(1, 2);
  });

  it('each "most" names one planet of the eight, and every planet may hold several', () => {
    const held = SUPERLATIVES.map((what) => leader(what));
    for (const planet of held) expect(planet === null || PLANET_IDS.includes(planet)).toBe(true);
    // the largest and the smallest, the nearest and the farthest are never the same planet
    expect(leader('largest')).not.toBe(leader('smallest'));
    expect(leader('nearest')).not.toBe(leader('farthest'));
    expect(leader('hottest')).not.toBe(leader('coldest'));
    for (const id of PLANET_IDS) for (const what of superlativesOf(id)) expect(leader(what)).toBe(id);
    expect(superlativesOf('sun')).toEqual([]);
    expect(superlativesOf('moon')).toEqual([]);
  });
});

describe('now', () => {
  const date = new Date(Date.UTC(2026, 10, 24, 12));

  it('a planet is now between its nearest and its farthest from the Sun, and light takes its time', () => {
    for (const id of PLANET_IDS) {
      const now = nowOf(id, date);
      const { min, max } = sunDistanceRangeKm(id);
      expect(now.fromSunKm, id).toBeGreaterThan(min * 0.995);
      expect(now.fromSunKm, id).toBeLessThan(max * 1.005);
      expect(now.lightFromSunMin, id).toBeGreaterThan(0);
      expect(now.litFraction, id).toBeNull();
    }
    // farther from the Sun — longer for the light
    expect(nowOf('neptune', date).lightFromSunMin as number).toBeGreaterThan(nowOf('mercury', date).lightFromSunMin as number);
  });

  it('the Sun has no distance from itself, the Earth none from itself; sunlight reaches the Earth in minutes, not hours', () => {
    expect(nowOf('sun', date).fromSunKm).toBeNull();
    expect(nowOf('earth', date).fromEarthKm).toBeNull();
    expect(nowOf('sun', date).fromEarthKm).toBeCloseTo(nowOf('earth', date).fromSunKm as number, 0);
    // twice as far — twice as long for the light
    const earth = nowOf('earth', date);
    const mars = nowOf('mars', date);
    expect((mars.lightFromSunMin as number) / (earth.lightFromSunMin as number)).toBeCloseTo((mars.fromSunKm as number) / (earth.fromSunKm as number), 9);
    expect(earth.lightFromSunMin as number).toBeLessThan(60);
  });

  it('the Moon is as far from the Earth as NASA says, and some part of it is lit', () => {
    const now = nowOf('moon', date);
    expect(now.fromEarthKm).toBeGreaterThan(MOON_DISTANCE_RANGE_KM.min * 0.97);
    expect(now.fromEarthKm).toBeLessThan(MOON_DISTANCE_RANGE_KM.max * 1.01);
    expect(now.litFraction).toBeGreaterThanOrEqual(0);
    expect(now.litFraction).toBeLessThanOrEqual(1);
    // light from the Moon takes seconds, not minutes
    expect((now.lightToEarthMin as number) * 60).toBeGreaterThan(1);
    expect(now.lightToEarthMin as number).toBeLessThan(1);
  });
});

it('tells the history of every body after NASA pages it can link to, in every language', async () => {
  const { HISTORY_PAGES } = await import('./facts.ts');
  const { BODY_IDS } = await import('./bodies.ts');
  const dictionaries = await Promise.all(['en', 'hu', 'uk'].map((lang) => import(`../i18n/${lang}.json`)));
  for (const id of BODY_IDS) {
    expect(HISTORY_PAGES[id]?.length, id).toBeGreaterThan(0);
    for (const url of HISTORY_PAGES[id]) expect(url, id).toMatch(/^https:\/\/(science\.nasa\.gov|nssdc\.gsfc\.nasa\.gov)\//);
    for (const d of dictionaries) expect((d.default.card.history.text as Record<string, string>)[id]?.length ?? 0, id).toBeGreaterThan(80);
  }
});
