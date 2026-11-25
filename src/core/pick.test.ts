import { describe, expect, it } from 'vitest';
import { SKY } from '../config.ts';
import uk from '../i18n/uk.json';
import { project, type Frame, type Look } from './dome.ts';
import { brightnessWord, faintestShown, pickAt, pickedInSky, skyInfo, type Picked } from './pick.ts';
import { CITIES } from './places.ts';
import { SKY_BODY_IDS, altAz, bodyInSky, skyTurn, toSky } from './sky.ts';
import { STARS, starName } from './stars.ts';

const budapest = CITIES.find((city) => city.names.en === 'Budapest') as (typeof CITIES)[number];
// The night of the owner's question: Mars and Jupiter side by side, high in the south.
const turn = skyTurn(budapest, new Date('2026-11-27T02:49:00Z'));
const frame: Frame = { cx: 180, cy: 320, half: 180 };
const lookAt = (what: Picked, fov: number = SKY.dome.fov.first): Look => {
  const { altitude, azimuth } = altAz(pickedInSky(what, turn));
  return { azimuth, altitude, fov };
};
const onScreen = (what: Picked, look: Look) => project(look, frame, pickedInSky(what, turn)) as { x: number; y: number };

describe('a touch on the sky map', () => {
  it('finds each of two planets standing side by side', () => {
    const look = lookAt({ kind: 'body', id: 'mars' });
    for (const id of ['mars', 'jupiter'] as const) {
      const p = onScreen({ kind: 'body', id }, look);
      expect(pickAt(p.x, p.y, look, frame, turn)).toEqual({ kind: 'body', id });
    }
  });

  it('finds every bright star over the horizon where it is drawn, and a body before the stars round it', () => {
    let checked = 0;
    for (let index = 0; index < 60; index++) {
      const what: Picked = { kind: 'star', index };
      if (pickedInSky(what, turn)[2] < 0.1) continue;
      const look = lookAt(what);
      const p = onScreen(what, look);
      const found = pickAt(p.x, p.y, look, frame, turn);
      // a planet may stand right by a star: then the planet is what the finger gets
      if (found?.kind === 'body') continue;
      expect(found, `star ${index}`).toEqual(what);
      checked++;
    }
    expect(checked).toBeGreaterThan(20);
  });

  it('does not find a star under the horizon, nor one too faint to be drawn in a wide view', () => {
    const under = STARS.findIndex((star) => toSky(turn, star.at)[2] < -0.3);
    const look: Look = { ...lookAt({ kind: 'star', index: under }), fov: SKY.dome.fov.most };
    const p = onScreen({ kind: 'star', index: under }, look);
    expect(pickAt(p.x, p.y, look, frame, turn)).not.toEqual({ kind: 'star', index: under });
    for (let index = STARS.length - 1; index > STARS.length - 400; index--) {
      const what: Picked = { kind: 'star', index };
      if (pickedInSky(what, turn)[2] < 0.2) continue;
      const wide: Look = { ...lookAt(what), fov: SKY.dome.fov.most };
      const q = onScreen(what, wide);
      expect(pickAt(q.x, q.y, wide, frame, turn)).not.toEqual(what);
      break;
    }
  });

  it('finds nothing far from every star and body', () => {
    // far outside the dome of the sky on the screen: nothing is drawn there
    expect(pickAt(-5000, -5000, lookAt({ kind: 'body', id: 'mars' }), frame, turn)).toBeNull();
  });

  it('draws fewer faint stars the wider the view', () => {
    expect(faintestShown(SKY.dome.fov.most)).toBe(SKY.paint.faintest.wide);
    expect(faintestShown(SKY.dome.fov.least)).toBe(SKY.paint.faintest.narrow);
  });
});

describe('what the map tells about a star or a body', () => {
  const names = uk.sky.constellations as Record<string, string>;

  it('every star stands in a constellation the dictionaries can name', () => {
    for (let index = 0; index < STARS.length; index += 7) expect(names[skyInfo({ kind: 'star', index }, turn).constellation], `star ${index}`).toBeTruthy();
  });

  it('Sirius is a very bright star of the Greater Dog', () => {
    const sirius = STARS.findIndex((_, index) => starName(index, 'en') === 'Sirius');
    const info = skyInfo({ kind: 'star', index: sirius }, turn);
    expect(info.constellation).toBe('CMa');
    expect(info.brightness).toBe('veryBright');
    expect(info.rise).toBeNull();
    expect(info.moon).toBeNull();
  });

  it('a body has its constellation, its place now and its next rising and setting', () => {
    for (const id of SKY_BODY_IDS) {
      const info = skyInfo({ kind: 'body', id }, turn);
      expect(names[info.constellation], id).toBeTruthy();
      expect(info.altitude).toBeCloseTo(altAz(bodyInSky(id, turn)).altitude, 6);
      expect(info.rise && info.set, id).toBeTruthy();
    }
    // side by side in the sky — in one constellation or in two that touch; here the engine puts both in one
    expect(skyInfo({ kind: 'body', id: 'mars' }, turn).constellation).toBe(skyInfo({ kind: 'body', id: 'jupiter' }, turn).constellation);
  });

  it('says a brightness in words only where a word helps', () => {
    expect(skyInfo({ kind: 'body', id: 'sun' }, turn).magnitude).toBeNull();
    expect(skyInfo({ kind: 'body', id: 'moon' }, turn).moon?.lit).toBeGreaterThan(0);
    const neptune = skyInfo({ kind: 'body', id: 'neptune' }, turn);
    expect(neptune.tooFaint).toBe(true);
    expect(neptune.brightness).toBeNull();
    expect(skyInfo({ kind: 'body', id: 'jupiter' }, turn).brightness).toBe('veryBright');
    expect([-1, 2, 4, 6].map(brightnessWord)).toEqual(['veryBright', 'bright', 'medium', 'faint']);
  });
});
