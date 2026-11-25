// Where every body is at a moment, and how it is turned — astronomy-engine does the astronomy. Positions are
// in kilometres from the Sun, in the scene's axes: the plane of the Earth's orbit (the ecliptic of J2000) is
// the floor, +Y points to its north, +X to the March equinox.
import { Body, C_AUDAY, GeoMoon, HelioVector, Illumination, JupiterMoons, KM_PER_AU, MakeTime, PlanetOrbitalPeriod, RotateVector, Rotation_EQJ_ECL, RotationAxis, Vector } from 'astronomy-engine';
import satellites from '../data/jupiter-moons.json';
import { MOON_PERIOD_DAYS, WORLD_IDS, isSatellite, type BodyId, type PlanetId, type SatelliteId, type WorldId } from './bodies.ts';
import { add, cross, dot, normalize, scale, sub, type Vec3 } from './vec.ts';

const ENGINE: Record<BodyId, Body> = {
  sun: Body.Sun,
  mercury: Body.Mercury,
  venus: Body.Venus,
  earth: Body.Earth,
  moon: Body.Moon,
  mars: Body.Mars,
  jupiter: Body.Jupiter,
  saturn: Body.Saturn,
  uranus: Body.Uranus,
  neptune: Body.Neptune,
};

const TO_ECLIPTIC = Rotation_EQJ_ECL();

/** A vector of the engine (equator of J2000) in the scene's axes; lengths are kept. */
function toScene(v: Vector): Vec3 {
  const e = RotateVector(TO_ECLIPTIC, v);
  return [e.x, e.z, -e.y];
}

/** A moon of Jupiter counted from Jupiter at a moment: where it is (km) and which way it moves (any length). */
function aroundJupiter(id: SatelliteId, date: Date): { at: Vec3; moving: Vec3 } {
  const state = JupiterMoons(date)[id];
  return { at: scale(toScene(new Vector(state.x, state.y, state.z, state.t)), KM_PER_AU), moving: toScene(new Vector(state.vx, state.vy, state.vz, state.t)) };
}

/** Where a body is, kilometres from the Sun. */
export function positionKm(id: WorldId, date: Date): Vec3 {
  if (id === 'sun') return [0, 0, 0];
  if (id === 'moon') return add(positionKm('earth', date), scale(toScene(GeoMoon(date)), KM_PER_AU));
  if (isSatellite(id)) return add(positionKm('jupiter', date), aroundJupiter(id, date).at);
  return scale(toScene(HelioVector(ENGINE[id], date)), KM_PER_AU);
}

export function positionsKm(date: Date): Record<WorldId, Vec3> {
  return Object.fromEntries(WORLD_IDS.map((id) => [id, positionKm(id, date)])) as Record<WorldId, Vec3>;
}

export interface Attitude {
  /** Where the body's north pole points. */
  north: Vec3;
  /** Where the point "longitude 0, latitude 0" of its map points. */
  meridian: Vec3;
}

/** How a body is turned at a moment: its pole and its prime meridian (IAU model, by astronomy-engine). */
/**
 * How a moon of Jupiter is turned — an approximation, not the engine's reckoning (it has none for them):
 * the pole stands square to the moon's orbit, and one side always faces Jupiter (NASA's fact sheet marks
 * their rotation as synchronous). The middle of the map looks at Jupiter when the map's page says its middle
 * is longitude 0, away from it when it says 180 — and away from it too where the page does not say.
 */
function satelliteAttitude(id: SatelliteId, date: Date): Attitude {
  const { at, moving } = aroundJupiter(id, date);
  const north = normalize(cross(at, moving));
  const toJupiter = normalize(sub(scale(at, -1), scale(north, dot(scale(at, -1), north))));
  return { north, meridian: satellites.moons[id].mapCentreLongitude === 0 ? toJupiter : scale(toJupiter, -1) };
}

export function attitude(id: WorldId, date: Date): Attitude {
  if (isSatellite(id)) return satelliteAttitude(id, date);
  const axis = RotationAxis(ENGINE[id], date);
  const time = MakeTime(date);
  const north = normalize(toScene(axis.north));
  // The node where the body's equator crosses the equator of J2000 going north: the engine's Z × north.
  const node = normalize(cross(toScene(new Vector(0, 0, 1, time)), north));
  const spin = (axis.spin * Math.PI) / 180;
  const meridian = normalize(add(scale(node, Math.cos(spin)), scale(cross(north, node), Math.sin(spin))));
  return { north, meridian };
}

/** One trip of a planet around the Sun, days. */
export function orbitalPeriodDays(id: PlanetId): number {
  return PlanetOrbitalPeriod(ENGINE[id]);
}

/**
 * The line of a body's orbit as it is travelled from `date` on: `points` places of a planet around the Sun,
 * or of the Moon around the Earth, or of a moon of Jupiter around Jupiter (then they are counted from the
 * planet), kilometres.
 */
export function orbitKm(id: Exclude<WorldId, 'sun'>, date: Date, points: number): Vec3[] {
  const days = id === 'moon' ? MOON_PERIOD_DAYS : isSatellite(id) ? satellites.moons[id].periodDays : orbitalPeriodDays(id);
  const out: Vec3[] = [];
  for (let i = 0; i < points; i++) {
    const at = new Date(date.getTime() + (i / points) * days * 86_400_000);
    out.push(id === 'moon' ? scale(toScene(GeoMoon(at)), KM_PER_AU) : isSatellite(id) ? aroundJupiter(id, at).at : positionKm(id, at));
  }
  return out;
}

/** How long light takes to cross a distance, minutes (the speed of light is the engine's constant). */
export function lightMinutes(km: number): number {
  return (km / KM_PER_AU / C_AUDAY) * 1440;
}

/** The part of the Moon's disc that is lit as seen from the Earth, 0…1. */
export function moonLitFraction(date: Date): number {
  return Illumination(Body.Moon, date).phase_fraction;
}

export { KM_PER_AU };
