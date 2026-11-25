import { SearchMoonPhase } from 'astronomy-engine';
import { describe, expect, it } from 'vitest';
import { SKY } from '../config.ts';
import { altAz, bodyInSky, skyTurn, type Place } from './sky.ts';
import { compassPoint, moonPhaseName, tonight } from './tonight.ts';

const middle: Place = { lat: 47.5, lon: 19 };
const polar: Place = { lat: 69.6, lon: 19 };
const sunHeight = (place: Place, at: Date) => altAz(bodyInSky('sun', skyTurn(place, at))).altitude;

describe('tonight', () => {
  it('by day tells of the night ahead: the Sun sets, it gets dark, it gets light, the Sun rises', () => {
    const now = new Date('2026-11-24T11:00:00Z');
    const night = tonight(middle, now);
    const times = [now, night.sunset, night.dark?.from, night.dark?.to, night.sunrise].map((d) => (d as Date).getTime());
    expect([...times].sort((a, b) => a - b)).toEqual(times);
    expect((night.sunrise as Date).getTime() - now.getTime()).toBeLessThan(36 * 3_600_000);
    expect(sunHeight(middle, night.dark?.from as Date)).toBeCloseTo(SKY.tonight.darkSunAltitude, 1);
    expect(sunHeight(middle, night.dark?.to as Date)).toBeCloseTo(SKY.tonight.darkSunAltitude, 1);
  });

  it('by night tells of the night that is on', () => {
    const now = new Date('2026-11-24T23:30:00Z');
    const night = tonight(middle, now);
    expect((night.sunset as Date).getTime()).toBeLessThan(now.getTime());
    expect((night.sunrise as Date).getTime()).toBeGreaterThan(now.getTime());
    // The same night, asked in the afternoon before it.
    const asked = tonight(middle, new Date('2026-11-24T13:00:00Z'));
    expect(Math.abs((asked.sunset as Date).getTime() - (night.sunset as Date).getTime())).toBeLessThan(2000);
  });

  it('tells of the coming night in the last minutes before sunset too', () => {
    const noon = new Date('2026-11-24T11:00:00Z');
    const sunset = tonight(middle, noon).sunset as Date;
    for (const minutes of [-10, -3, -1, 1, 10]) {
      const asked = tonight(middle, new Date(sunset.getTime() + minutes * 60_000));
      expect(Math.abs((asked.sunset as Date).getTime() - sunset.getTime()), String(minutes)).toBeLessThan(2000);
    }
  });

  it('shows a planet only in the dark and only when it is high enough, with its best moment inside that time', () => {
    for (const day of ['2026-11-24', '2027-02-10', '2027-05-20', '2027-08-30']) {
      const night = tonight(middle, new Date(`${day}T12:00:00Z`));
      const dark = night.dark as { from: Date; to: Date };
      expect(night.planets.map((p) => p.id)).toEqual(['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune']);
      for (const planet of night.planets) {
        if (!planet.seen) continue;
        const { from, to, best, altitude, azimuth } = planet.seen;
        expect(from.getTime(), planet.id).toBeGreaterThanOrEqual(dark.from.getTime());
        expect(to.getTime(), planet.id).toBeLessThanOrEqual(dark.to.getTime());
        expect(best.getTime()).toBeGreaterThanOrEqual(from.getTime());
        expect(best.getTime()).toBeLessThanOrEqual(to.getTime());
        expect(altitude).toBeGreaterThanOrEqual(SKY.tonight.leastAltitude);
        const there = altAz(bodyInSky(planet.id, skyTurn(middle, best)));
        expect(there.altitude).toBeCloseTo(altitude, 9);
        expect(there.azimuth).toBeCloseTo(azimuth, 9);
      }
      // By the program's measure Neptune is too faint for the eye whatever the night; Venus and Jupiter never are.
      const byId = Object.fromEntries(night.planets.map((p) => [p.id, p]));
      expect(byId.neptune?.forTheEye).toBe(false);
      expect(byId.venus?.forTheEye).toBe(true);
      expect(byId.jupiter?.forTheEye).toBe(true);
    }
  });

  it('knows a night that never gets dark and a day on which the Sun does not rise', () => {
    const summer = tonight(polar, new Date('2027-06-21T12:00:00Z'));
    expect(summer.sunset).toBeNull();
    expect(summer.dark).toBeNull();
    expect(summer.planets.every((p) => p.seen === null)).toBe(true);
    const winter = tonight(polar, new Date('2026-12-21T12:00:00Z'));
    expect(winter.sunrise).toBeNull();
  });

  it('names the Moon by the engine’s own moments of its phases', () => {
    const from = new Date('2026-11-01T00:00:00Z');
    const at = (angle: number) => (SearchMoonPhase(angle, from, 40) as { date: Date }).date;
    expect(moonPhaseName(at(0))).toBe('new');
    expect(moonPhaseName(at(90))).toBe('firstQuarter');
    expect(moonPhaseName(at(180))).toBe('full');
    expect(moonPhaseName(at(270))).toBe('lastQuarter');
    expect(moonPhaseName(new Date(at(0).getTime() + 4 * 86_400_000))).toBe('waxingCrescent');
    expect(moonPhaseName(new Date(at(180).getTime() + 4 * 86_400_000))).toBe('waningGibbous');
    const night = tonight(middle, at(180));
    expect(night.moon.phase).toBe('full');
    expect(night.moon.lit).toBeGreaterThan(0.97);
    // The full Moon is up all night: it rises about sunset and sets about sunrise.
    expect(Math.abs((night.moon.rise as Date).getTime() - (night.sunset as Date).getTime())).toBeLessThan(2 * 3_600_000);
    expect(Math.abs((night.moon.set as Date).getTime() - (night.sunrise as Date).getTime())).toBeLessThan(2 * 3_600_000);
  });

  it('turns a bearing into the nearest point of the compass', () => {
    expect(compassPoint(0)).toBe('n');
    expect(compassPoint(359)).toBe('n');
    expect(compassPoint(44)).toBe('ne');
    expect(compassPoint(180)).toBe('s');
    expect(compassPoint(-90)).toBe('w');
    expect(compassPoint(293)).toBe('nw');
  });
});
