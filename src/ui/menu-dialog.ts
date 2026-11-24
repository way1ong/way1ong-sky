// The menu: the language, and what the app is made of — with the credits its sources ask for.
import { SKY } from '../config.ts';
import { SOURCES } from '../core/bodies.ts';
import { h } from './dom.ts';
import { flagOf } from './flags.ts';
import { LANGS, langName, type Dict } from './i18n.ts';

const TEXTURES_URL = 'https://www.solarsystemscope.com/textures/';
const LICENSE_URL = 'https://creativecommons.org/licenses/by/4.0/';

const link = (url: string, text: string) => h('a', { href: url, rel: 'noopener' }, text);

export function createMenuDialog(): { el: HTMLDialogElement; open(d: Dict, lang: string, setLang: (code: string) => void): void } {
  const el = h('dialog', { class: 'dialog', 'aria-labelledby': 'menu-title' });
  return {
    el,
    open(d, lang, setLang) {
      // The languages as buttons, each with its flag and its own name: a list of options cannot show pictures.
      const langs = h('ul', { class: 'langs', 'aria-labelledby': 'lang-label' });
      let current: HTMLButtonElement | null = null;
      for (const code of LANGS) {
        const button = h('button', { class: 'chip lang', type: 'button', lang: code, 'aria-pressed': String(code === lang) }, flagOf(code), langName(code));
        button.addEventListener('click', () => setLang(code));
        if (code === lang) current = button;
        langs.append(h('li', {}, button));
      }
      const close = h('button', { class: 'btn', type: 'button' }, d.actions.close);
      close.addEventListener('click', () => el.close());
      const made = SKY.links.site ? link(SKY.links.site, d.about.madeBy) : d.about.madeBy;
      el.replaceChildren(
        h(
          'div',
          { class: 'dialog__body' },
          h('h2', { id: 'menu-title' }, d.settings.title),
          h('div', { class: 'field' }, h('p', { id: 'lang-label' }, d.settings.language), langs),
          h('h2', {}, d.about.title),
          h('p', {}, d.about.text),
          h('p', {}, d.keys),
          h('h2', {}, d.about.sources),
          h(
            'ul',
            {},
            h('li', {}, d.about.textures, ' ', link(TEXTURES_URL, 'Solar System Scope'), ' · ', link(LICENSE_URL, 'CC BY 4.0')),
            h('li', {}, d.about.facts, ' ', link(SOURCES.planets.url, SOURCES.planets.title), ' · ', link(SOURCES.sun.url, SOURCES.sun.title), ' · ', link(SOURCES.rings.url, SOURCES.rings.title)),
            h('li', {}, d.about.shadows),
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
