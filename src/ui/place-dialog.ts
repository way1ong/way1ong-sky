// "Place": the city the sky is shown for — chosen from a list, the phone is asked nothing.
import { CITIES, cityName, countryName, type City } from '../core/places.ts';
import { dialogCross } from './dialog-cross.ts';
import { h } from './dom.ts';
import type { Dict } from './i18n.ts';

export function createPlaceDialog(): { el: HTMLDialogElement; open(d: Dict, lang: string, current: City, choose: (city: City) => void): void } {
  const el = h('dialog', { class: 'dialog', 'aria-labelledby': 'place-title' });
  return {
    el,
    open(d, lang, current, choose) {
      const sorted = [...CITIES].sort((a, b) => cityName(a, lang).localeCompare(cityName(b, lang), lang));
      const field = h('input', { id: 'place-find', type: 'search', autocomplete: 'off', placeholder: d.sky.place.find });
      const list = h('ul', { class: 'site-list place-list' });
      const none = h('p', { class: 'fact__source', hidden: true }, d.sky.place.none);
      const fill = (): void => {
        const wanted = field.value.trim().toLocaleLowerCase(lang);
        list.replaceChildren();
        for (const city of sorted) {
          const name = cityName(city, lang);
          const country = countryName(city, lang);
          if (wanted && !name.toLocaleLowerCase(lang).includes(wanted) && !country.toLocaleLowerCase(lang).includes(wanted)) continue;
          const button = h('button', { class: 'chip chip--wide', type: 'button', 'aria-pressed': String(city.id === current.id) }, name, h('span', { class: 'place__country' }, country));
          button.addEventListener('click', () => {
            el.close();
            choose(city);
          });
          list.append(h('li', {}, button));
        }
        none.hidden = list.childElementCount > 0;
      };
      field.addEventListener('input', fill);
      fill();
      const close = h('button', { class: 'btn', type: 'button' }, d.card.close);
      close.addEventListener('click', () => el.close());
      el.replaceChildren(
        dialogCross(el, d.actions.close),
        h(
          'div',
          { class: 'dialog__body' },
          h('h2', { id: 'place-title' }, d.sky.place.title),
          h('p', { class: 'fact__source' }, d.sky.place.intro),
          h('div', { class: 'field' }, h('label', { for: 'place-find' }, d.sky.place.findLabel), field),
          list,
          none,
          h('div', { class: 'dialog__actions' }, close),
        ),
      );
      if (!el.open) el.showModal();
      el.scrollTop = 0;
    },
  };
}
