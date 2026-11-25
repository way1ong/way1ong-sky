// The card of a galaxy, a nebula or a star cluster: a photograph with whose it is, what the object is (after
// NASA's page of it, linked under the card), how far and how bright, what it takes to see it, and what the
// program itself works out — the month of its best evenings at the place and where it stands now.
import { SKY } from '../config.ts';
import { DEEP_SOURCE, deepBestEvening, deepNow, deepOverPlace, type DeepObject } from '../core/deep-sky.ts';
import type { Place, SkyTurn } from '../core/sky.ts';
import { deepPhotoUrl } from './deep-photo.ts';
import { deepDistance, deepName } from './deep-text.ts';
import { h } from './dom.ts';
import { fmt, num, type Dict } from './i18n.ts';

const link = (url: string, text: string) => h('a', { href: url, rel: 'noopener' }, text);

export function createDeepSkyDialog(): {
  el: HTMLDialogElement;
  /** `constellation` — opens the card of the constellation the object lies in. */
  open(d: Dict, lang: string, o: DeepObject, place: Place, turn: SkyTurn, constellation: () => void): void;
} {
  const el = h('dialog', { class: 'dialog', 'aria-labelledby': 'deep-title' });
  return {
    el,
    open(d, lang, o, place, turn, constellation) {
      const t = d.sky.deep;
      const name = deepName(d, o);
      const inName = (d.sky.constellations as Record<string, string>)[o.constellation] ?? o.constellation;
      const row = (label: string, value: string, more = '') => h('div', { class: 'fact' }, h('dt', {}, label), h('dd', {}, h('span', { class: 'fact__value' }, value), more ? h('span', { class: 'fact__more' }, more) : null));
      const list = h('dl', { class: 'facts' });
      list.append(row(t.rows.constellation, inName));
      list.append(row(t.rows.distance, deepDistance(d, lang, o.lightYears)));
      list.append(row(t.rows.brightness, fmt(t.magnitude, { mag: num(lang, o.mag, 1) }), t.views[o.view]));
      const over = deepOverPlace(o, place);
      if (over.stays === 'never') {
        list.append(row(d.sky.story.rows.evening, d.sky.story.never));
      } else {
        const month = new Intl.DateTimeFormat(lang, { month: 'long' }).format(deepBestEvening(o, place, turn.date));
        const more = over.stays === 'always' ? d.sky.story.always : over.highest < SKY.story.lowDeg ? fmt(d.sky.story.low, { altitude: num(lang, over.highest) }) : '';
        list.append(row(d.sky.story.rows.evening, month, more));
        const now = deepNow(o, turn);
        list.append(row(d.sky.pick.now, now.altitude >= 0 ? fmt(d.sky.pick.up, { altitude: num(lang, now.altitude), direction: d.sky.tonight.directions[now.compass] }) : d.sky.pick.under));
      }

      const close = h('button', { class: 'btn', type: 'button' }, d.card.close);
      close.addEventListener('click', () => el.close());
      const toConstellation = h('button', { class: 'chip', type: 'button', 'aria-label': fmt(d.sky.story.open, { name: inName }) }, d.sky.story.button);
      toConstellation.addEventListener('click', () => {
        el.close();
        constellation();
      });

      const body = h('div', { class: 'dialog__body' }, h('h2', { id: 'deep-title' }, name), h('p', { class: 'fact__source' }, t.kinds[o.kind]));
      const picture = o.photo ? deepPhotoUrl(o.id) : undefined;
      // What the photograph shows, where the common words ("only a part") would mislead.
      const shows = (t.photo.shows as Record<string, string>)[o.id];
      if (o.photo && picture) {
        body.append(
          h(
            'figure',
            { class: 'photo photo--wide' },
            h('img', { src: picture, alt: fmt(t.photo.alt, { name }), width: String(o.photo.width), height: String(o.photo.height), decoding: 'async' }),
            h('figcaption', {}, shows ? `${shows} ` : o.photo.part ? `${t.photo.part} ` : '', fmt(t.photo.credit, { credit: o.photo.credit })),
          ),
        );
      }
      const about = (t.about as Record<string, string>)[o.id];
      if (about) body.append(h('p', { class: 'fact__about' }, about));
      body.append(list, h('p', { class: 'fact__source' }, fmt(t.computed, { hour: SKY.story.eveningHour })));
      body.append(h('p', { class: 'fact__source' }, t.source, ' ', link(o.page, t.links.page), ' · ', link(DEEP_SOURCE.positions.url, DEEP_SOURCE.positions.title)));
      body.append(h('div', { class: 'dialog__actions' }, toConstellation, close));
      el.replaceChildren(body);
      if (!el.open) el.showModal();
      el.scrollTop = 0;
      close.focus({ preventScroll: true });
    },
  };
}
