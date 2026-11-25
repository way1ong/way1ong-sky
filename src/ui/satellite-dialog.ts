// The card of a moon of Jupiter: a few sentences about it, its numbers from NASA's fact sheet, and where the
// map of its surface comes from.
import type { SatelliteId } from '../core/bodies.ts';
import { JUPITER_MOONS, JUPITER_MOONS_SOURCE } from '../core/jupiter-moons.ts';
import { SATELLITE_PAGES } from '../core/satellites.ts';
import { h } from './dom.ts';
import { fmt, num, plural, type Dict } from './i18n.ts';

const link = (url: string, text: string) => h('a', { href: url, rel: 'noopener' }, text);

export function createSatelliteDialog(): { el: HTMLDialogElement; open(d: Dict, lang: string, id: SatelliteId): void } {
  const el = h('dialog', { class: 'dialog', 'aria-labelledby': 'satellite-title' });
  return {
    el,
    open(d, lang, id) {
      const t = d.moonCard;
      const u = d.card.units;
      const facts = JUPITER_MOONS[id];
      const row = (label: string, value: string, more = '') => h('div', { class: 'fact' }, h('dt', {}, label), h('dd', {}, h('span', { class: 'fact__value' }, value), more ? h('span', { class: 'fact__more' }, more) : null));
      const list = h('dl', { class: 'facts' });
      list.append(
        row(t.rows.diameter, fmt(u.km, { n: num(lang, facts.radiusKm * 2) })),
        // The fact sheet gives the mass in 10^20 kg; the cards of the planets write masses in 10^24 kg.
        row(t.rows.mass, fmt(u.mass, { n: num(lang, facts.massE20kg / 1e4, 4) })),
        row(t.rows.density, fmt(t.density, { n: num(lang, facts.densityKgM3) })),
        row(t.rows.distance, fmt(u.km, { n: num(lang, facts.semiMajorAxisThousandKm * 1000) })),
        row(t.rows.period, plural(lang, Number(facts.periodDays.toFixed(1)), d.card.earthDays, num(lang, facts.periodDays, 1)), t.sameSide),
      );
      const close = h('button', { class: 'btn', type: 'button' }, d.card.close);
      close.addEventListener('click', () => el.close());
      const updated = new Date(`${JUPITER_MOONS_SOURCE.updated} UTC`);
      const day = Number.isNaN(updated.getTime()) ? JUPITER_MOONS_SOURCE.updated : new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(updated);
      el.replaceChildren(
        h(
          'div',
          { class: 'dialog__body' },
          h('h2', { id: 'satellite-title' }, d.satellites[id]),
          h('p', { class: 'fact__source' }, t.kind),
          h('p', { class: 'fact__about' }, t.about[id]),
          list,
          h('p', { class: 'fact__source' }, fmt(t.source, { updated: day })),
          h('p', { class: 'fact__source' }, t.map),
          h('p', { class: 'fact__source' }, link(JUPITER_MOONS_SOURCE.url, t.sourceLink), ' · ', link(SATELLITE_PAGES[id], d.card.aboutSource), ' · ', link(SATELLITE_PAGES.maps, t.mapLink)),
          h('div', { class: 'dialog__actions' }, close),
        ),
      );
      if (!el.open) el.showModal();
      el.scrollTop = 0;
      close.focus({ preventScroll: true });
    },
  };
}
