// How a galaxy, a nebula or a cluster is called and how far it is said to be, in the language of the screen.
import { messierName, type DeepObject } from '../core/deep-sky.ts';
import { fmt, num, plural, type Dict } from './i18n.ts';

/** Its own name with its number in the catalogue — "Andromeda Galaxy (M31)" — or the number alone. */
export function deepName(d: Dict, o: DeepObject): string {
  const own = (d.sky.deep.names as Record<string, string>)[o.id];
  return own ? fmt(d.sky.deep.named, { name: own, messier: messierName(o) }) : messierName(o);
}

/** "445 light-years", "2.5 million light-years": the number as NASA's page gives it. */
export function deepDistance(d: Dict, lang: string, lightYears: number): string {
  const t = d.sky.deep;
  if (lightYears >= 1_000_000) return fmt(t.millions, { n: num(lang, lightYears / 1_000_000, 1) });
  return plural(lang, lightYears, t.lightYears, num(lang, lightYears));
}
