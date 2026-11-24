// Shadows: how much of the Sun's light reaches a point on a body when another body stands in the way — the
// Earth before the Moon (a lunar eclipse), the Moon before the Earth (a solar one). It is geometry: seen from
// the point, the Sun is a disc and so is the body in the way; the light left is the part of the Sun's disc
// that stays uncovered. Light bent by the Earth's air is not counted (config.ts gives the shaded Moon a dim
// glow instead). The same sums run in the drawing for every point of the picture (ui/shade-material.ts), so
// the numbers are prepared here in the form the drawing takes: small ratios, exact where it matters.
import { cross, dot, length, normalize, scale, sub, type Vec3 } from './vec.ts';

export interface Shade {
  /** From the body's middle to the Sun, a unit vector. */
  sunDir: Vec3;
  /** From the body's middle to the body in the way, a unit vector. */
  occDir: Vec3;
  /** sunDir × occDir, computed exactly: the two are almost one line during an eclipse. */
  cross0: Vec3;
  /** The Sun's radius as seen from the body, radians. */
  sunAngle: number;
  /** The radius of the body in the way, and of the body itself, in distances between their middles. */
  occRel: number;
  bodyRel: number;
}

/** The numbers of a shadow, from where the three bodies are (kilometres) and how large. */
export function shadeOf(bodyKm: Vec3, bodyRadiusKm: number, sunKm: Vec3, sunRadiusKm: number, occKm: Vec3, occRadiusKm: number): Shade {
  const toSun = sub(sunKm, bodyKm);
  const toOcc = sub(occKm, bodyKm);
  const sunDir = normalize(toSun);
  const occDir = normalize(toOcc);
  return {
    sunDir,
    occDir,
    cross0: cross(sunDir, occDir),
    sunAngle: Math.asin(sunRadiusKm / length(toSun)),
    occRel: occRadiusKm / length(toOcc),
    bodyRel: bodyRadiusKm / length(toOcc),
  };
}

/** The area two discs share: radii `a` and `b`, middles `d` apart. */
export function overlap(a: number, b: number, d: number): number {
  if (d >= a + b) return 0;
  if (d <= Math.abs(a - b)) return Math.PI * Math.min(a, b) ** 2;
  const x = Math.acos(Math.min(1, Math.max(-1, (d * d + a * a - b * b) / (2 * d * a))));
  const y = Math.acos(Math.min(1, Math.max(-1, (d * d + b * b - a * a) / (2 * d * b))));
  return a * a * (x - Math.sin(2 * x) / 2) + b * b * (y - Math.sin(2 * y) / 2);
}

/**
 * The part of the Sun's light, 0…1, that reaches the point of the body's surface lying in the direction
 * `dir` (a unit vector) from its middle. The Sun is so far that it looks the same from every point of the
 * body; the body in the way is near, so its place in the sky shifts from point to point — that shift is the
 * edge of the shadow moving across the body.
 */
export function lightAt(shade: Shade, dir: Vec3): number {
  const p = scale(dir, shade.bodyRel);
  const e = sub(shade.occDir, p);
  const le = length(e);
  // The body in the way must be on the Sun's side of the point, or it hides nothing.
  if (dot(shade.sunDir, e) <= 0) return 1;
  const occAngle = shade.occRel / le;
  const apart = length(scale(sub(shade.cross0, cross(shade.sunDir, p)), 1 / le));
  const covered = overlap(1, occAngle / shade.sunAngle, apart / shade.sunAngle) / Math.PI;
  return 1 - Math.min(1, covered);
}
