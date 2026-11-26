// "Instruments of astronomers": a list from the gnomon to the space telescopes, and the card of each — a
// drawing made for the program, how the instrument works, who made it and when, what it gave, and the
// pages the text is written after.
import { INSTRUMENTS, INSTRUMENT_SOURCE, agencyOf, instrumentCredit, neighbours, type Instrument, type InstrumentId } from '../core/instruments.ts';
import { drawDiagram } from './diagrams/draw.ts';
import { instrumentPictureUrl } from './instrument-picture.ts';
import { DIAGRAMS } from './diagrams/index.ts';
import { h } from './dom.ts';
import { fmt, type Dict } from './i18n.ts';

const link = (url: string, text: string) => h('a', { href: url, rel: 'noopener' }, text);

type Card = Dict['instruments']['items'][InstrumentId] & { inApp?: string };

export function createInstrumentsDialog(): { el: HTMLDialogElement; open(d: Dict, lang: string): void } {
  const el = h('dialog', { class: 'dialog', 'aria-labelledby': 'instruments-title' });

  function show(body: HTMLElement, focus: HTMLElement): void {
    el.replaceChildren(body);
    if (!el.open) el.showModal();
    el.scrollTop = 0;
    focus.focus({ preventScroll: true });
  }

  function list(d: Dict, lang: string, back?: InstrumentId): void {
    const t = d.instruments;
    const items = h('ul', { class: 'instruments' });
    let first: HTMLButtonElement | null = null;
    let returned: HTMLButtonElement | null = null;
    for (const one of INSTRUMENTS) {
      const words = t.items[one.id] as Card;
      const button = h('button', { class: 'instrument', type: 'button' }, h('span', { class: 'instrument__name' }, words.name), h('span', { class: 'instrument__when' }, words.when));
      button.addEventListener('click', () => card(d, lang, one));
      first ??= button;
      if (one.id === back) returned = button;
      items.append(h('li', {}, button));
    }
    const close = h('button', { class: 'btn', type: 'button' }, d.card.close);
    close.addEventListener('click', () => el.close());
    show(h('div', { class: 'dialog__body' }, h('h2', { id: 'instruments-title' }, t.title), h('p', {}, t.lead), items, h('div', { class: 'dialog__actions' }, close)), returned ?? first ?? close);
  }

  function card(d: Dict, lang: string, one: Instrument): void {
    const t = d.instruments;
    const words = t.items[one.id] as Card;
    const place = fmt(t.place, { n: INSTRUMENTS.indexOf(one) + 1, total: INSTRUMENTS.length });
    const row = (label: string, value: string) => h('div', { class: 'fact' }, h('dt', {}, label), h('dd', {}, h('span', { class: 'fact__value' }, value)));
    const facts = h('dl', { class: 'facts' }, row(t.gave, words.gave));
    if (words.inApp) facts.append(row(t.inApp, words.inApp));

    // Whom the text follows: the agencies' pages and Wikipedia's articles; with the articles — their licence.
    const credit = h('p', { class: 'fact__source' }, t.source, ' ');
    const sources: (HTMLElement | string)[] = [];
    for (const url of one.agency) sources.push(link(url, t.pages[agencyOf(url)]));
    const articles = instrumentCredit(one, lang);
    for (const { lang: key, page } of articles) sources.push(link(page.url, fmt(t.pages[key as 'en' | 'uk' | 'hu'], { title: page.title })));
    sources.forEach((source, i) => credit.append(i > 0 ? ' · ' : '', source));
    if (articles.length > 0) credit.append('. ', t.licence, ' ', link(INSTRUMENT_SOURCE.wikipedia.licenceUrl, INSTRUMENT_SOURCE.wikipedia.licence));

    // An old engraving of the instrument, where the program has one: how it looked, beside how it works.
    const file = one.picture ? instrumentPictureUrl(one.id) : undefined;
    const caption = (t.picture.captions as Record<string, string>)[one.id];
    const engraving =
      one.picture && file && caption
        ? h(
            'figure',
            { class: 'photo photo--art' },
            h('img', { src: file, alt: fmt(t.picture.alt, { name: words.name }), width: String(one.picture.width), height: String(one.picture.height), decoding: 'async', loading: 'lazy' }),
            h('figcaption', {}, `${caption} ${t.picture.publicDomain} `, link(one.picture.page, t.picture.link)),
          )
        : null;

    const { before, after } = neighbours(one.id);
    const step = (to: Instrument, text: string) => {
      const name = (t.items[to.id] as Card).name;
      const button = h('button', { class: 'chip', type: 'button' }, fmt(text, { name }));
      button.addEventListener('click', () => card(d, lang, to));
      return button;
    };
    const toList = h('button', { class: 'chip', type: 'button' }, t.toList);
    toList.addEventListener('click', () => list(d, lang, one.id));
    const close = h('button', { class: 'btn', type: 'button' }, d.card.close);
    close.addEventListener('click', () => el.close());
    const steps = h('div', { class: 'steps' }, before ? step(before, t.before) : null, after ? step(after, t.after) : null);

    const body = h(
      'div',
      { class: 'dialog__body' },
      h('h2', { id: 'instruments-title' }, words.name),
      h('p', { class: 'fact__source' }, fmt(t.kind, { place, when: words.when })),
      h('figure', { class: 'photo' }, drawDiagram(DIAGRAMS[one.id], words.labels, words.alt), h('figcaption', {}, t.drawn)),
      h('p', { class: 'fact__about' }, words.how),
      h('p', { class: 'fact__about' }, words.story),
      engraving,
      facts,
      credit,
      steps,
      h('div', { class: 'dialog__actions' }, toList, close),
    );
    show(body, close);
  }

  return {
    el,
    open(d, lang) {
      list(d, lang);
    },
  };
}
