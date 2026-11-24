// Where every body is at a moment, and how it is turned — astronomy-engine does the astronomy. Positions are
// in kilometres from the Sun, in the scene's axes: the plane of the Earth's orbit (the ecliptic of J2000) is
// the floor, +Y points to its north, +X to the March equinox.
import { Body, GeoMoon, HelioVector, KM_PER_AU, MakeTime, PlanetOrbitalPeriod, RotateVector, Rotation_EQJ_ECL, RotationAxis, Vector } from 'astronomy-engine';
import { BODY_IDS, MOON_PERIOD_DAYS, type BodyId, type PlanetId } from './bodies.ts';
import { add, cross, normalize, scale, type Vec3 } from './vec.ts';

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

/** Where a body is, kilometres from the Sun. */
export function positionKm(id: BodyId, date: Date): Vec3 {
  if (id === 'sun') return [0, 0, 0];
  if (id === 'moon') return add(positionKm('earth', date), scale(toScene(GeoMoon(date)), KM_PER_AU));
  return scale(toScene(HelioVector(ENGINE[id], date)), KM_PER_AU);
}

export function positionsKm(date: Date): Record<BodyId, Vec3> {
  return Object.fromEntries(BODY_IDS.map((id) => [id, positionKm(id, date)])) as Record<BodyId, Vec3>;
}

export interface Attitude {
  /** Where the body's north pole points. */
  north: Vec3;
  /** Where the point "longitude 0, latitude 0" of its map points. */
  meridian: Vec3;
}

/** How a body is turned at a moment: its pole and its prime meridian (IAU model, by astronomy-engine). */
export function attitude(id: BodyId, date: Date): Attitude {
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
 * or of the Moon around the Earth (then they are counted from the Earth), kilometres.
 */
export function orbitKm(id: Exclude<BodyId, 'sun'>, date: Date, points: number): Vec3[] {
  const days = id === 'moon' ? MOON_PERIOD_DAYS : orbitalPeriodDays(id);
  const out: Vec3[] = [];
  for (let i = 0; i < points; i++) {
    const at = new Date(date.getTime() + (i / points) * days * 86_400_000);
    out.push(id === 'moon' ? scale(toScene(GeoMoon(at)), KM_PER_AU) : positionKm(id, at));
  }
  return out;
}

export { KM_PER_AU };
