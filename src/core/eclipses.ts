// The next eclipse after a moment — astronomy-engine searches for it. A lunar eclipse in which the Moon only
// brushes the outer, pale part of the Earth's shadow is passed over: there is next to nothing to see.
import { EclipseKind, NextLunarEclipse, SearchGlobalSolarEclipse, SearchLunarEclipse } from 'astronomy-engine';

export type LunarKind = 'partial' | 'total';
export type SolarKind = 'partial' | 'annular' | 'total';

export interface Eclipse<Kind> {
  kind: Kind;
  /** The middle of the eclipse. */
  peak: Date;
}

/**
 * The search starts a little after the moment given: asked at the very middle of an eclipse (the clock stops
 * there when an eclipse is shown), it must find the next one, and the engine would find the same again.
 */
const later = (moment: Date): Date => new Date(moment.getTime() + 86_400_000);

export function nextLunarEclipse(after: Date): Eclipse<LunarKind> {
  let found = SearchLunarEclipse(later(after));
  while (found.kind === EclipseKind.Penumbral) found = NextLunarEclipse(found.peak);
  return { kind: found.kind as LunarKind, peak: found.peak.date };
}

export function nextSolarEclipse(after: Date): Eclipse<SolarKind> {
  const found = SearchGlobalSolarEclipse(later(after));
  return { kind: found.kind as SolarKind, peak: found.peak.date };
}
