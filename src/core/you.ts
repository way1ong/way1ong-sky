// "What if you were here?" — an age counted in a planet's own years and what a scale would show there, and a
// body beside the Earth for size. All from NASA's fact sheets already in the app.
import { SKY } from '../config.ts';
import type { BodyId } from './bodies.ts';
import { EARTH_YEAR_DAYS, factsOf } from './facts.ts';

/** An age in the planet's own years: how many times it has gone round the Sun in that time. Null — not a planet, or the Earth itself. */
export function yearsThere(id: BodyId, earthYears: number): number | null {
  const facts = factsOf(id);
  return facts.kind === 'planet' && id !== 'earth' ? (earthYears * EARTH_YEAR_DAYS) / facts.yearDays : null;
}

/**
 * What a scale that shows kilograms on the Earth would show there: the mass is the same, the pull differs.
 * Null — the Earth itself, and the Sun (nowhere to stand).
 */
export function scaleThere(id: BodyId, kgOnEarth: number): number | null {
  return id === 'earth' || id === 'sun' ? null : kgOnEarth * factsOf(id).toEarth.gravity;
}

/** A number typed by a person: with a comma or a point, greater than nothing and no greater than `most`; else null. */
export function typedNumber(text: string, most: number): number | null {
  const value = Number(text.trim().replace(',', '.'));
  return text.trim() !== '' && Number.isFinite(value) && value > 0 && value <= most ? value : null;
}
export const YOU_LIMITS = SKY.you;

/** The body a card sets its own beside, for size: the Earth — and for the Earth, the Moon. */
export function besideFor(id: BodyId): BodyId {
  return id === 'earth' ? 'moon' : 'earth';
}

/** How many times the diameter of the body is the diameter of the one beside it. */
export function diameterRatio(id: BodyId): number {
  return factsOf(id).diameterKm / factsOf(besideFor(id)).diameterKm;
}

/**
 * Two circles to one scale in a drawing `width` × `height`: the body on the left, the other on the right, both
 * standing on one line. The smaller is never under `least` px; when that makes the larger too big for the
 * drawing, the larger is shown as an arc — its edge still to scale.
 */
export function sizeDrawing(ratio: number, width: number, height: number): { body: { cx: number; cy: number; r: number }; other: { cx: number; cy: number; r: number } } {
  const { leastPx, mostShare } = SKY.you.drawing;
  const most = (height * mostShare) / 2;
  const larger = Math.max(ratio, 1 / ratio);
  const big = Math.max(most, leastPx * larger);
  const small = big / larger;
  const floor = height / 2 + most;
  // A circle that fits stands in its half; one too big keeps its near edge in place and runs off the drawing.
  const left = (r: number) => ({ cx: r <= most ? width / 4 : width / 2 - most * 0.4 - r, cy: r <= most ? floor - r : height / 2, r });
  const right = (r: number) => ({ cx: r <= most ? (width * 3) / 4 : width / 2 + most * 0.4 + r, cy: r <= most ? floor - r : height / 2, r });
  return ratio >= 1 ? { body: left(big), other: right(small) } : { body: left(small), other: right(big) };
}
