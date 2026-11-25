// The menu: the language, the choices of the sky map, and what the app is made of — with the credits its
// sources ask for.
import { ART_SET } from '../core/art.ts';
import { SATELLITE_MAPS, SATELLITE_PAGES } from '../core/satellites.ts';
import { SKY } from '../config.ts';
import { SOURCES } from '../core/bodies.ts';
import { CITY_SOURCE } from '../core/places.ts';
import { PHOTO_LIBRARY, PHOTO_RULES } from '../core/photos.ts';
import { h } from './dom.ts';
import { flagOf } from './flags.ts';
import { install, installWay } from './install.ts';
import { LANGS, langName, type Dict } from './i18n.ts';

const TEXTURES_URL = 'https://www.solarsystemscope.com/textures/';
const LICENSE_URL = 'https://creativecommons.org/licenses/by/4.0/';
const STAR_NAMES_URL = 'https://en.wikipedia.org/wiki/List_of_proper_names_of_stars';
const BY_SA_URL = 'https://creativecommons.org/licenses/by-sa/4.0/';

const link = (url: string, text: string) => h('a', { href: url, rel: 'noopener' }, text);

/** The choices of the sky map: which are on, and how one is switched. */
export interface SkyChoices {
  figures: boolean;
  names: boolean;
  night: boolean;
  toggle(choice: 'figures' | 'names' | 'night'): void;
}

export function createMenuDialog(): { el: HTMLDialogElement; open(d: Dict, lang: string, setLang: (code: string) => void, sky: SkyChoices): void } {
  const el = h('dialog', { class: 'dialog', 'aria-labelledby': 'menu-title' });
  return {
    el,
    open(d, lang, setLang, sky) {
      // The languages as buttons, each with its flag and its own name: a list of options cannot show pictures.
      const langs = h('ul', { class: 'langs', 'aria-labelledby': 'lang-label' });
      let current: HTMLButtonElement | null = null;
      for (const code of LANGS) {
        const button = h('button', { class: 'chip lang', type: 'button', lang: code, 'aria-pressed': String(code === lang) }, flagOf(code), langName(code));
        button.addEventListener('click', () => setLang(code));
        if (code === lang) current = button;
        langs.append(h('li', {}, button));
      }
      const choices = h('ul', { class: 'site-list' });
      for (const choice of ['figures', 'names', 'night'] as const) {
        const button = h('button', { class: 'chip chip--wide', type: 'button', role: 'switch', 'aria-checked': String(sky[choice]) }, d.sky.menu[choice]);
        button.addEventListener('click', () => {
          sky.toggle(choice);
          button.setAttribute('aria-checked', String(button.getAttribute('aria-checked') !== 'true'));
        });
        choices.append(h('li', {}, button));
      }
      // Installing: the browser's own window where it has one, a short instruction on iPhone and iPad.
      const way = installWay();
      const installButton = h('button', { class: 'chip chip--wide', type: 'button' }, d.install.button);
      installButton.addEventListener('click', () => {
        installButton.hidden = true;
        void install();
      });
      const installing = way === null ? null : h('section', { class: 'site-section', 'aria-labelledby': 'install-title' }, h('h3', { id: 'install-title' }, d.install.title), h('p', { class: 'fact__source' }, way === 'ios' ? d.install.ios : d.install.text), way === 'prompt' ? installButton : null);
      const close = h('button', { class: 'btn', type: 'button' }, d.actions.close);
      close.addEventListener('click', () => el.close());
      const made = SKY.links.site ? link(SKY.links.site, d.about.madeBy) : d.about.madeBy;
      el.replaceChildren(
        h(
          'div',
          { class: 'dialog__body' },
          h('h2', { id: 'menu-title' }, d.settings.title),
          h('div', { class: 'field' }, h('p', { id: 'lang-label' }, d.settings.language), langs),
          h('section', { class: 'site-section', 'aria-labelledby': 'sky-choices' }, h('h3', { id: 'sky-choices' }, d.sky.menu.title), choices),
          installing,
          h('h2', {}, d.about.title),
          h('p', {}, d.about.text),
          h('p', {}, d.keys),
          h('h2', {}, d.about.sources),
          h(
            'ul',
            {},
            h('li', {}, d.about.textures, ' ', link(TEXTURES_URL, 'Solar System Scope'), ' · ', link(LICENSE_URL, 'CC BY 4.0')),
            h('li', {}, d.about.moonMaps, ' ', link(SATELLITE_MAPS.io, d.about.links.moonCatalogue), ' · ', link(SATELLITE_PAGES.maps, d.about.links.moonRules)),
            h('li', {}, d.about.facts, ' ', link(SOURCES.planets.url, SOURCES.planets.title), ' · ', link(SOURCES.sun.url, SOURCES.sun.title), ' · ', link(SOURCES.rings.url, SOURCES.rings.title)),
            h('li', {}, d.about.photos, ' ', link(PHOTO_LIBRARY, d.about.links.photoLibrary), ' · ', link(PHOTO_RULES, d.about.links.photoRules)),
            h('li', {}, d.about.sky, ' ', link(CITY_SOURCE.url, 'Wikidata'), ' · ', link(STAR_NAMES_URL, d.about.links.starNames), ' · ', link(BY_SA_URL, 'CC BY-SA 4.0')),
            h('li', {}, d.about.stories, ' ', link(BY_SA_URL, 'CC BY-SA 4.0')),
            h('li', {}, d.about.art, ' ', link(ART_SET.category, 'Wikimedia Commons')),
            h('li', {}, d.about.shadows),
            h('li', {}, d.about.aim),
            h('li', {}, d.about.engine),
          ),
          h('p', {}, made),
          h('div', { class: 'dialog__actions' }, close),
        ),
      );
      if (!el.open) el.showModal();
      (current ?? close).focus();
    },
  };
}
