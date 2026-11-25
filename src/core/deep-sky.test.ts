import { readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SKY } from '../config.ts';
import en from '../i18n/en.json';
import hu from '../i18n/hu.json';
import uk from '../i18n/uk.json';
import { DEEP, DEEP_KINDS, DEEP_VIEWS, deepAt, deepBestEvening, deepById, deepIn, deepNamed, deepNow, deepOverPlace, messierName } from './deep-sky.ts';
import { project, type Frame, type Look } from './dome.ts';
import { altAz, skyTurn, toSky } from './sky.ts';
import { STARS } from './stars.ts';
import { length } from './vec.ts';

const DICTIONARIES = { en, hu, uk } as const;
const budapest = { lat: 47.4979, lon: 19.0402 };
const sydney = { lat: -33.8688, lon: 151.2093 };
const frame: Frame = { cx: 200, cy: 300, half: 200 };

describe('the objects of the file', () => {
  it('each has what its card and its mark need', () => {
    expect(DEEP.length).toBeGreaterThan(0);
    const ids = new Set<string>();
    for (const o of DEEP) {
      expect(o.id).toBe(`m${o.messier}`);
      expect(ids.has(o.id)).toBe(false);
      ids.add(o.id);
      expect(DEEP_KINDS).toContain(o.kind);
      expect(DEEP_VIEWS).toContain(o.view);
      expect(o.ra).toBeGreaterThanOrEqual(0);
      expect(o.ra).toBeLessThan(360);
      expect(Math.abs(o.dec)).toBeLessThanOrEqual(90);
      expect(o.lightYears).toBeGreaterThan(0);
      expect(length(o.at)).toBeCloseTo(1, 9);
      expect(o.constellation).toMatch(/^[A-Z][A-Za-z]{2}$/);
      expect(o.page).toContain(`/messier-${o.messier}/`);
    }
  });

  it('are listed brightest first', () => {
    for (let i = 1; i < DEEP.length; i++) expect((DEEP[i] as (typeof DEEP)[number]).mag).toBeGreaterThanOrEqual((DEEP[i - 1] as (typeof DEEP)[number]).mag);
  });

  it('a photograph, where there is one, names whose it is', () => {
    for (const o of DEEP) {
      if (!o.photo) continue;
      expect(o.photo.credit.trim()).not.toBe('');
      expect(o.photo.width).toBeGreaterThan(0);
      expect(o.photo.height).toBeGreaterThan(0);
    }
  });

  it('is called by its number in the catalogue', () => {
    expect(messierName(deepById('m31') as (typeof DEEP)[number])).toBe('M31');
    expect(deepById('m999')).toBeUndefined();
  });
});

describe('where the objects are', () => {
  it('each lies in the constellation NASA names: the borders and the positions agree', () => {
    // NASA's fact boxes, read 25.11.2026 — a few of them, from different parts of the sky.
    const told: Record<string, string> = { m31: 'And', m42: 'Ori', m45: 'Tau', m13: 'Her', m44: 'Cnc', m57: 'Lyr', m8: 'Sgr', m104: 'Vir', m81: 'UMa', m1: 'Tau', m7: 'Sco' };
    for (const [id, constellation] of Object.entries(told)) expect(deepById(id)?.constellation, id).toBe(constellation);
  });

  it('the Pleiades stand where their brightest star stands, the Orion Nebula under the belt of Orion', () => {
    const near = (id: string, ra: number, dec: number, within: number) => {
      const o = deepById(id) as (typeof DEEP)[number];
      const star = STARS.find((s) => Math.abs(s.ra - ra) < 0.2 && Math.abs(s.dec - dec) < 0.2);
      expect(star, `a star near ${ra}, ${dec}`).toBeDefined();
      const cos = o.at[0] * (star as (typeof STARS)[number]).at[0] + o.at[1] * (star as (typeof STARS)[number]).at[1] + o.at[2] * (star as (typeof STARS)[number]).at[2];
      expect(Math.acos(Math.min(1, cos)) * (180 / Math.PI), id).toBeLessThan(within);
    };
    // Alcyone and Alnilam as the file of stars holds them.
    near('m45', 56.87, 24.11, 0.5);
    near('m42', 84.05, -1.2, 5);
  });

  it('are found by the constellation they lie in', () => {
    expect(deepIn('Ori').map((o) => o.id)).toContain('m42');
    expect(deepIn('Tau').map((o) => o.id)).toEqual(['m45', 'm1']);
    expect(deepIn('Cru')).toEqual([]);
  });
});

describe('an object in the sky of a place', () => {
  const pleiades = deepById('m45') as (typeof DEEP)[number];
  const andromeda = deepById('m31') as (typeof DEEP)[number];
  const ptolemy = deepById('m7') as (typeof DEEP)[number];

  it('climbs as high as its declination and the latitude let it', () => {
    expect(deepOverPlace(pleiades, budapest).highest).toBeCloseTo(90 - (budapest.lat - pleiades.dec), 9);
    expect(deepOverPlace(pleiades, budapest).stays).toBe('sometimes');
    expect(deepOverPlace(ptolemy, budapest).highest).toBeLessThan(10);
  });

  it('never sets near the pole of its side of the sky, never rises far on the other side', () => {
    const bode = deepById('m81') as (typeof DEEP)[number];
    expect(deepOverPlace(bode, budapest).stays).toBe('always');
    expect(deepOverPlace(bode, sydney).stays).toBe('never');
  });

  it('stands where the sky of the moment puts it', () => {
    const turn = skyTurn(budapest, new Date('2026-11-25T21:00:00Z'));
    const seen = altAz(toSky(turn, andromeda.at));
    expect(deepNow(andromeda, turn).altitude).toBeCloseTo(seen.altitude, 9);
    // An autumn evening in Budapest: the Andromeda Galaxy is high.
    expect(seen.altitude).toBeGreaterThan(50);
  });

  it('has its best evenings when it crosses the meridian in the evening: Andromeda in autumn, Orion in winter', () => {
    const from = new Date('2026-01-01T00:00:00Z');
    expect([9, 10, 11]).toContain(deepBestEvening(andromeda, budapest, from).getUTCMonth());
    expect([0, 1]).toContain(deepBestEvening(deepById('m42') as (typeof DEEP)[number], budapest, from).getUTCMonth());
  });
});

describe('a touch on the map', () => {
  const turn = skyTurn(budapest, new Date('2026-11-25T21:00:00Z'));
  const andromeda = deepById('m31') as (typeof DEEP)[number];
  const sky = toSky(turn, andromeda.at);
  const seen = altAz(sky);
  const look: Look = { azimuth: seen.azimuth, altitude: seen.altitude, fov: 60 };

  it('on a mark names its object, a little off too, far off — nothing', () => {
    const p = project(look, frame, sky) as { x: number; y: number };
    expect(deepAt(p.x, p.y, look, frame, turn)?.id).toBe('m31');
    expect(deepAt(p.x + SKY.deep.reachPx - 1, p.y, look, frame, turn)?.id).toBe('m31');
    expect(deepAt(p.x + SKY.deep.reachPx + 40, p.y + 60, look, frame, turn)?.id).not.toBe('m31');
  });

  it('never names an object under the horizon', () => {
    for (const o of DEEP) {
      const at = toSky(turn, o.at);
      if (at[2] >= 0) continue;
      const under = altAz(at);
      const down: Look = { azimuth: under.azimuth, altitude: Math.max(-80, under.altitude), fov: 60 };
      const p = project(down, frame, at);
      if (p) expect(deepAt(p.x, p.y, down, frame, turn)?.id, o.id).not.toBe(o.id);
    }
  });
});

describe('names on the map', () => {
  it('at the widest view only the brightest are named, at the narrowest — every one', () => {
    const named = (fov: number) => DEEP.filter((o) => deepNamed(o, fov)).length;
    expect(named(SKY.dome.fov.most)).toBeGreaterThan(0);
    expect(named(SKY.dome.fov.most)).toBeLessThan(DEEP.length / 2);
    expect(named(SKY.dome.fov.least)).toBe(DEEP.length);
    expect(deepNamed(deepById('m45') as (typeof DEEP)[number], SKY.dome.fov.most)).toBe(true);
  });
});

describe('the texts of the objects', () => {
  it('every object is told about in every language, and no text is left without its object', () => {
    for (const [lang, d] of Object.entries(DICTIONARIES)) {
      const about = d.sky.deep.about as Record<string, string>;
      for (const o of DEEP) expect(about[o.id], `${o.id} ${lang}`).toBeTruthy();
      for (const id of Object.keys(about)) expect(deepById(id), `${id} ${lang}`).toBeDefined();
      for (const id of Object.keys(d.sky.deep.names)) expect(deepById(id), `${id} ${lang}`).toBeDefined();
      // A photograph's own caption is of an object that has a photograph.
      for (const id of Object.keys(d.sky.deep.photo.shows)) expect(deepById(id)?.photo, `${id} ${lang}`).toBeDefined();
    }
  });

  it('every kind and every way of seeing has its words', () => {
    for (const d of Object.values(DICTIONARIES)) {
      for (const kind of DEEP_KINDS) expect(d.sky.deep.kinds[kind]).toBeTruthy();
      for (const view of DEEP_VIEWS) expect(d.sky.deep.views[view]).toBeTruthy();
    }
  });

  it('an object with a photograph has its picture file, and no picture is left without its object', () => {
    const files = new Set(readdirSync(new URL('../deep/', import.meta.url)).filter((name) => name.endsWith('.webp')).map((name) => name.replace('.webp', '')));
    for (const o of DEEP) expect(files.has(o.id), o.id).toBe(o.photo !== undefined);
    for (const id of files) expect(deepById(id), id).toBeDefined();
  });
});
