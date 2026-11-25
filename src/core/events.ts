// "Events of the year": what is worth seeing in the sky in the year after a moment — eclipses, two planets
// side by side, oppositions, the best evenings and mornings of Mercury and Venus, solstices and equinoxes —
// and whether each can be seen from the place, when and where to look. astronomy-engine finds the moments.
import { AngleBetween, AngleFromSun, EclipseKind, GeoVector, NextLocalSolarEclipse, NextLunarEclipse, Observer, SearchLocalSolarEclipse, SearchLunarEclipse, SearchMaxElongation, SearchRelativeLongitude, Seasons } from 'astronomy-engine';
import { SKY } from '../config.ts';
import type { LunarKind, SolarKind } from './eclipses.ts';
import { ENGINE_BODY, altAz, bodyInSky, skyTurn, type Place, type SkyBodyId } from './sky.ts';
import { tonight } from './tonight.ts';

/** The planets bright enough for a meeting of two of them to be worth a look. */
export const MEETING_PLANETS = ['mercury', 'venus', 'mars', 'jupiter', 'saturn'] as const satisfies readonly SkyBodyId[];
export type MeetingPlanet = (typeof MEETING_PLANETS)[number];
export const OPPOSITION_PLANETS = ['mars', 'jupiter', 'saturn'] as const satisfies readonly SkyBodyId[];
export const SEASONS = ['marchEquinox', 'juneSolstice', 'septemberEquinox', 'decemberSolstice'] as const;
export type Season = (typeof SEASONS)[number];

/** When and where to look from the place; null — it cannot be seen from there (under the horizon, or not in the dark). */
export interface EventView {
  at: Date;
  azimuth: number;
  altitude: number;
}

export type SkyEvent = { at: Date; view: EventView | null } & (
  | { kind: 'lunarEclipse'; type: LunarKind }
  | { kind: 'solarEclipse'; type: SolarKind; /** The share of the Sun's disc covered at the most, 0…1. */ covered: number }
  | {
      kind: 'meeting';
      bodies: [MeetingPlanet, MeetingPlanet];
      /** Degrees between them at their nearest — or now, when the nearest moment has passed and they are still close. */
      apart: number;
      /** The nearest moment is behind (`at` is in the past), but the two still stand close. */
      ongoing: boolean;
    }
  | { kind: 'opposition'; body: (typeof OPPOSITION_PLANETS)[number] }
  | { kind: 'elongation'; body: 'mercury' | 'venus'; side: 'morning' | 'evening'; /** Degrees from the Sun. */ apart: number }
  | { kind: 'season'; season: Season }
);

const DAY = 86_400_000;

/** A body as it stands over the place at a moment. */
function standing(id: SkyBodyId, place: Place, at: Date): EventView {
  return { at, ...altAz(bodyInSky(id, skyTurn(place, at))) };
}

/** Seen only if over the horizon. */
const ifUp = (view: EventView): EventView | null => (view.altitude > 0 ? view : null);

/**
 * The best moment of the night round an event to see planets from the place: in the dark, all of them at
 * least as high as "Tonight" asks, the lowest of them as high as it gets. Null — no such moment.
 */
function bestInDark(ids: readonly SkyBodyId[], place: Place, around: Date): EventView | null {
  // The night that is on at the moment or comes after it, and the one before: the nearer in time wins.
  let best: EventView | null = null;
  let height = -Infinity;
  for (const from of [new Date(around.getTime() - DAY / 2), around]) {
    const dark = tonight(place, from).dark;
    if (!dark) continue;
    for (let t = dark.from.getTime(); t <= dark.to.getTime(); t += SKY.tonight.stepMinutes * 60_000) {
      const at = new Date(t);
      const turn = skyTurn(place, at);
      const views = ids.map((id) => altAz(bodyInSky(id, turn)));
      const lowest = Math.min(...views.map((view) => view.altitude));
      if (lowest < SKY.tonight.leastAltitude || lowest <= height) continue;
      height = lowest;
      // Look at the first of them: the others stand beside it.
      best = { at, ...(views[0] as (typeof views)[number]) };
    }
    if (best) break;
  }
  return best;
}

const apartAt = (a: MeetingPlanet, b: MeetingPlanet, at: Date): number => AngleBetween(GeoVector(ENGINE_BODY[a], at, true), GeoVector(ENGINE_BODY[b], at, true));

/**
 * The meetings of two planets within the days: each moment they stand nearest, if near enough and clear of
 * the Sun. A meeting whose nearest moment has just passed is kept while the two are still close — it is
 * what the sky shows tonight.
 */
function meetings(place: Place, from: Date, days: number): SkyEvent[] {
  const { closeDeg, sunClearDeg, stillCloseDays } = SKY.events;
  const start = from.getTime() - stillCloseDays * DAY;
  const clear = (a: MeetingPlanet, b: MeetingPlanet, at: Date) => AngleFromSun(ENGINE_BODY[a], at) >= sunClearDeg && AngleFromSun(ENGINE_BODY[b], at) >= sunClearDeg;
  const out: SkyEvent[] = [];
  for (let i = 0; i < MEETING_PLANETS.length; i++) {
    for (let j = i + 1; j < MEETING_PLANETS.length; j++) {
      const [a, b] = [MEETING_PLANETS[i] as MeetingPlanet, MEETING_PLANETS[j] as MeetingPlanet];
      const daily = Array.from({ length: stillCloseDays + days + 2 }, (_, day) => apartAt(a, b, new Date(start + day * DAY)));
      for (let day = 1; day <= stillCloseDays + days; day++) {
        const here = daily[day] as number;
        if (here >= closeDeg || here >= (daily[day - 1] as number) || here > (daily[day + 1] as number)) continue;
        // Nearest somewhere within a day of this one: narrowed down by thirds.
        let [low, high] = [start + (day - 1) * DAY, start + (day + 1) * DAY];
        for (let step = 0; step < 24; step++) {
          const [one, two] = [low + (high - low) / 3, high - (high - low) / 3];
          if (apartAt(a, b, new Date(one)) < apartAt(a, b, new Date(two))) high = two;
          else low = one;
        }
        const at = new Date((low + high) / 2);
        if (at >= from) {
          if (clear(a, b, at)) out.push({ kind: 'meeting', at, bodies: [a, b], apart: apartAt(a, b, at), ongoing: false, view: bestInDark([a, b], place, at) });
        } else if (apartAt(a, b, from) < closeDeg && clear(a, b, from)) {
          out.push({ kind: 'meeting', at, bodies: [a, b], apart: apartAt(a, b, from), ongoing: true, view: bestInDark([a, b], place, from) });
        }
      }
    }
  }
  return out;
}

/** What is worth seeing in the `days` after `from`, in the order it comes. */
export function eventsAfter(place: Place, from: Date, days: number = SKY.events.days): SkyEvent[] {
  const until = new Date(from.getTime() + days * DAY);
  const within = (at: Date) => at >= from && at <= until;
  const observer = new Observer(place.lat, place.lon, 0);
  const out: SkyEvent[] = [];

  // The Moon in the Earth's shadow — where the shadow is dark; a brush with its pale edge shows next to nothing.
  for (let found = SearchLunarEclipse(from); within(found.peak.date); found = NextLunarEclipse(found.peak)) {
    if (found.kind === EclipseKind.Penumbral) continue;
    out.push({ kind: 'lunarEclipse', at: found.peak.date, type: found.kind as LunarKind, view: ifUp(standing('moon', place, found.peak.date)) });
  }

  // The Sun behind the Moon — the eclipses that reach this very place.
  for (let found = SearchLocalSolarEclipse(from, observer); within(found.peak.time.date); found = NextLocalSolarEclipse(found.peak.time, observer)) {
    out.push({ kind: 'solarEclipse', at: found.peak.time.date, type: found.kind as SolarKind, covered: found.obscuration, view: ifUp(standing('sun', place, found.peak.time.date)) });
  }

  out.push(...meetings(place, from, days));

  // Opposite the Sun: the planet is up all night and at its brightest. (The engine: relative longitude 0.)
  for (const body of OPPOSITION_PLANETS) {
    const at = SearchRelativeLongitude(ENGINE_BODY[body], 0, from).date;
    if (within(at)) out.push({ kind: 'opposition', at, body, view: bestInDark([body], place, at) });
  }

  // Mercury and Venus as far from the Sun as they get: their best evenings and mornings.
  for (const body of ['mercury', 'venus'] as const) {
    for (let found = SearchMaxElongation(ENGINE_BODY[body], from); within(found.time.date); found = SearchMaxElongation(ENGINE_BODY[body], new Date(found.time.date.getTime() + DAY))) {
      out.push({ kind: 'elongation', at: found.time.date, body, side: found.visibility === 'morning' ? 'morning' : 'evening', apart: found.elongation, view: bestInDark([body], place, found.time.date) });
    }
  }

  // The turns of the year.
  for (const year of new Set([from.getUTCFullYear(), until.getUTCFullYear()])) {
    const turns = Seasons(year);
    const moments: [Season, Date][] = [
      ['marchEquinox', turns.mar_equinox.date],
      ['juneSolstice', turns.jun_solstice.date],
      ['septemberEquinox', turns.sep_equinox.date],
      ['decemberSolstice', turns.dec_solstice.date],
    ];
    for (const [season, at] of moments) if (within(at)) out.push({ kind: 'season', at, season, view: ifUp(standing('sun', place, at)) });
  }

  return out.sort((one, other) => one.at.getTime() - other.at.getTime());
}
