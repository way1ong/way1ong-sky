// The card of a constellation: its story where one is written (after Wikipedia's articles, linked and
// licensed under the card), and what the program itself works out — its brightest star, the month of its
// best evenings, whether it sets at the place and where it stands at the moment shown.
import { SKY } from '../config.ts';
import { bestEvening, brightestStars, figureNow, overPlace } from '../core/constellations.ts';
import type { Place, SkyTurn } from '../core/sky.ts';
import { STARS, starName } from '../core/stars.ts';
import { STORIES, STORY_SOURCE, creditPages } from '../core/stories.ts';
import { h } from './dom.ts';
import { fmt, num, type Dict } from './i18n.ts';

const link = (url: string, text: string) => h('a', { href: url, rel: 'noopener' }, text);

export function createConstellationDialog(): { el: HTMLDialogElement; open(d: Dict, lang: string, id: string, place: Place, turn: SkyTurn): void } {
  const el = h('dialog', { class: 'dialog', 'aria-labelledby': 'constellation-title' });
  return {
    el,
    open(d, lang, id, place, turn) {
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
      if (story && about) body.append(h('p', { class: 'fact__about' }, about), h('p', { class: 'fact__about' }, t.listed[story.listed]));
      body.append(list, h('p', { class: 'fact__source' }, fmt(t.computed, { hour: SKY.story.eveningHour })));
      if (story && about) {
        const credit = h('p', { class: 'fact__source' }, t.source, ' ');
        creditPages(story, lang).forEach(({ lang: key, page }, i) => credit.append(i > 0 ? ' · ' : '', link(page.url, t.pages[key])));
        credit.append(' ', t.licence, ' ', link(STORY_SOURCE.licenceUrl, STORY_SOURCE.licence));
        body.append(credit);
      }
      body.append(h('div', { class: 'dialog__actions' }, close));
      el.replaceChildren(body);
      if (!el.open) el.showModal();
      el.scrollTop = 0;
      close.focus({ preventScroll: true });
    },
  };
}
