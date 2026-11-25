// The cities the sky can be shown for: names in three languages and where they are (Wikidata, CC0;
// scripts/stars/cities.mjs makes the file). The program never asks the device where it is.
import data from '../data/cities.json';
import type { Place } from './sky.ts';

type Names = Record<'en' | 'uk' | 'hu', string>;

export interface City extends Place {
  /** The city's record in Wikidata. */
  id: string;
  names: Names;
  country: Names;
  /** Other spellings of the city in the names of time zones ("kiev"), lower case. */
  zoneNames?: string[];
}

export const CITIES: readonly City[] = data.cities;
export const CITY_SOURCE = data.source;

const pick = (names: Names, lang: string): string => names[lang as keyof Names] ?? names.en;
export const cityName = (city: City, lang: string): string => pick(city.names, lang);
export const countryName = (city: City, lang: string): string => pick(city.country, lang);

export function cityById(id: string | undefined): City | undefined {
  return id === undefined ? undefined : CITIES.find((city) => city.id === id);
}

/** The capitals the program starts from when it knows nothing better, by the language of the screen. */
const BY_LANGUAGE: Record<string, string> = data.byLanguage;

/**
 * The place to begin with: the city the device's time zone is named after ("Europe/Budapest"), else the
 * capital that goes with the language, else the first city of the list.
 */
export function firstCity(timeZone: string | undefined, lang: string): City {
  const zoneCity = timeZone?.split('/').pop()?.replaceAll('_', ' ').toLowerCase();
  const byZone = zoneCity ? CITIES.find((city) => city.names.en.toLowerCase() === zoneCity || city.zoneNames?.includes(zoneCity)) : undefined;
  return byZone ?? cityById(BY_LANGUAGE[lang]) ?? cityById(BY_LANGUAGE.en) ?? (CITIES[0] as City);
}
