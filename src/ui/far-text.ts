// How things of the model of the Galaxy are called and how the age of their light is said, in the language of the screen.
import { messierName, type DeepObject } from '../core/deep-sky.ts';
import { fmt, num, plural, type Dict } from './i18n.ts';

/** The short name for the heading and the buttons: its own name, or its number in the catalogue. */
export function farName(d: Dict, o: DeepObject): string {
  return (d.sky.deep.names as Record<string, string>)[o.id] ?? messierName(o);
}

/** "2.5 million years": light takes a year to cross a light-year. */
export function farYears(d: Dict, lang: string, lightYears: number): string {
  const t = d.far.years;
  if (lightYears >= 1_000_000) return fmt(t.millions, { n: num(lang, lightYears / 1_000_000, 1) });
  return plural(lang, lightYears, t.plain, num(lang, lightYears));
}
