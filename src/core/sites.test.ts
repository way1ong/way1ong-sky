import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';
import { attitude, positionKm } from './ephemeris.ts';
import { CREW_ROLES, SITE_IDS, SITES, surfaceDirection, sunOverSite } from './sites.ts';
import { cross, dot, length, normalize, sub } from './vec.ts';

it('knows the six landings, each with its NASA page, crew and photo', () => {
  expect(Object.keys(SITES).sort()).toEqual([...SITE_IDS].sort());
  const people = new Set<string>();
  for (const id of SITE_IDS) {
    const site = SITES[id];
    expect(id).toBe(`apollo${site.mission}`);
    expect(site.page).toContain(`apollo${site.mission}info.html`);
    for (const role of CREW_ROLES) people.add(site.crew[role]);
    expect(Date.parse(site.launched)).toBeLessThan(Date.parse(site.landed));
    expect(Date.parse(site.landed)).toBeLessThan(Date.parse(site.returned));
    expect(site.photo.page).toBe(`https://images.nasa.gov/details/${site.photo.nasaId}`);
    expect(existsSync(fileURLToPath(new URL(`../photos/sites/${id}.webp`, import.meta.url))), id).toBe(true);
  }
  expect(people.size).toBe(SITE_IDS.length * CREW_ROLES.length);
});

it('points along the prime meridian, to the east and to the north pole', () => {
  const turned = attitude('moon', new Date('2026-11-24T12:00:00Z'));
  expect(dot(surfaceDirection(turned, 0, 0), turned.meridian)).toBeCloseTo(1, 12);
  expect(dot(surfaceDirection(turned, 90, 0), turned.north)).toBeCloseTo(1, 12);
  expect(dot(surfaceDirection(turned, 0, 90), cross(turned.north, turned.meridian))).toBeCloseTo(1, 12);
  for (const id of SITE_IDS) expect(length(surfaceDirection(turned, SITES[id].lat, SITES[id].lon))).toBeCloseTo(1, 12);
});

it('puts every landing on the side of the Moon that faces the Earth, on the day of the landing and today', () => {
  for (const id of SITE_IDS) {
    for (const date of [new Date(SITES[id].landed), new Date('2026-11-24T12:00:00Z'), new Date('2027-03-03T00:00:00Z')]) {
      const toEarth = normalize(sub(positionKm('earth', date), positionKm('moon', date)));
      const place = surfaceDirection(attitude('moon', date), SITES[id].lat, SITES[id].lon);
      // All six lie well inside the near side: nearer to the middle of the disc than to its edge.
      expect(dot(place, toEarth), `${id} ${date.toISOString()}`).toBeGreaterThan(Math.SQRT1_2);
    }
  }
});

it('has the Sun up over every landing place at the moment of landing — a morning Sun, not a high one', () => {
  for (const id of SITE_IDS) {
    const date = new Date(SITES[id].landed);
    const toSun = normalize(sub(positionKm('sun', date), positionKm('moon', date)));
    const place = surfaceDirection(attitude('moon', date), SITES[id].lat, SITES[id].lon);
    expect(dot(place, toSun), id).toBeGreaterThan(0);
    // the same said in degrees, as the note of "show that moment" says it
    const height = sunOverSite(id, date);
    expect(height, id).toBeCloseTo((Math.asin(dot(place, toSun)) * 180) / Math.PI, 6);
    expect(height, id).toBeGreaterThan(0);
    expect(height, id).toBeLessThan(30);
    // and it does not stay up: some day of the weeks that follow, the place is in the night
    const later = Array.from({ length: 30 }, (_, day) => sunOverSite(id, new Date(date.getTime() + (day + 1) * 86_400_000)));
    expect(Math.min(...later), id).toBeLessThan(0);
  }
});
