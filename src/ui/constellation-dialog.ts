// The card of a constellation: its story where one is written (after Wikipedia's articles, linked and
// licensed under the card), and what the program itself works out — its brightest star, the month of its
// best evenings, whether it sets at the place and where it stands at the moment shown.
import { SKY } from '../config.ts';
import { ART_SET, PLATES } from '../core/art.ts';
import { bestEvening, brightestStars, constellationOf, figureNow, overPlace } from '../core/constellations.ts';
import { deepIn } from '../core/deep-sky.ts';
import type { Place, SkyTurn } from '../core/sky.ts';
import { STARS, starName } from '../core/stars.ts';
import { ORIGINS, ORIGINS_SOURCE, STORIES, STORY_SOURCE, creditPages } from '../core/stories.ts';
import { artUrl } from './art.ts';
import { deepName } from './deep-text.ts';
import { h } from './dom.ts';
import { fmt, num, type Dict } from './i18n.ts';

const link = (url: string, text: string) => h('a', { href: url, rel: 'noopener' }, text);

export function createConstellationDialog(): {
  el: HTMLDialogElement;
  /** `deep` — opens the card of a galaxy, a nebula or a cluster that lies in the constellation. */
  open(d: Dict, lang: string, id: string, place: Place, turn: SkyTurn, deep: (id: string) => void): void;
} {
  const el = h('dialog', { class: 'dialog', 'aria-labelledby': 'constellation-title' });
  return {
    el,
    open(d, lang, id, place, turn, deep) {
      const t = d.sky.story;
      const name = (d.sky.constellations as Record<string, string>)[id] ?? id;
      const story = STORIES[id];
      const about = (t.about as Record<string, string>)[id];
      const row = (label: string, value: string, more = '') => h('div', { class: 'fact' }, h('dt', {}, label), h('dd', {}, h('span', { class: 'fact__value' }, value), more ? h('span', { class: 'fact__more' }, more) : null));
      const list = h('dl', { class: 'facts' });

      const stars = brightestStars(id);
      if (stars.length > 0) {
        const told = stars.map((i) => fmt(t.star, { name: starName(i, lang) ?? t.unnamed, mag: num(lang, (STARS[i] as (typeof STARS)[number]).mag, 1) }));
        list.append(row(stars.length > 1 ? t.rows.brightestMany : t.rows.brightest, told.join(t.and), stars.length > 1 ? t.asBright : ''));
      }
      const over = overPlace(id, place);
      if (over.stays === 'never') {
        list.append(row(t.rows.evening, t.never));
      } else {
        const month = new Intl.DateTimeFormat(lang, { month: 'long' }).format(bestEvening(id, place, turn.date));
        const more = over.stays === 'always' ? t.always : over.highest < SKY.story.lowDeg ? fmt(t.low, { altitude: num(lang, over.highest) }) : '';
        list.append(row(t.rows.evening, month, more));
        const now = figureNow(id, turn);
        list.append(row(d.sky.pick.now, now.altitude >= 0 ? fmt(d.sky.pick.up, { altitude: num(lang, now.altitude), direction: d.sky.tonight.directions[now.compass] }) : d.sky.pick.under));
      }

      const close = h('button', { class: 'btn', type: 'button' }, d.card.close);
      close.addEventListener('click', () => el.close());
      const body = h('div', { class: 'dialog__body' }, h('h2', { id: 'constellation-title' }, name), h('p', { class: 'fact__source' }, t.kind));
      // An old drawing of the figure, where the program has one: with who drew it and whose scan it is.
      const plate = PLATES[id];
      const picture = plate ? artUrl(id) : undefined;
      if (plate && picture) {
        const a = t.art;
        const credit = [fmt(a.by, { artist: ART_SET.artist, title: ART_SET.title, year: ART_SET.year }), plate.restored ? fmt(a.restored, { name: ART_SET.restorer }) : '', a.holders[plate.holder]].filter(Boolean).join('; ');
        body.append(
          h(
            'figure',
            { class: 'photo photo--art' },
            h('img', { src: picture, alt: fmt(a.alt, { name }), width: String(plate.width), height: String(plate.height), decoding: 'async' }),
            h('figcaption', {}, plate.part ? `${a.part} ` : '', `${credit}. `, link(plate.page, a.link), ` ${a.note}`),
          ),
        );
      }
      if (story && about) body.append(h('p', { class: 'fact__about' }, about));
      // Who put it on the list: known for every constellation, with or without a story.
      const origin = ORIGINS[id];
      if (origin) body.append(h('p', { class: 'fact__about' }, `${fmt(t.listed[origin.by], { year: origin.year ?? '' })} ${t.iau}`));
      // What else lies within its borders: each opens its own card.
      const here = deepIn(constellationOf(id));
      if (here.length > 0) {
        const chips = h('ul', { class: 'chips' });
        for (const o of here) {
          const name = deepName(d, o);
          const chip = h('button', { class: 'chip', type: 'button', 'aria-label': fmt(d.sky.deep.open, { name }) }, name);
          chip.addEventListener('click', () => {
            el.close();
            deep(o.id);
          });
          chips.append(h('li', {}, chip));
        }
        body.append(h('section', { class: 'site-section', 'aria-labelledby': 'constellation-deep' }, h('h3', { id: 'constellation-deep' }, d.sky.deep.here), chips));
      }
      body.append(list, h('p', { class: 'fact__source' }, t.area), h('p', { class: 'fact__source' }, fmt(t.computed, { hour: SKY.story.eveningHour })));
      // What is written after Wikipedia stands with its articles and their licence: the story after the
      // constellation's articles, the line about who listed it after the table of the 88.
      const credit = h('p', { class: 'fact__source' }, story && about ? t.source : t.sourceListed, ' ');
      if (story && about) creditPages(story, lang).forEach(({ lang: key, page }) => credit.append(link(page.url, t.pages[key]), ' · '));
      credit.append(link(ORIGINS_SOURCE.url, t.pages.list), ' ', t.licence, ' ', link(STORY_SOURCE.licenceUrl, STORY_SOURCE.licence));
      body.append(credit);
      body.append(h('div', { class: 'dialog__actions' }, close));
      el.replaceChildren(body);
      if (!el.open) el.showModal();
      el.scrollTop = 0;
      close.focus({ preventScroll: true });
    },
  };
}
