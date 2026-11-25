import { describe, expect, it } from 'vitest';
import { CITIES, cityById, cityName, countryName, firstCity } from './places.ts';

describe('the cities of the sky map', () => {
  it('has cities on the globe, each with a name and a country in three languages, none twice', () => {
    expect(CITIES.length).toBeGreaterThan(30);
    expect(new Set(CITIES.map((city) => city.id)).size).toBe(CITIES.length);
    for (const city of CITIES) {
      expect(Math.abs(city.lat), city.id).toBeLessThanOrEqual(90);
      expect(Math.abs(city.lon), city.id).toBeLessThanOrEqual(180);
      for (const lang of ['en', 'uk', 'hu']) {
        expect(cityName(city, lang), city.id).toBeTruthy();
        expect(countryName(city, lang), city.id).toBeTruthy();
      }
    }
  });

  it('begins with the city of the time zone, else with the capital of the language', () => {
    expect(firstCity('Europe/Budapest', 'en').names.en).toBe('Budapest');
    expect(firstCity('Europe/Kiev', 'en').names.en).toBe('Kyiv');
    expect(firstCity('Europe/Kyiv', 'hu').names.en).toBe('Kyiv');
    expect(firstCity('America/Nowhere_At_All', 'hu').names.en).toBe('Budapest');
    expect(firstCity(undefined, 'uk').names.en).toBe('Kyiv');
    expect(firstCity(undefined, 'xx')).toBeDefined();
  });

  it('finds a saved city again and forgets one that is no longer in the list', () => {
    const any = CITIES[3] as (typeof CITIES)[number];
    expect(cityById(any.id)).toBe(any);
    expect(cityById('Q0')).toBeUndefined();
    expect(cityById(undefined)).toBeUndefined();
  });
});
