// "Events of the year" as a list: for each event its day, what it is, and whether it is seen from the place
// — with a button that shows it in the sky when it is.
import type { SkyEvent } from '../core/events.ts';
import type { SkyBodyId } from '../core/sky.ts';
import { compassPoint } from '../core/tonight.ts';
import { h } from './dom.ts';
import { fmt, num, type Dict } from './i18n.ts';

/** The body the map rings when an event is shown. */
export function eventBody(event: SkyEvent): SkyBodyId {
  return event.kind === 'lunarEclipse' ? 'moon' : event.kind === 'meeting' ? event.bodies[0] : event.kind === 'opposition' || event.kind === 'elongation' ? event.body : 'sun';
}

export function eventName(d: Dict, event: SkyEvent): string {
  const t = d.sky.events;
  switch (event.kind) {
    case 'lunarEclipse':
      return t.lunar[event.type];
    case 'solarEclipse':
      return t.solar[event.type];
    case 'meeting':
      return fmt(t.meeting, { a: d.bodies[event.bodies[0]], b: d.bodies[event.bodies[1]] });
    case 'opposition':
      return fmt(t.opposition, { name: d.bodies[event.body] });
    case 'elongation':
      return fmt(t.elongation[event.side], { name: d.bodies[event.body] });
    case 'season':
      return t.seasons[event.season];
  }
}

const day = (lang: string, at: Date) => new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric' }).format(at);
const time = (lang: string, at: Date) => new Intl.DateTimeFormat(lang, { hour: 'numeric', minute: '2-digit' }).format(at);
/** A day and an hour by the device's clock. */
export const eventMoment = (d: Dict, lang: string, at: Date): string => fmt(d.sky.events.at, { date: day(lang, at), time: time(lang, at) });

function what(d: Dict, lang: string, event: SkyEvent): string {
  const t = d.sky.events;
  switch (event.kind) {
    case 'lunarEclipse':
      return t.lunarWhat;
    case 'solarEclipse':
      return fmt(t.solarWhat, { percent: num(lang, event.covered * 100) });
    case 'meeting':
      return event.ongoing ? fmt(t.meetingNow, { apart: num(lang, event.apart, 1), date: day(lang, event.at) }) : fmt(t.meetingWhat, { apart: num(lang, event.apart, 1) });
    case 'opposition':
      return t.oppositionWhat;
    case 'elongation':
      return fmt(t.elongationWhat[event.side], { apart: num(lang, event.apart) });
    case 'season':
      return t.seasonWhat[event.season];
  }
}

/** When the event is: a meeting that still goes on is "now"; a moment that matters to the minute has its hour. */
function when(d: Dict, lang: string, event: SkyEvent): string {
  if (event.kind === 'meeting' && event.ongoing) return d.sky.events.now;
  return event.kind === 'lunarEclipse' || event.kind === 'solarEclipse' || event.kind === 'season' ? eventMoment(d, lang, event.at) : day(lang, event.at);
}

function seen(d: Dict, lang: string, event: SkyEvent): string {
  const t = d.sky.events;
  if (event.view) return fmt(t.seen, { when: eventMoment(d, lang, event.view.at), altitude: num(lang, event.view.altitude), direction: d.sky.tonight.directions[compassPoint(event.view.azimuth)] });
  return event.kind === 'lunarEclipse' ? t.moonUnder : event.kind === 'season' || event.kind === 'solarEclipse' ? '' : t.notInDark;
}

export function eventsList(d: Dict, lang: string, events: readonly SkyEvent[], show: (event: SkyEvent) => void): HTMLElement {
  if (events.length === 0) return h('p', { class: 'fact__source' }, d.sky.events.empty);
  const list = h('ul', { class: 'site-list' });
  for (const event of events) {
    const name = eventName(d, event);
    const sight = seen(d, lang, event);
    const text = [
      h('span', { class: 'place__country' }, when(d, lang, event)),
      h('span', { class: 'planet__name' }, name),
      h('span', { class: 'place__country' }, what(d, lang, event)),
      sight ? h('span', { class: 'place__country' }, sight) : null,
    ];
    if (event.view) {
      const button = h('button', { class: 'chip chip--wide', type: 'button', title: fmt(d.sky.events.show, { name }) }, ...text);
      button.addEventListener('click', () => show(event));
      list.append(h('li', {}, button));
    } else {
      list.append(h('li', { class: 'planet--away' }, ...text));
    }
  }
  return list;
}
