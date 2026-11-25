// What the program itself can tell about a constellation: where its figure stands, its brightest star, the
// month of its best evenings and whether it ever sets at the place. The stories are another matter — they
// are written after Wikipedia's articles and live in the dictionaries (data/constellation-stories.json).
import { Constellation, SiderealTime } from 'astronomy-engine';
import { SKY } from '../config.ts';
import { altAz, toSky, type Place, type SkyTurn } from './sky.ts';
import { FIGURES, STARS } from './stars.ts';
import { DAY, compassPoint } from './tonight.ts';
import { normalize, type Vec3 } from './vec.ts';

const DEG = 180 / Math.PI;

/** The three letters the astronomers' borders know a figure by: the two halves of the Serpent are one constellation. */
export const constellationOf = (figure: string): string => figure.slice(0, 3);

/** The middle of a figure among the stars: a unit vector in the axes of the catalogues. Where its name is written. */
export function figureMiddle(figure: string): Vec3 {
  const ends = [...new Set((FIGURES[figure] ?? []).flat())];
  const sum = ends.reduce<[number, number, number]>((at, i) => {
    const star = (STARS[i] as (typeof STARS)[number]).at;
    return [at[0] + star[0], at[1] + star[1], at[2] + star[2]];
  }, [0, 0, 0]);
  return normalize(sum);
}

/** Right ascension (hours) and declination (degrees) of a direction among the stars. */
function equatorial(at: Vec3): { ra: number; dec: number } {
  return { ra: (((Math.atan2(at[1], at[0]) * DEG) / 15) % 24 + 24) % 24, dec: Math.asin(Math.max(-1, Math.min(1, at[2]))) * DEG };
}

const brightest = new Map<string, readonly number[]>();

/**
 * The brightest star inside the borders of a constellation — the borders of the astronomers, which the engine
 * knows, not the lines of the figure: a figure may borrow a star of its neighbour. Indexes into STARS: more
 * than one when the next stars are as bright within `SKY.story.asBrightMag` (catalogues then disagree which
 * is the brightest); none when the file of stars has no star there.
 */
export function brightestStars(figure: string): readonly number[] {
  const id = constellationOf(figure);
  let found = brightest.get(id);
  if (!found) {
    const inside: number[] = [];
    // The stars are listed brightest first.
    for (let i = 0; i < STARS.length; i++) {
      const star = STARS[i] as (typeof STARS)[number];
      if (inside.length > 0 && star.mag - (STARS[inside[0] as number] as (typeof STARS)[number]).mag > SKY.story.asBrightMag) break;
      if (Constellation(star.ra / 15, star.dec).symbol === id) inside.push(i);
    }
    found = inside;
    brightest.set(id, found);
  }
  return found;
}

/**
 * How a figure lives in the sky of a place: it never sets (not one of its stars does), it never rises (not
 * one does), or it comes and goes — also when only a part of it ever sets. `highest` — how high its middle
 * stands when it crosses the meridian, degrees.
 */
export function overPlace(figure: string, place: Place): { highest: number; stays: 'always' | 'never' | 'sometimes' } {
  const highest = 90 - Math.abs(place.lat - equatorial(figureMiddle(figure)).dec);
  const stars = [...new Set((FIGURES[figure] ?? []).flat())].map((i) => (STARS[i] as (typeof STARS)[number]).dec);
  // A star's lowest and highest stand over the horizon, by its declination and the place's latitude.
  const allStayUp = stars.every((dec) => Math.abs(place.lat + dec) - 90 > 0);
  const noneComesUp = stars.every((dec) => 90 - Math.abs(place.lat - dec) < 0);
  return { highest, stays: stars.length > 0 && allStayUp ? 'always' : stars.length > 0 && noneComesUp ? 'never' : 'sometimes' };
}

/**
 * The day of the best evenings: the first day from `from` on which the middle of the figure crosses the
 * meridian at the evening hour of the place's own Sun time (`SKY.story.eveningHour`) — the custom of sky
 * guides. Returned as that moment. About the same day every year; the month is what is told.
 */
export function bestEvening(figure: string, place: Place, from: Date): Date {
  return bestEveningOf(equatorial(figureMiddle(figure)).ra, place, from);
}

/** The same for any place among the stars, by its right ascension in hours. */
export function bestEveningOf(ra: number, place: Place, from: Date): Date {
  // The evening hour by the place's mean Sun, as a moment of the world's clock, on the day of `from`.
  const day = Math.floor(from.getTime() / DAY) * DAY;
  const evening = day + (SKY.story.eveningHour - place.lon / 15) * 3_600_000;
  const away = (at: number): number => {
    const local = SiderealTime(new Date(at)) + place.lon / 15;
    return (((ra - local) % 24) + 36) % 24 - 12;
  };
  // The stars come to the meridian about four minutes earlier each day: within a year one evening fits best.
  let best = evening;
  for (let i = 0; i < 366; i++) {
    const at = evening + i * DAY;
    if (Math.abs(away(at)) < Math.abs(away(best))) best = at;
  }
  return new Date(best);
}

/** Where the middle of a figure stands at the moment shown: height, degrees, and the point of the compass. */
export function figureNow(figure: string, turn: SkyTurn): { altitude: number; compass: ReturnType<typeof compassPoint> } {
  const seen = altAz(toSky(turn, figureMiddle(figure)));
  return { altitude: seen.altitude, compass: compassPoint(seen.azimuth) };
}
