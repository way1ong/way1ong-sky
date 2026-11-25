// The bodies of the app: the Sun, the planets and the Moon. Sizes are NASA's (src/data/bodies.json, with the
// address and the date of each fact sheet); where a body is and how it turns comes from astronomy-engine.
import { SKY } from '../config.ts';
import data from '../data/bodies.json';
import satellites from '../data/jupiter-moons.json';

export const BODY_IDS = ['sun', 'mercury', 'venus', 'earth', 'moon', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'] as const;
export type BodyId = (typeof BODY_IDS)[number];
export type PlanetId = Exclude<BodyId, 'sun' | 'moon'>;

/**
 * Jupiter's four large moons: bodies of the flight (one can fly to them), but not of the list of bodies, of
 * the sky map or of the planets' fact sheet. Sizes are NASA's (src/data/jupiter-moons.json).
 */
export const SATELLITE_IDS = ['io', 'europa', 'ganymede', 'callisto'] as const;
export type SatelliteId = (typeof SATELLITE_IDS)[number];
/** Everything the flight draws and can fly to. */
export const WORLD_IDS = [...BODY_IDS, ...SATELLITE_IDS] as const;
export type WorldId = (typeof WORLD_IDS)[number];
export const isSatellite = (id: WorldId): id is SatelliteId => (SATELLITE_IDS as readonly string[]).includes(id);

export const PLANET_IDS: readonly PlanetId[] = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

/**
 * The giants: planets without a solid surface. NASA's sheet gives their gravity and temperature for the level
 * where the pressure is one bar, and their surface pressure as unknown.
 */
export const GIANT_IDS: readonly PlanetId[] = ['jupiter', 'saturn', 'uranus', 'neptune'];

/** The body another goes around: the Moon — the Earth, a moon of Jupiter — Jupiter, a planet — the Sun; the Sun — nothing. */
export function parentOf(id: WorldId): WorldId | null {
  return id === 'sun' ? null : id === 'moon' ? 'earth' : isSatellite(id) ? 'jupiter' : 'sun';
}

export function radiusKm(id: WorldId): number {
  return id === 'sun' ? data.sunRadiusKm : isSatellite(id) ? satellites.moons[id].radiusKm : data.diameterKm[id] / 2;
}

export const EARTH_RADIUS_KM = radiusKm('earth');

/** Saturn's rings as the ring texture shows them: from Saturn's equator out to past the F ring, km. */
export function ringSpanKm(): { inner: number; outer: number } {
  const { saturnEquatorKm, aOuterEdgeKm } = data.saturnRings;
  return { inner: saturnEquatorKm, outer: saturnEquatorKm + (aOuterEdgeKm - saturnEquatorKm) / SKY.ringTextureAOuterAt };
}

/** How near and how far from the Sun a planet comes, km (NASA) — for checking the positions we compute. */
export function sunDistanceRangeKm(id: PlanetId): { min: number; max: number } {
  return { min: data.perihelionMillionKm[id] * 1e6, max: data.aphelionMillionKm[id] * 1e6 };
}

/** The same for the Moon and the Earth. */
export const MOON_DISTANCE_RANGE_KM = { min: data.moon.perigeeMillionKm * 1e6, max: data.moon.apogeeMillionKm * 1e6 };
export const MOON_PERIOD_DAYS = data.moon.orbitalPeriodDays;

export const SOURCES = data.source;
