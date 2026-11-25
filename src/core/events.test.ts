import { AngleFromSun, Body, SearchGlobalSolarEclipse } from 'astronomy-engine';
import { describe, expect, it } from 'vitest';
import { SKY } from '../config.ts';
import { eventsAfter, type SkyEvent } from './events.ts';
import { CITIES } from './places.ts';
import { altAz, bodyInSky, skyTurn } from './sky.ts';

const budapest = CITIES.find((city) => city.names.en === 'Budapest') as (typeof CITIES)[number];
const from = new Date('2026-11-01T00:00:00Z');
const year = eventsAfter(budapest, from);
const of = <K extends SkyEvent['kind']>(kind: K) => year.filter((event): event is Extract<SkyEvent, { kind: K }> => event.kind === kind);
const ENGINE = { mercury: Body.Mercury, venus: Body.Venus, mars: Body.Mars, jupiter: Body.Jupiter, saturn: Body.Saturn };

describe('the events of a year', () => {
  it('come in order, all within the year asked for', () => {
    expect(year.length).toBeGreaterThan(8);
    const until = from.getTime() + SKY.events.days * 86_400_000;
    for (let i = 0; i < year.length; i++) {
      const event = year[i] as SkyEvent;
      const at = event.at.getTime();
      // only a meeting that still goes on may have its nearest moment behind
      if (!(event.kind === 'meeting' && event.ongoing)) expect(at).toBeGreaterThanOrEqual(from.getTime());
      expect(at).toBeLessThanOrEqual(until);
      if (i > 0) expect(at).toBeGreaterThanOrEqual((year[i - 1] as SkyEvent).at.getTime());
    }
  });

  it('finds Mars and Jupiter side by side at the end of November 2026, as the sky map showed them', () => {
    const meeting = of('meeting').find((event) => event.bodies.join() === 'mars,jupiter');
    expect(meeting).toBeDefined();
    if (!meeting) return;
    // On 27 November the map had them 4.1° apart; at their nearest they are no farther than that.
    expect(meeting.apart).toBeLessThanOrEqual(4.1);
    expect(Math.abs(meeting.at.getTime() - Date.UTC(2026, 10, 27)) / 86_400_000).toBeLessThan(30);
    // High in the night sky of Budapest: there is a moment to show.
    expect(meeting.view).not.toBeNull();
  });

  it('keeps a meeting in the list after its nearest moment, while the two are still close', () => {
    // the night of the owner's question: Mars and Jupiter 4.1° apart
    const asked = new Date('2026-11-27T02:49:00Z');
    const still = eventsAfter(budapest, asked).find((event) => event.kind === 'meeting' && event.bodies.join() === 'mars,jupiter' && event.at < asked);
    expect(still && still.kind === 'meeting' && still.ongoing).toBe(true);
    if (still?.kind !== 'meeting') return;
    expect(still.apart).toBeCloseTo(4.1, 1);
    // what to show is ahead of the moment asked at and within a day of it — not a night already over
    const shown = still.view?.at.getTime() ?? 0;
    expect(shown).toBeGreaterThanOrEqual(asked.getTime());
    expect(shown - asked.getTime()).toBeLessThan(86_400_000);
    // asked in the morning twilight, when that night's dark is over, it shows the night to come
    for (const hour of [5, 6, 7, 12, 20]) {
      const at = new Date(Date.UTC(2026, 10, 25, hour));
      const then = eventsAfter(budapest, at).find((event) => event.kind === 'meeting' && event.ongoing);
      expect(then?.view, `asked at ${hour} UT`).toBeTruthy();
      expect(then?.view?.at.getTime() ?? 0, `asked at ${hour} UT`).toBeGreaterThanOrEqual(at.getTime());
    }
    // long after, the two have parted and the meeting is gone from the list
    const later = eventsAfter(budapest, new Date(asked.getTime() + 60 * 86_400_000));
    expect(later.some((event) => event.kind === 'meeting' && event.at.getTime() === still.at.getTime())).toBe(false);
  });

  it('counts two planets as meeting only when near enough and clear of the Sun', () => {
    for (const event of of('meeting')) {
      expect(event.apart).toBeLessThan(SKY.events.closeDeg);
      for (const body of event.bodies) expect(AngleFromSun(ENGINE[body], event.at)).toBeGreaterThanOrEqual(SKY.events.sunClearDeg);
    }
  });

  it('has the four turns of the year, a quarter of a year apart', () => {
    const turns = of('season');
    expect(turns.map((event) => event.season).sort()).toEqual(['decemberSolstice', 'juneSolstice', 'marchEquinox', 'septemberEquinox']);
    for (let i = 1; i < turns.length; i++) {
      const days = ((turns[i] as SkyEvent).at.getTime() - (turns[i - 1] as SkyEvent).at.getTime()) / 86_400_000;
      expect(days).toBeGreaterThan(85);
      expect(days).toBeLessThan(97);
    }
  });

  it('at an opposition the planet stands opposite the Sun; at an elongation as far from it as the event says', () => {
    for (const event of of('opposition')) expect(AngleFromSun(ENGINE[event.body], event.at)).toBeGreaterThan(170);
    const far = of('elongation');
    expect(far.some((event) => event.body === 'mercury')).toBe(true);
    for (const event of far) {
      expect(AngleFromSun(ENGINE[event.body], event.at)).toBeCloseTo(event.apart, 3);
      // a day earlier and a day later the planet is nearer to the Sun
      for (const shift of [-2, 2]) expect(AngleFromSun(ENGINE[event.body], new Date(event.at.getTime() + shift * 86_400_000))).toBeLessThan(event.apart);
    }
  });

  it('says an event can be seen only with the body over the horizon — and planets only in the dark, high enough', () => {
    for (const event of year) {
      if (!event.view) continue;
      expect(event.view.altitude).toBeGreaterThan(0);
      if (event.kind === 'meeting' || event.kind === 'opposition' || event.kind === 'elongation') {
        const turn = skyTurn(budapest, event.view.at);
        expect(altAz(bodyInSky('sun', turn)).altitude).toBeLessThanOrEqual(SKY.tonight.darkSunAltitude + 0.5);
        expect(event.view.altitude).toBeGreaterThanOrEqual(SKY.tonight.leastAltitude);
        // the moment to show is within a day of the event itself
        expect(Math.abs(event.view.at.getTime() - event.at.getTime())).toBeLessThan(1.5 * 86_400_000);
      }
    }
    // a turn of the year is a moment of the calendar: nothing to show
    for (const event of of('season')) expect(event.view).toBeNull();
    for (const event of of('lunarEclipse')) expect(event.view !== null).toBe(altAz(bodyInSky('moon', skyTurn(budapest, event.at))).altitude > 0);
  });

  it('a solar eclipse of the place is one of the world: the engine finds it by another search too', () => {
    // look over ten years, so that the list is not empty
    const decade = eventsAfter(budapest, from, 3650).filter((event) => event.kind === 'solarEclipse');
    expect(decade.length).toBeGreaterThan(0);
    for (const event of decade) {
      const world = SearchGlobalSolarEclipse(new Date(event.at.getTime() - 2 * 86_400_000));
      expect(Math.abs(world.peak.date.getTime() - event.at.getTime())).toBeLessThan(86_400_000 / 4);
      if (event.kind === 'solarEclipse') {
        expect(event.covered).toBeGreaterThan(0);
        expect(event.covered).toBeLessThanOrEqual(1);
      }
    }
  });
});

it('prints the year (for the eye, not a check)', () => {
  const t0 = performance.now();
  const list = eventsAfter(budapest, new Date('2026-11-25T06:00:00Z'));
  const ms = performance.now() - t0;
  const lines = list.map((e) => `${e.at.toISOString().slice(0, 16)} ${e.kind} ${JSON.stringify({ ...e, at: undefined, kind: undefined, view: e.view ? `${e.view.at.toISOString().slice(5, 16)} alt ${Math.round(e.view.altitude)} az ${Math.round(e.view.azimuth)}` : null })}`);
  console.log(`${Math.round(ms)} ms\n${lines.join('\n')}`);
});
