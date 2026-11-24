// The app's clock: the moment the picture shows. It follows the real clock, or runs faster, backwards, or
// stands still — the player steps through the speeds of config.ts. Plain data; every change returns a new
// clock.
import { SKY } from '../config.ts';

export interface Clock {
  /** The moment shown when the real clock read `realAt`, ms since 1970. */
  simAt: number;
  realAt: number;
  /** Which of the speeds of config.ts. */
  rate: number;
  paused: boolean;
}

export const RATES: readonly number[] = SKY.time.rates;
export const REAL_RATE = RATES.indexOf(1);
export const LIMITS = { from: Date.UTC(SKY.time.fromYear, 0, 1), to: Date.UTC(SKY.time.toYear, 11, 31, 23, 59, 59) };

const clamp = (ms: number) => Math.min(LIMITS.to, Math.max(LIMITS.from, ms));

/** A clock that shows the present and keeps up with it. */
export function liveClock(real: number): Clock {
  return { simAt: clamp(real), realAt: real, rate: REAL_RATE, paused: false };
}

/** The moment the clock shows when the real clock reads `real`. */
export function shownAt(clock: Clock, real: number): number {
  if (clock.paused) return clock.simAt;
  return clamp(clock.simAt + (real - clock.realAt) * (RATES[clock.rate] as number));
}

/** The same clock, counted from `real`: what every change starts with, so the picture does not jump. */
function rebased(clock: Clock, real: number): Clock {
  return { ...clock, simAt: shownAt(clock, real), realAt: real };
}

export function togglePause(clock: Clock, real: number): Clock {
  return { ...rebased(clock, real), paused: !clock.paused };
}

/** One step faster (+1) or slower (−1) through the speeds; past real time the clock runs backwards. */
export function stepRate(clock: Clock, real: number, step: 1 | -1): Clock {
  const rate = Math.min(RATES.length - 1, Math.max(0, clock.rate + step));
  return { ...rebased(clock, real), rate, paused: false };
}

/** To a moment, standing still there. */
export function jumpTo(clock: Clock, real: number, moment: number): Clock {
  return { ...clock, simAt: clamp(moment), realAt: real, paused: true };
}

/** Whether the clock shows the present and keeps up with it. */
export function isLive(clock: Clock, real: number): boolean {
  return !clock.paused && clock.rate === REAL_RATE && Math.abs(shownAt(clock, real) - real) < 1500;
}

/** Whether the picture changes by itself: the clock runs, and not merely with the real one. */
export function isRunningFast(clock: Clock): boolean {
  return !clock.paused && clock.rate !== REAL_RATE;
}

/** Whether the clock has run into the first or the last year it may show. */
export function atLimit(clock: Clock, real: number): boolean {
  const at = shownAt(clock, real);
  return !clock.paused && ((at <= LIMITS.from && (RATES[clock.rate] as number) < 0) || (at >= LIMITS.to && (RATES[clock.rate] as number) > 1));
}

/** Whether the hour and minute are still worth writing at this speed (config.ts). */
export function showsTimeOfDay(clock: Clock): boolean {
  return clock.paused || Math.abs(RATES[clock.rate] as number) <= SKY.time.clockUpToRate;
}

/** Whether the bodies are still turned at this speed (config.ts). */
export function showsSpin(clock: Clock): boolean {
  return clock.paused || Math.abs(RATES[clock.rate] as number) <= SKY.time.spinUpToRate;
}
