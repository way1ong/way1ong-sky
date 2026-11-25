// A body's card: its photo, a few sentences about it, what it leads the planets in, its numbers with the Earth
// for comparison, where it is now — and where all of that comes from.
import type { BodyId } from '../core/bodies.ts';
import { DESCRIPTION_PAGES, FACT_SOURCES } from '../core/facts.ts';
import { PHOTOS } from '../core/photos.ts';
import { SITE_IDS, type SiteId } from '../core/sites.ts';
import { h } from './dom.ts';
import { cardBadges, cardRows } from './facts-text.ts';
import { fmt, type Dict } from './i18n.ts';
import { photoUrl } from './photos.ts';
import { missionName } from './site-text.ts';
import { sizeFigure } from './size-figure.ts';
import { youSection } from './you-section.ts';

const link = (url: string, text: string) => h('a', { href: url, rel: 'noopener' }, text);

/** NASA writes "13 November 2026" on its pages: the same day in the reader's language. */
function dayOf(lang: string, written: string): string {
  const at = new Date(`${written} UTC`);
  return Number.isNaN(at.getTime()) ? written : new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(at);
}

export function createFactsDialog(): { el: HTMLDialogElement; open(d: Dict, lang: string, id: BodyId, date: Date, onSite: (site: SiteId) => void): void } {
  const el = h('dialog', { class: 'dialog', 'aria-labelledby': 'facts-title' });
  return {
    el,
    open(d, lang, id, date, onSite) {
      const badges = cardBadges(d, id);
      const most = h('ul', { class: 'badges' });
      for (const text of badges) most.append(h('li', { class: 'badge' }, text));
      const list = h('dl', { class: 'facts' });
      for (const row of cardRows(d, lang, id, date)) {
        list.append(h('div', { class: 'fact' }, h('dt', {}, row.label), h('dd', {}, h('span', { class: 'fact__value' }, row.value), row.more ? h('span', { class: 'fact__more' }, row.more) : null)));
      }
      const photo = PHOTOS[id];
      const picture = h(
        'figure',
        { class: 'photo' },
        h('img', { src: photoUrl(id), alt: fmt(d.card.photoAlt, { name: d.bodies[id] }), width: '720', height: '720', decoding: 'async' }),
        h('figcaption', {}, d.card.photo[id], ' ', link(photo.page, fmt(d.card.photoBy, { credit: photo.credit }))),
      );
      // The Moon's card leads to the places where people landed: the same windows as the marks on the Moon itself.
      const places = h('ul', { class: 'site-list' });
      for (const site of SITE_IDS) {
        const button = h('button', { class: 'chip chip--wide', type: 'button' }, missionName(d, site), ' — ', d.sites.place[site]);
        button.addEventListener('click', () => {
          el.close();
          onSite(site);
        });
        places.append(h('li', {}, button));
      }
      const landings = id === 'moon' ? h('section', { class: 'site-section', 'aria-labelledby': 'sites-title' }, h('h3', { id: 'sites-title' }, d.sites.title), h('p', { class: 'fact__source' }, d.sites.intro), places) : null;
      const close = h('button', { class: 'btn', type: 'button' }, d.card.close);
      close.addEventListener('click', () => el.close());
      const shown = new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date);
      const source = id === 'sun' ? link(FACT_SOURCES.sun.url, d.card.sunLink) : link(FACT_SOURCES.planets.url, d.card.sourceLink);
      el.replaceChildren(
        h(
          'div',
          { class: 'dialog__body' },
          h('h2', { id: 'facts-title' }, d.bodies[id]),
          badges.length > 0 ? most : null,
          picture,
          h('p', { class: 'fact__about' }, d.card.about[id]),
          sizeFigure(d, lang, id),
          landings,
          list,
          youSection(d, lang, id),
          h('p', { class: 'fact__source' }, fmt(d.card.source, { updated: dayOf(lang, id === 'sun' ? FACT_SOURCES.sun.updated : FACT_SOURCES.planets.updated), date: shown })),
          h('p', { class: 'fact__source' }, source, ' · ', link(FACT_SOURCES.notes.url, d.card.notesLink), ' · ', link(DESCRIPTION_PAGES[id][0] as string, d.card.aboutSource)),
          h('div', { class: 'dialog__actions' }, close),
        ),
      );
      if (!el.open) el.showModal();
      el.scrollTop = 0;
      close.focus({ preventScroll: true });
    },
  };
}
