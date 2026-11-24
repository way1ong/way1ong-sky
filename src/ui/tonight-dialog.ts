// "Tonight in the sky": when it gets dark, how the Moon looks, which planets are in view, when and where —
// worked out for the chosen place; a planet can be shown in the sky at its best moment.
import type { City } from '../core/places.ts';
import { cityName } from '../core/places.ts';
import { compassPoint, tonight, type PlanetTonight } from '../core/tonight.ts';
import { h } from './dom.ts';
import { fmt, num, type Dict } from './i18n.ts';

export function createTonightDialog(): { el: HTMLDialogElement; open(d: Dict, lang: string, place: City, now: Date, show: (planet: PlanetTonight) => void): void } {
  const el = h('dialog', { class: 'dialog', 'aria-labelledby': 'tonight-title' });
  return {
    el,
    open(d, lang, place, now, show) {
      const t = d.sky.tonight;
      const night = tonight(place, now);
      const time = (at: Date) => new Intl.DateTimeFormat(lang, { hour: 'numeric', minute: '2-digit' }).format(at);
      const range = (from: Date, to: Date) => fmt(t.range, { from: time(from), to: time(to) });
      const row = (label: string, value: string, more?: string) => h('div', { class: 'fact' }, h('dt', {}, label), h('dd', {}, h('span', { class: 'fact__value' }, value), more ? h('span', { class: 'fact__more' }, more) : null));

      const sun = h('dl', { class: 'facts' });
      sun.append(row(t.sunset, night.sunset ? time(night.sunset) : t.noSunset), row(t.sunrise, night.sunrise ? time(night.sunrise) : t.noSunrise), row(t.dark, night.dark ? range(night.dark.from, night.dark.to) : t.darkNever));

      const moonMore = [fmt(t.moonLit, { percent: num(lang, night.moon.lit * 100) }), night.moon.rise ? fmt(t.moonRise, { time: time(night.moon.rise) }) : '', night.moon.set ? fmt(t.moonSet, { time: time(night.moon.set) }) : ''].filter(Boolean).join(' · ');
      const moon = h('dl', { class: 'facts' }, row(t.moon, t.phases[night.moon.phase], moonMore));

      const planets = h('ul', { class: 'site-list' });
      for (const planet of night.planets) {
        const name = d.bodies[planet.id];
        const seen = planet.seen;
        const line = !planet.forTheEye ? t.faint : seen ? fmt(t.seen, { from: time(seen.from), to: time(seen.to) }) : t.notSeen;
        const best = seen && planet.forTheEye ? fmt(t.best, { time: time(seen.best), altitude: num(lang, seen.altitude), direction: t.directions[compassPoint(seen.azimuth)] }) : '';
        const text = [h('span', { class: 'planet__name' }, name), h('span', { class: 'place__country' }, line), best ? h('span', { class: 'place__country' }, best) : null];
        if (seen) {
          // The button's own words name it: the planet, when it is in view and where to look.
          const button = h('button', { class: 'chip chip--wide', type: 'button', title: fmt(t.show, { name }) }, ...text);
          button.addEventListener('click', () => {
            el.close();
            show(planet);
          });
          planets.append(h('li', {}, button));
        } else {
          planets.append(h('li', { class: 'planet--away' }, ...text));
        }
      }

      const close = h('button', { class: 'btn', type: 'button' }, d.card.close);
      close.addEventListener('click', () => el.close());
      el.replaceChildren(
        h(
          'div',
          { class: 'dialog__body' },
          h('h2', { id: 'tonight-title' }, t.title),
          h('p', { class: 'fact__source' }, fmt(t.place, { place: cityName(place, lang) })),
          sun,
          moon,
          h('section', { class: 'site-section', 'aria-labelledby': 'planets-title' }, h('h3', { id: 'planets-title' }, t.planets), planets),
          h('div', { class: 'dialog__actions' }, close),
        ),
      );
      if (!el.open) el.showModal();
      el.scrollTop = 0;
      close.focus({ preventScroll: true });
    },
  };
}
