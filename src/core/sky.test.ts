import { Body, EquatorFromVector, Horizon, Observer, RotateVector, Rotation_EQJ_EQD, SearchHourAngle } from 'astronomy-engine';
import { describe, expect, it } from 'vitest';
import { SKY_BODY_IDS, altAz, bodyDirection, bodyInSky, engineVector, riseAndSet, skyTurn, starDirection, toSky, type Place } from './sky.ts';

// Sample places and directions, not a gazetteer: three at middle northern latitudes, one beyond the polar circle.
const PLACES: Record<string, Place> = {
  middle: { lat: 47.5, lon: 19 },
  east: { lat: 50.5, lon: 30.5 },
  southwest: { lat: 38.7, lon: -9.1 },
  polar: { lat: 69.6, lon: 19 },
};
const DATES = [new Date('2026-11-24T19:00:00Z'), new Date('2027-03-20T03:30:00Z'), new Date('2027-06-21T22:15:00Z'), new Date('1999-08-11T10:00:00Z')];
const STARS: [number, number][] = [[101.3, -16.7], [279.2, 38.8], [38, 89.3], [0, 0], [210, -60], [83.8, -5.4]];

describe('the sky from a place', () => {
  it('turns a star the same way as the engine does through coordinates of the date', () => {
    for (const place of Object.values(PLACES)) {
      for (const date of DATES) {
        const turn = skyTurn(place, date);
        for (const [ra, dec] of STARS) {
          const direction = starDirection(ra, dec);
          const ours = altAz(toSky(turn, direction));
          const ofDate = EquatorFromVector(RotateVector(Rotation_EQJ_EQD(date), engineVector(direction, date)));
          const theirs = Horizon(date, new Observer(place.lat, place.lon, 0), ofDate.ra, ofDate.dec);
          expect(ours.altitude).toBeCloseTo(theirs.altitude, 6);
          // Bearings meet at 0 = 360.
          expect(Math.cos(((ours.azimuth - theirs.azimuth) * Math.PI) / 180)).toBeCloseTo(1, 10);
        }
      }
    }
  });

  it('keeps directions as they are: unit vectors, the zenith up, north where the pole is', () => {
    const place = PLACES.middle as Place;
    const date = DATES[0] as Date;
    const turn = skyTurn(place, date);
    for (const [ra, dec] of STARS) expect(Math.hypot(...toSky(turn, starDirection(ra, dec)))).toBeCloseTo(1, 12);
    // The pole of the date stands due north, as high as the place's latitude.
    const pole = RotateVector({ rot: transpose(Rotation_EQJ_EQD(date).rot) }, engineVector([0, 0, 1], date));
    const seen = altAz(toSky(turn, [pole.x, pole.y, pole.z]));
    expect(seen.altitude).toBeCloseTo(place.lat, 6);
    expect(Math.sin((seen.azimuth * Math.PI) / 180)).toBeCloseTo(0, 6);
    expect(Math.cos((seen.azimuth * Math.PI) / 180)).toBeCloseTo(1, 6);
  });

  it('has the Sun due south and at its highest when it crosses the meridian of a northern place', () => {
    for (const name of ['middle', 'east', 'southwest'] as const) {
      const place = PLACES[name] as Place;
      const noon = SearchHourAngle(Body.Sun, new Observer(place.lat, place.lon, 0), 0, DATES[0] as Date).time.date;
      const at = (ms: number) => altAz(bodyInSky('sun', skyTurn(place, new Date(noon.getTime() + ms))));
      expect(at(0).azimuth).toBeCloseTo(180, 1);
      expect(at(0).altitude).toBeGreaterThan(at(-20 * 60_000).altitude);
      expect(at(0).altitude).toBeGreaterThan(at(20 * 60_000).altitude);
    }
  });

  it('finds risings in the east and settings in the west, with the body on the horizon at that moment', () => {
    const place = PLACES.middle as Place;
    for (const id of SKY_BODY_IDS) {
      const { rise, set } = riseAndSet(id, place, DATES[0] as Date, 2);
      expect(rise, id).not.toBeNull();
      expect(set, id).not.toBeNull();
      const rising = altAz(bodyInSky(id, skyTurn(place, rise as Date)));
      const setting = altAz(bodyInSky(id, skyTurn(place, set as Date)));
      // Light bent by the air and the size of the disc lift the edge: the middle is a little under the line.
      for (const seen of [rising, setting]) {
        expect(seen.altitude, id).toBeLessThan(0.01);
        expect(seen.altitude, id).toBeGreaterThan(-1.5);
      }
      expect(rising.azimuth, id).toBeGreaterThan(0);
      expect(rising.azimuth, id).toBeLessThan(180);
      expect(setting.azimuth, id).toBeGreaterThan(180);
      expect(setting.azimuth, id).toBeLessThan(360);
    }
  });

  it('knows a summer without sunset and a winter without sunrise beyond the polar circle', () => {
    const place = PLACES.polar as Place;
    expect(riseAndSet('sun', place, new Date('2027-06-15T00:00:00Z'), 3).set).toBeNull();
    expect(riseAndSet('sun', place, new Date('2026-12-15T00:00:00Z'), 3).rise).toBeNull();
    expect(altAz(bodyInSky('sun', skyTurn(place, new Date('2027-06-21T23:00:00Z')))).altitude).toBeGreaterThan(0);
  });

  it('sees the Moon from the place, not from the middle of the Earth', () => {
    const date = DATES[0] as Date;
    const a = bodyDirection('moon', PLACES.southwest as Place, date);
    const b = bodyDirection('moon', PLACES.polar as Place, date);
    const apart = (Math.acos(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) * 180) / Math.PI;
    // Two places far apart see the Moon in slightly different spots among the stars; the Sun — in the same.
    expect(apart).toBeGreaterThan(0.1);
    const c = bodyDirection('sun', PLACES.southwest as Place, date);
    const e = bodyDirection('sun', PLACES.polar as Place, date);
    expect((Math.acos(Math.min(1, c[0] * e[0] + c[1] * e[1] + c[2] * e[2])) * 180) / Math.PI).toBeLessThan(0.01);
  });
});

function transpose(m: number[][]): number[][] {
  return [0, 1, 2].map((i) => [0, 1, 2].map((j) => (m[j] as number[])[i] as number));
}
