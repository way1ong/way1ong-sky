// A landing place: a photo taken there, when the flight was, who went, what NASA's tables say of the stay —
// and where all of that comes from.
import { SITE_SOURCES, SITES, type SiteId } from '../core/sites.ts';
import { dialogCross } from './dialog-cross.ts';
import { h } from './dom.ts';
import { fmt, type Dict } from './i18n.ts';
import { sitePhotoUrl } from './site-photos.ts';
import { missionName, siteRows } from './site-text.ts';

const link = (url: string, text: string) => h('a', { href: url, rel: 'noopener' }, text);

export function createSiteDialog(): { el: HTMLDialogElement; open(d: Dict, lang: string, id: SiteId, showMoment: (id: SiteId) => void): void } {
  const el = h('dialog', { class: 'dialog', 'aria-labelledby': 'site-title' });
  return {
    el,
    open(d, lang, id, showMoment) {
      const site = SITES[id];
      const name = missionName(d, id);
      const picture = h(
        'figure',
        { class: 'photo' },
        h('img', { src: sitePhotoUrl(id), alt: fmt(d.card.photoAlt, { name }), width: '640', height: '640', decoding: 'async' }),
        h('figcaption', {}, d.sites.photo[id], ' ', link(site.photo.page, fmt(d.card.photoBy, { credit: site.photo.credit }))),
      );
      const list = h('dl', { class: 'facts' });
      for (const row of siteRows(d, lang, id)) {
        list.append(h('div', { class: 'fact' }, h('dt', {}, row.label), h('dd', {}, ...row.value.map((text) => h('span', { class: 'fact__value' }, text)), row.more ? h('span', { class: 'fact__more' }, row.more) : null)));
      }
      const close = h('button', { class: 'btn', type: 'button' }, d.card.close);
      close.addEventListener('click', () => el.close());
      // The clock goes to the minute of the landing and the Moon turns the place to the viewer.
      const moment = h('button', { class: 'chip', type: 'button', 'aria-label': fmt(d.sites.moment.showLabel, { name }) }, d.sites.moment.show);
      moment.addEventListener('click', () => {
        el.close();
        showMoment(id);
      });
      el.replaceChildren(
        dialogCross(el, d.actions.close),
        h(
          'div',
          { class: 'dialog__body' },
          h('h2', { id: 'site-title' }, name),
          picture,
          list,
          h('p', { class: 'fact__source' }, d.sites.note),
          h(
            'p',
            { class: 'fact__source' },
            d.sites.source,
            ' ',
            link(site.page, d.sites.missionLink),
            ' · ',
            link(SITE_SOURCES.landings.url, d.sites.landingsLink),
            ' · ',
            link(SITE_SOURCES.coordinates.url, d.sites.coordinatesLink),
          ),
          h('div', { class: 'dialog__actions' }, moment, close),
        ),
      );
      if (!el.open) el.showModal();
      el.scrollTop = 0;
      close.focus({ preventScroll: true });
    },
  };
}
