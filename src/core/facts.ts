// What a body's card says. The lasting numbers are NASA's (src/data/facts.json and bodies.json, with the
// address and date of each fact sheet; what each row means — NASA's notes to the sheet). Comparisons with the
// Earth, "the largest", "the hottest" and the like are worked out from those numbers here, never written by
// hand; distances "now" are computed for the moment the picture shows.
import { PLANET_IDS, radiusKm, type BodyId, type PlanetId } from './bodies.ts';
import data from '../data/facts.json';
import { lightMinutes, moonLitFraction, positionKm } from './ephemeris.ts';
import { length, sub } from './vec.ts';

export const FACT_SOURCES = data.source;

const EARTH = data.planets.earth;

export interface PlanetFacts {
  kind: 'planet';
  diameterKm: number;
  /** Mass in 10^24 kg, and the surface gravity in m/s² (for the giants — at the 1 bar level). */
  massE24kg: number;
  gravity: number;
  /** From noon to noon, hours. */
  dayHours: number;
  /** Once around the Sun, Earth days. */
  yearDays: number;
  sunDistanceMillionKm: number;
  /** The average over the whole surface (for the giants — at the 1 bar level), °C. */
  meanTempC: number;
  /** Moons confirmed by the IAU. */
  moons: number;
  rings: boolean;
  /** How many times the Earth's: diameter, mass, gravity. */
  toEarth: { diameter: number; mass: number; gravity: number };
}

export interface MoonFacts {
  kind: 'moon';
  diameterKm: number;
  massE24kg: number;
  gravity: number;
  dayHours: number;
  /** Once around the Earth against the stars, Earth days. */
  orbitDays: number;
  earthDistanceKm: number;
  meanTempC: number;
  toEarth: { diameter: number; mass: number; gravity: number };
}

export interface SunFacts {
  kind: 'sun';
  diameterKm: number;
  gravity: number;
  /** One turn against the stars at the latitude NASA gives it for, hours. */
  rotationHours: number;
  rotationAtLatitudeDeg: number;
  /** The temperature of the visible surface, kelvins. */
  effectiveTempK: number;
  toEarth: { diameter: number; mass: number; gravity: number };
}

export type Facts = PlanetFacts | MoonFacts | SunFacts;

const ratios = (id: BodyId, massE24kg: number, gravity: number) => ({
  diameter: radiusKm(id) / radiusKm('earth'),
  mass: massE24kg / EARTH.massE24kg,
  gravity: gravity / EARTH.gravity,
});

export function factsOf(id: BodyId): Facts {
  if (id === 'sun') {
    const sun = data.sun;
    // NASA gives the Sun's ratios to the Earth itself — taken as they stand.
    return {
      kind: 'sun',
      diameterKm: radiusKm('sun') * 2,
      gravity: sun.gravity,
      rotationHours: sun.rotationHours,
      rotationAtLatitudeDeg: sun.rotationAtLatitudeDeg,
      effectiveTempK: sun.effectiveTempK,
      toEarth: { diameter: sun.radiusToEarth, mass: sun.massToEarth, gravity: sun.gravityToEarth },
    };
  }
  if (id === 'moon') {
    const moon = data.moon;
    return {
      kind: 'moon',
      diameterKm: radiusKm('moon') * 2,
      massE24kg: moon.massE24kg,
      gravity: moon.gravity,
      dayHours: moon.dayHours,
      orbitDays: moon.orbitDays,
      earthDistanceKm: moon.earthDistanceMillionKm * 1e6,
      meanTempC: moon.meanTempC,
      toEarth: ratios('moon', moon.massE24kg, moon.gravity),
    };
  }
  const planet = data.planets[id];
  return { kind: 'planet', diameterKm: radiusKm(id) * 2, ...planet, toEarth: ratios(id, planet.massE24kg, planet.gravity) };
}

/** One Earth year in Earth days, as NASA's sheet has it: for saying a planet's year in Earth years. */
export const EARTH_YEAR_DAYS = EARTH.yearDays;

export const SUPERLATIVES = ['largest', 'smallest', 'hottest', 'coldest', 'longestDay', 'shortestDay', 'mostMoons', 'nearest', 'farthest'] as const;
export type Superlative = (typeof SUPERLATIVES)[number];

const MEASURES: Record<Superlative, { of: (p: PlanetId) => number; most: boolean }> = {
  largest: { of: (p) => radiusKm(p), most: true },
  smallest: { of: (p) => radiusKm(p), most: false },
  hottest: { of: (p) => data.planets[p].meanTempC, most: true },
  coldest: { of: (p) => data.planets[p].meanTempC, most: false },
  longestDay: { of: (p) => data.planets[p].dayHours, most: true },
  shortestDay: { of: (p) => data.planets[p].dayHours, most: false },
  mostMoons: { of: (p) => data.planets[p].moons, most: true },
  nearest: { of: (p) => data.planets[p].sunDistanceMillionKm, most: false },
  farthest: { of: (p) => data.planets[p].sunDistanceMillionKm, most: true },
};

/** The planet that leads the eight in something; null — two share the lead, so nobody is named. */
export function leader(what: Superlative): PlanetId | null {
  const { of, most } = MEASURES[what];
  const values = PLANET_IDS.map(of);
  const best = most ? Math.max(...values) : Math.min(...values);
  const leaders = PLANET_IDS.filter((p) => of(p) === best);
  return leaders.length === 1 ? (leaders[0] as PlanetId) : null;
}

/** In what a body leads the eight planets (the Sun and the Moon are not planets: nothing). */
export function superlativesOf(id: BodyId): Superlative[] {
  return SUPERLATIVES.filter((what) => leader(what) === id);
}

export interface Now {
  /** From the Sun and from the Earth at the moment shown, km; null — the body itself. */
  fromSunKm: number | null;
  fromEarthKm: number | null;
  /** How long light takes from the Sun to the body and from the body to the Earth, minutes. */
  lightFromSunMin: number | null;
  lightToEarthMin: number | null;
  /** The Moon only: the part of its disc lit as seen from the Earth, 0…1. */
  litFraction: number | null;
}

export function nowOf(id: BodyId, date: Date): Now {
  const at = positionKm(id, date);
  const fromSunKm = id === 'sun' ? null : length(at);
  const fromEarthKm = id === 'earth' ? null : length(sub(at, positionKm('earth', date)));
  return {
    fromSunKm,
    fromEarthKm,
    lightFromSunMin: fromSunKm === null ? null : lightMinutes(fromSunKm),
    lightToEarthMin: fromEarthKm === null ? null : lightMinutes(fromEarthKm),
    litFraction: id === 'moon' ? moonLitFraction(date) : null,
  };
}
