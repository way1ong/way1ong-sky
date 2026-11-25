import { describe, expect, it } from 'vitest';
import { SKY } from '../config.ts';
import { bestEvening, brightestStars, figureMiddle, figureNow, overPlace } from './constellations.ts';
import { altAz, skyTurn, toSky } from './sky.ts';
import { FIGURES, STARS, starName } from './stars.ts';
import { length } from './vec.ts';

/** Made-up places: a northern one at the latitude of the middle of Europe and a southern one. */
const NORTH = { lat: 47.5, lon: 19 };
const SOUTH = { lat: -35, lon: 150 };
const FROM = new Date('2026-11-25T12:00:00Z');

describe('the brightest star of a constellation', () => {
  // The table of https://en.wikipedia.org/wiki/IAU_designated_constellations (revision 1387250710, read
  // 2026-11-25), column "Brightest star", for the twenty constellations of the first stories.
  const table: Record<string, string> = {
    CMa: 'Sirius', Ori: 'Rigel', Aur: 'Capella', Boo: 'Arcturus', Lyr: 'Vega', UMa: 'Alioth', Gem: 'Pollux', Sco: 'Antares', CMi: 'Procyon', Leo: 'Regulus',
    Tau: 'Aldebaran', Aql: 'Altair', Cyg: 'Deneb', Peg: 'Enif', Vir: 'Spica', Per: 'Mirfak', Oph: 'Rasalhague', Cas: 'Schedar', And: 'Alpheratz', UMi: 'Polaris',
  };

  it('is the one the table names — or shares the place with it when the two are as bright', () => {
    for (const [id, name] of Object.entries(table)) {
      const names = brightestStars(id).map((i) => starName(i, 'en'));
      expect(names, id).toContain(name);
    }
  });

  it('is found for each of the 88, the brightest first, the others as bright within the allowance', () => {
    for (const id of Object.keys(FIGURES)) {
      const found = brightestStars(id);
      expect(found.length, id).toBeGreaterThan(0);
      const first = STARS[found[0]!]!.mag;
      for (const i of found) expect(STARS[i]!.mag - first).toBeLessThanOrEqual(SKY.story.asBrightMag);
    }
  });

  it('does not take a star of the neighbour from the lines of the figure: the square of Pegasus borrows Alpheratz', () => {
    const onLines = new Set((FIGURES.Peg ?? []).flat().map((i) => starName(i, 'en')));
    expect(onLines.has('Alpheratz')).toBe(true);
    expect(brightestStars('Peg').map((i) => starName(i, 'en'))).not.toContain('Alpheratz');
  });
});

describe('the best evenings of a constellation', () => {
  it('on that evening the middle of the figure stands on the meridian, as high as it gets, at the evening hour of the place', () => {
    for (const place of [NORTH, SOUTH]) {
      for (const id of Object.keys(FIGURES)) {
        const at = bestEvening(id, place, FROM);
        const sky = toSky(skyTurn(place, at), figureMiddle(id));
        // neither to the east nor to the west of the meridian — within what one day's shift of the stars leaves
        expect(Math.abs(sky[0]), `${id} east`).toBeLessThan(0.02);
        expect(Math.abs(altAz(sky).altitude - overPlace(id, place).highest), `${id} height`).toBeLessThan(1);
        const sunHour = (((at.getTime() / 3_600_000 + place.lon / 15) % 24) + 24) % 24;
        expect(sunHour).toBeCloseTo(SKY.story.eveningHour, 6);
        expect(at.getTime()).toBeGreaterThanOrEqual(FROM.getTime() - 86_400_000);
        expect(at.getTime()).toBeLessThan(FROM.getTime() + 367 * 86_400_000);
      }
    }
  });

  it('is about the same day whatever the day it is asked on', () => {
    const one = bestEvening('Ori', NORTH, FROM);
    const other = bestEvening('Ori', NORTH, new Date('2027-06-01T00:00:00Z'));
    const days = Math.abs(other.getTime() - one.getTime()) / 86_400_000;
    expect(Math.min(days % 365.25, 365.25 - (days % 365.25))).toBeLessThan(2);
  });
});

describe('how a figure lives in the sky of a place', () => {
  it('"always" — not one star of the figure goes under the horizon in a day; "never" — not one comes over it; the others do neither', () => {
    for (const place of [NORTH, SOUTH]) {
      for (const id of Object.keys(FIGURES)) {
        const stars = [...new Set((FIGURES[id] ?? []).flat())].map((i) => STARS[i]!.at);
        let [low, high, middleHigh] = [Infinity, -Infinity, -Infinity];
        for (let minutes = 0; minutes < 24 * 60; minutes += 10) {
          const turn = skyTurn(place, new Date(FROM.getTime() + minutes * 60_000));
          for (const star of stars) {
            const { altitude } = altAz(toSky(turn, star));
            low = Math.min(low, altitude);
            high = Math.max(high, altitude);
          }
          middleHigh = Math.max(middleHigh, figureNow(id, turn).altitude);
        }
        const { stays, highest } = overPlace(id, place);
        // a star that only grazes the horizon may fall on either side: the catalogue's axes drift a little from the sky of the date
        if (stays === 'always') expect(low, id).toBeGreaterThan(-0.5);
        else if (stays === 'never') expect(high, id).toBeLessThan(0.5);
        else {
          expect(low, id).toBeLessThan(0.5);
          expect(high, id).toBeGreaterThan(-0.5);
        }
        // sampled every ten minutes
        expect(Math.abs(middleHigh - highest), id).toBeLessThan(1);
      }
    }
  });

  it('a figure that only partly stays up is not said to stay: Perseus over the middle of Europe', () => {
    // its middle never sets there, its southern stars do
    expect(overPlace('Per', NORTH).stays).toBe('sometimes');
    expect(overPlace('UMi', NORTH).stays).toBe('always');
  });

  it('the middle of a figure is a direction of length 1', () => {
    for (const id of Object.keys(FIGURES)) expect(length(figureMiddle(id))).toBeCloseTo(1, 9);
  });
});
