// What the coming (or the ongoing) night holds over a place: when the Sun sets and rises, when it is dark,
// how the Moon looks, and which planets can be seen by the eye, when and where. Times are moments; the
// screen writes them by the device's clock.
import { Body, Illumination, MoonPhase, Observer, SearchAltitude, SearchRiseSet } from 'astronomy-engine';
import { SKY } from '../config.ts';
import { altAz, bodyInSky, bodyMagnitude, riseAndSet, skyTurn, type Place, type SkyBodyId } from './sky.ts';

export const PLANETS_IN_THE_SKY = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'] as const satisfies readonly SkyBodyId[];
export type SkyPlanetId = (typeof PLANETS_IN_THE_SKY)[number];


/**
 * The eight looks of the Moon, by the angle between it and the Sun along the ecliptic: the engine gives 0 for
 * the new moon, 90 for the first quarter, 180 for the full moon and 270 for the last quarter; each name
 * takes an eighth of the circle around its angle.
 */
export const MOON_PHASES = ['new', 'waxingCrescent', 'firstQuarter', 'waxingGibbous', 'full', 'waningGibbous', 'lastQuarter', 'waningCrescent'] as const;
export type MoonPhaseName = (typeof MOON_PHASES)[number];

export function moonPhaseName(date: Date): MoonPhaseName {
  return MOON_PHASES[Math.round(MoonPhase(date) / 45) % 8] as MoonPhaseName;
}

export interface PlanetTonight {
  id: SkyPlanetId;
  /** How bright it is: the smaller the number, the brighter. */
  magnitude: number;
  /** Bright enough to be found by the eye (the program's own measure, `SKY.tonight.eyeMagnitude`). */
  forTheEye: boolean;
  /** From when to when it is up in the dark, and its best moment; null — not this night. */
  seen: { from: Date; to: Date; best: Date; altitude: number; azimuth: number } | null;
}

export interface Tonight {
  /** The setting that opens the night and the rising that ends it; null — the Sun does not set, or does not rise. */
  sunset: Date | null;
  sunrise: Date | null;
  /** While it is dark enough for stars; null — it does not get dark this night. */
  dark: { from: Date; to: Date } | null;
  moon: { phase: MoonPhaseName; lit: number; rise: Date | null; set: Date | null };
  planets: PlanetTonight[];
}

const DAY = 86_400_000;

export function tonight(place: Place, now: Date): Tonight {
  const observer = new Observer(place.lat, place.lon, 0);
  // Day or night is told by the engine's own settings and risings (it counts the upper edge and the bending
  // of light), not by the height of the Sun's middle: in the minutes between the two the answers differ.
  const nextSet = SearchRiseSet(Body.Sun, observer, -1, now, 1)?.date ?? null;
  const nextRise = SearchRiseSet(Body.Sun, observer, 1, now, 1)?.date ?? null;
  const sunIsUp = nextSet && nextRise ? nextSet < nextRise : nextSet ? true : nextRise ? false : altAz(bodyInSky('sun', skyTurn(place, now))).altitude > 0;
  // By day the night ahead; by night the night that is on — it began at the last setting.
  const sunset = sunIsUp ? nextSet : (SearchRiseSet(Body.Sun, observer, -1, now, -1)?.date ?? null);
  const sunrise = SearchRiseSet(Body.Sun, observer, 1, sunset ?? now, 1)?.date ?? null;
  const limit = SKY.tonight.darkSunAltitude;
  let dark: Tonight['dark'] = null;
  if (sunset && sunrise) {
    const from = SearchAltitude(Body.Sun, observer, -1, sunset, 1, limit)?.date ?? null;
    const to = from ? (SearchAltitude(Body.Sun, observer, 1, from, 1, limit)?.date ?? null) : null;
    if (from && to && from < sunrise) dark = { from, to };
  }
  const moonAt = dark ? new Date((dark.from.getTime() + dark.to.getTime()) / 2) : now;
  // The Moon of this night: its rising may come before the Sun has set, its setting after the Sun is up again.
  const from = sunset ?? now;
  const moon = {
    phase: moonPhaseName(moonAt),
    lit: Illumination(Body.Moon, moonAt).phase_fraction,
    rise: riseAndSet('moon', place, new Date(from.getTime() - DAY / 2), 1).rise,
    set: riseAndSet('moon', place, from, 1).set,
  };

  const planets = PLANETS_IN_THE_SKY.map((id): PlanetTonight => {
    const magnitude = bodyMagnitude(id, moonAt);
    let seen: PlanetTonight['seen'] = null;
    if (dark) {
      const step = SKY.tonight.stepMinutes * 60_000;
      for (let t = dark.from.getTime(); t <= dark.to.getTime(); t += step) {
        const at = new Date(t);
        const { altitude, azimuth } = altAz(bodyInSky(id, skyTurn(place, at)));
        if (altitude < SKY.tonight.leastAltitude) continue;
        if (!seen) seen = { from: at, to: at, best: at, altitude, azimuth };
        seen.to = at;
        if (altitude > seen.altitude) Object.assign(seen, { best: at, altitude, azimuth });
      }
    }
    return { id, magnitude, forTheEye: magnitude <= SKY.tonight.eyeMagnitude, seen };
  });
  return { sunset, sunrise, dark, moon, planets };
}

/** The point of the compass a bearing is nearest to. */
export const COMPASS_POINTS = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'] as const;
export function compassPoint(azimuth: number): (typeof COMPASS_POINTS)[number] {
  return COMPASS_POINTS[Math.round((((azimuth % 360) + 360) % 360) / 45) % 8] as (typeof COMPASS_POINTS)[number];
}

export { DAY };
