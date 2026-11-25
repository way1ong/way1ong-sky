// Words for a landing place: the name of the mission, where it landed, its rows of facts.
import { CREW_ROLES, LANDED_ROLES, SITES, type CrewRole, type SiteId } from '../core/sites.ts';
import { fmt, num, type Dict } from './i18n.ts';

export const missionName = (d: Dict, id: SiteId): string => fmt(d.sites.mission, { n: SITES[id].mission });

/** "0.67° N, 23.47° E" — two decimals show the place to about three hundred metres, as on NASA's mission pages. */
export function coordinates(d: Dict, lang: string, id: SiteId): string {
  const { lat, lon } = SITES[id];
  const part = (value: number, plus: string, minus: string) => fmt(value < 0 ? minus : plus, { n: num(lang, Math.abs(value), 2) });
  return `${part(lat, d.sites.north, d.sites.south)}, ${part(lon, d.sites.east, d.sites.west)}`;
}

/** A day in universal time, as NASA gives the moments of a flight. */
export function dayUT(lang: string, iso: string): string {
  return new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso));
}

const person = (d: Dict, id: SiteId, role: CrewRole): string => {
  const key = SITES[id].crew[role] as keyof Dict['sites']['people'];
  return fmt(d.sites.person, { name: d.sites.people[key], role: d.sites.roles[role] });
};

export interface SiteRow {
  label: string;
  /** One line, or one line a person. */
  value: string[];
  /** A smaller line under the value. */
  more?: string;
}

export function siteRows(d: Dict, lang: string, id: SiteId): SiteRow[] {
  const site = SITES[id];
  const landed = LANDED_ROLES as readonly CrewRole[];
  const rows: SiteRow[] = [
    { label: d.sites.rows.place, value: [d.sites.place[id]], more: coordinates(d, lang, id) },
    { label: d.sites.rows.launched, value: [dayUT(lang, site.launched)] },
    { label: d.sites.rows.landed, value: [dayUT(lang, site.landed)] },
    { label: d.sites.rows.returned, value: [dayUT(lang, site.returned)] },
    { label: d.sites.rows.surface, value: landed.map((role) => person(d, id, role)) },
    { label: d.sites.rows.orbit, value: CREW_ROLES.filter((role) => !landed.includes(role)).map((role) => person(d, id, role)) },
    { label: d.sites.rows.eva, value: [fmt(d.sites.hours, { n: num(lang, site.evaHours, 2) })] },
    { label: d.sites.rows.traverse, value: [fmt(d.sites.km, { n: num(lang, site.traverseKm, site.traverseKm < 10 ? 2 : 1) })] },
    { label: d.sites.rows.samples, value: [fmt(d.sites.kg, { n: num(lang, site.sampleKg, 2) })] },
  ];
  if (site.rover) rows.push({ label: d.sites.rows.rover, value: [d.sites.roverYes] });
  return rows;
}
