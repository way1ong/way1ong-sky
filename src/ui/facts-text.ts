// A body's card in words: every row of core/facts.ts with its number written the language's way.
import { GIANT_IDS, type BodyId, type PlanetId } from '../core/bodies.ts';
import { EARTH_YEAR_DAYS, factsOf, nowOf, superlativesOf } from '../core/facts.ts';
import { fmt, num, plural, type Dict } from './i18n.ts';

export interface CardRow {
  label: string;
  value: string;
  /** A second line: the same in another measure, or a comparison with the Earth. */
  more: string;
}

/** Kelvins to degrees Celsius: the scales differ by this, by definition. */
const KELVIN_OFFSET = 273.15;

export function cardBadges(d: Dict, id: BodyId): string[] {
  return superlativesOf(id).map((what) => d.card.most[what]);
}

export function cardRows(d: Dict, lang: string, id: BodyId, date: Date): CardRow[] {
  const f = factsOf(id);
  const now = nowOf(id, date);
  const u = d.card.units;
  const rows: CardRow[] = [];
  const giant = GIANT_IDS.includes(id as PlanetId);
  const add = (label: string, value: string, more = '') => rows.push({ label, value, more });
  const timesEarth = (ratio: number) => (id === 'earth' ? '' : fmt(d.card.timesEarth, { n: num(lang, ratio, 0, 3) }));
  const days = (n: number, digits: number) => plural(lang, Number(n.toFixed(digits)), d.card.earthDays, num(lang, n, digits));
  const light = (minutes: number) => {
    if (minutes < 1) return fmt(u.lightSec, { n: num(lang, minutes * 60, 1) });
    if (minutes < 120) return fmt(u.lightMin, { n: num(lang, minutes, minutes < 10 ? 1 : 0) });
    const whole = Math.round(minutes);
    return fmt(u.lightHours, { h: num(lang, Math.floor(whole / 60)), m: num(lang, whole % 60) });
  };
  const far = (km: number) => (km < 1e6 ? fmt(u.km, { n: num(lang, km) }) : fmt(u.millionKm, { n: num(lang, km / 1e6, 1) }));

  add(d.card.rows.diameter, fmt(u.km, { n: num(lang, f.diameterKm) }), timesEarth(f.toEarth.diameter));
  if (f.kind === 'sun') add(d.card.rows.mass, fmt(d.card.timesEarth, { n: num(lang, f.toEarth.mass) }));
  else add(d.card.rows.mass, fmt(u.mass, { n: num(lang, f.massE24kg, 3) }), timesEarth(f.toEarth.mass));
  add(giant ? d.card.rows.gravityGiant : d.card.rows.gravity, fmt(u.gravity, { n: num(lang, f.gravity, 1) }), timesEarth(f.toEarth.gravity));

  if (f.kind === 'sun') {
    add(d.card.rows.rotation, days(f.rotationHours / 24, 1), fmt(u.atLatitude, { n: num(lang, f.rotationAtLatitudeDeg) }));
    add(d.card.rows.surfaceTemp, fmt(u.kelvin, { n: num(lang, f.effectiveTempK) }), fmt(u.celsius, { n: num(lang, f.effectiveTempK - KELVIN_OFFSET) }));
  } else {
    add(d.card.rows.day, fmt(u.hours, { n: num(lang, f.dayHours, 1) }), f.dayHours >= 48 ? days(f.dayHours / 24, 1) : '');
  }
  if (f.kind === 'planet') {
    const years = f.yearDays / EARTH_YEAR_DAYS;
    add(d.card.rows.year, days(f.yearDays, 1), years >= 2 ? plural(lang, Number(years.toFixed(1)), d.card.earthYears, num(lang, years, 1)) : '');
    add(d.card.rows.sunDistance, fmt(u.millionKm, { n: num(lang, f.sunDistanceMillionKm, 1) }));
  }
  if (f.kind === 'moon') {
    add(d.card.rows.orbit, days(f.orbitDays, 1));
    add(d.card.rows.earthDistance, fmt(u.km, { n: num(lang, f.earthDistanceKm) }));
  }
  if (now.fromSunKm !== null && now.lightFromSunMin !== null) add(d.card.rows.nowSun, far(now.fromSunKm), light(now.lightFromSunMin));
  if (now.fromEarthKm !== null && now.lightToEarthMin !== null) add(d.card.rows.nowEarth, far(now.fromEarthKm), light(now.lightToEarthMin));
  if (now.litFraction !== null) add(d.card.rows.lit, fmt(u.percent, { n: num(lang, now.litFraction * 100) }));
  if (f.kind !== 'sun') add(giant ? d.card.rows.temperatureGiant : d.card.rows.temperature, fmt(u.celsius, { n: num(lang, f.meanTempC) }));
  if (f.kind === 'planet') {
    add(d.card.rows.moons, num(lang, f.moons));
    add(d.card.rows.rings, f.rings ? d.card.yes : d.card.no);
  }
  return rows;
}
