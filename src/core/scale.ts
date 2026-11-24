// Two ways to draw the Solar System. True scale: sizes and distances as they are — the planets are specks in
// an emptiness, which is the truth. Handy scale: distances squeezed and bodies swollen so that everything
// fits one look (the rule is in config.ts); directions are kept, so the planets stand where they really are
// as seen from the Sun.
import { SKY } from '../config.ts';
import { EARTH_RADIUS_KM, parentOf, radiusKm, ringSpanKm, type BodyId } from './bodies.ts';
import { KM_PER_AU } from './ephemeris.ts';
import { add, length, normalize, scale, sub, type Vec3 } from './vec.ts';

export const SCALES = ['handy', 'true'] as const;
export type ScaleMode = (typeof SCALES)[number];

/** The radius of a body in scene units. */
export function sceneRadius(id: BodyId, mode: ScaleMode): number {
  const km = radiusKm(id);
  if (mode === 'true') return km * SKY.trueUnitsPerKm;
  return SKY.handy.radius * (km / EARTH_RADIUS_KM) ** SKY.handy.radiusPower;
}

/** A place `km` from the Sun in scene units — for a body that goes around the Sun, and for its orbit. */
export function sceneFromSun(km: Vec3, mode: ScaleMode): Vec3 {
  if (mode === 'true') return scale(km, SKY.trueUnitsPerKm);
  const au = length(km) / KM_PER_AU;
  return au === 0 ? [0, 0, 0] : scale(normalize(km), SKY.handy.distance * au ** SKY.handy.distancePower);
}

/** A place `km` from its planet in scene units, counted from the planet — for a moon and its orbit. */
export function sceneFromPlanet(km: Vec3, planet: BodyId, mode: ScaleMode): Vec3 {
  if (mode === 'true') return scale(km, SKY.trueUnitsPerKm);
  return scale(normalize(km), SKY.handy.moonGap * sceneRadius(planet, mode));
}

/** Where every body is in scene units, given where it is in kilometres. */
export function scenePositions(km: Record<BodyId, Vec3>, mode: ScaleMode): Record<BodyId, Vec3> {
  const out = {} as Record<BodyId, Vec3>;
  for (const id of Object.keys(km) as BodyId[]) {
    const parent = parentOf(id);
    if (parent === null || parent === 'sun') out[id] = sceneFromSun(km[id], mode);
  }
  for (const id of Object.keys(km) as BodyId[]) {
    const parent = parentOf(id);
    if (parent !== null && parent !== 'sun') out[id] = add(out[parent], sceneFromPlanet(sub(km[id], km[parent]), parent, mode));
  }
  return out;
}

/** Saturn's rings in scene units: they grow with the planet, so the gap to it looks right in both scales. */
export function sceneRing(mode: ScaleMode): { inner: number; outer: number } {
  const span = ringSpanKm();
  const k = sceneRadius('saturn', mode) / radiusKm('saturn');
  return { inner: span.inner * k, outer: span.outer * k };
}
