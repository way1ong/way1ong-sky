// The places on the Moon where people landed: where each is, when, who, and what NASA's tables say of the stay.
// Nothing here is written from memory: src/data/sites.json names the NASA page of every number.
import data from '../data/sites.json';
import { attitude, positionKm, type Attitude } from './ephemeris.ts';
import { add, cross, dot, normalize, scale, sub, type Vec3 } from './vec.ts';

export const SITE_IDS = ['apollo11', 'apollo12', 'apollo14', 'apollo15', 'apollo16', 'apollo17'] as const;
export type SiteId = (typeof SITE_IDS)[number];

export const CREW_ROLES = ['commander', 'commandModulePilot', 'lunarModulePilot'] as const;
export type CrewRole = (typeof CREW_ROLES)[number];
/** The two who went down to the surface; the command module pilot stayed in orbit around the Moon. */
export const LANDED_ROLES = ['commander', 'lunarModulePilot'] as const satisfies readonly CrewRole[];

export interface Site {
  mission: number;
  /** Degrees north and east on the Moon. */
  lat: number;
  lon: number;
  /** Moments in universal time. */
  launched: string;
  landed: string;
  returned: string;
  crew: Record<CrewRole, string>;
  evaHours: number;
  traverseKm: number;
  sampleKg: number;
  rover: boolean;
  page: string;
  photo: { nasaId: string; title: string; credit: string; page: string };
}

export const SITES: Record<SiteId, Site> = data.sites;
export const SITE_SOURCES = data.source;

/**
 * From the centre of a body to a place on it: a unit vector in the scene, for a latitude north and a longitude
 * east of the body's prime meridian (degrees).
 */
export function surfaceDirection(turned: Attitude, latDeg: number, lonDeg: number): Vec3 {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  const east = cross(turned.north, turned.meridian);
  const flat = add(scale(turned.meridian, Math.cos(lon)), scale(east, Math.sin(lon)));
  return add(scale(flat, Math.cos(lat)), scale(turned.north, Math.sin(lat)));
}

/**
 * How high the Sun stands over a landing place at a moment, degrees over the place's flat horizon (under it
 * when negative): the angle between the way up from the place and the way to the Sun.
 */
export function sunOverSite(id: SiteId, date: Date): number {
  const up = surfaceDirection(attitude('moon', date), SITES[id].lat, SITES[id].lon);
  const toSun = normalize(sub(positionKm('sun', date), positionKm('moon', date)));
  return 90 - (Math.acos(Math.max(-1, Math.min(1, dot(up, toSun)))) * 180) / Math.PI;
}

