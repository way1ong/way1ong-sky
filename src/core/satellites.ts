// Where what the app tells and shows of Jupiter's moons comes from: NASA's pages for the words, the U.S.
// Geological Survey's catalogue for the maps of their surfaces.
import data from '../data/satellites.json';
import type { SatelliteId } from './bodies.ts';

/** The NASA Science page of each moon, and under `maps` the Survey's rule for the use of what it has made. */
export const SATELLITE_PAGES: Record<SatelliteId, string> & { maps: string } = { ...data.pages, maps: data.rules };
/** The page of each moon's map in the Survey's catalogue. */
export const SATELLITE_MAPS: Record<SatelliteId, string> = data.maps;
