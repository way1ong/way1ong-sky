// The small card of what a touch on the sky map has named: its name, its constellation, how bright it is,
// where it stands now, and for a body its rising and setting. It lies over the map without closing it.
import type { SkyInfo } from '../core/pick.ts';
import { starName } from '../core/stars.ts';
import { h } from './dom.ts';
import { fmt, num, type Dict } from './i18n.ts';

export interface PickCard {
  el: HTMLElement;
  /** Shows the card; `fly` — what the "fly there" button does, null when there is no flight to offer. */
  show(d: Dict, lang: string, info: SkyInfo, fly: (() => void) | null): void;
  hide(): void;
  readonly shown: boolean;
  onClose(run: () => void): void;
}

/** The name the card and the ring's reader hear: a body's name, a star's own name, or that it has none. */
export function pickedName(d: Dict, lang: string, info: SkyInfo): string {
  return info.what.kind === 'body' ? d.bodies[info.what.id] : (starName(info.what.index, lang) ?? d.sky.pick.unnamed);
}

export function createPickCard(): PickCard {
  // A live region: a screen reader says the card when it changes, without the focus leaving the map.
  const el = h('section', { class: 'note pick', role: 'status', hidden: true });
  let closed: () => void = () => undefined;
  // What the card shows now and its rows: the same star at a later moment gets new rows, the buttons stay
  // under the finger.
  let shownFor = '';
  let shownRows: HTMLElement | null = null;
  return {
    el,
    get shown() {
      return !el.hidden;
    },
    onClose(run) {
      closed = run;
    },
    show(d, lang, info, fly) {
      const t = d.sky.pick;
      const time = (at: Date) => new Intl.DateTimeFormat(lang, { hour: 'numeric', minute: '2-digit' }).format(at);
      const row = (label: string, value: string) => h('div', { class: 'pick__row' }, h('dt', {}, label), ' ', h('dd', {}, value));
      const line = (text: string) => h('div', { class: 'pick__row' }, h('dd', {}, text));
      const name = pickedName(d, lang, info);
      const body = info.what.kind === 'body' ? info.what.id : null;
      const kind = body === null ? t.star : body === 'sun' || body === 'moon' ? '' : t.planet;
      const constellation = (d.sky.constellations as Record<string, string>)[info.constellation] ?? info.constellation;
      const rows = h('dl', { class: 'pick__rows' });
      rows.append(row(kind ? fmt(t.kindIn, { kind }) : t.constellation, constellation));
      if (info.moon) rows.append(row(t.phase, `${d.sky.tonight.phases[info.moon.phase]} · ${fmt(d.sky.tonight.moonLit, { percent: num(lang, info.moon.lit * 100) })}`));
      if (info.magnitude !== null) {
        const word = info.tooFaint ? d.sky.tonight.faint : info.brightness ? t.words[info.brightness] : '';
        rows.append(row(t.brightness, fmt(t.magnitude, { word, mag: num(lang, info.magnitude, 1) })));
      }
      rows.append(row(t.now, info.altitude >= 0 ? fmt(t.up, { altitude: num(lang, info.altitude), direction: d.sky.tonight.directions[info.compass] }) : t.under));
      // What comes first is said first: a body that is up sets before it rises again.
      const turns = [
        info.rise ? { at: info.rise, text: fmt(t.rises, { time: time(info.rise) }) } : null,
        info.set ? { at: info.set, text: fmt(t.sets, { time: time(info.set) }) } : null,
      ].filter((turn) => turn !== null);
      turns.sort((one, other) => one.at.getTime() - other.at.getTime());
      if (turns.length > 0) rows.append(line(turns.map((turn) => turn.text).join(', ')));

      const key = `${lang}:${info.what.kind === 'body' ? info.what.id : info.what.index}`;
      if (!el.hidden && key === shownFor && shownRows) {
        shownRows.replaceWith(rows);
        shownRows = rows;
        return;
      }
      shownFor = key;
      shownRows = rows;

      const close = h('button', { class: 'icon-btn', type: 'button', 'aria-label': t.close }, h('span', { class: 'icon-close', 'aria-hidden': 'true' }));
      close.addEventListener('click', () => closed());
      const text = h('div', { class: 'pick__text' }, h('h2', { class: 'pick__name' }, name), rows);
      if (fly) {
        const go = h('button', { class: 'chip', type: 'button', 'aria-label': fmt(t.flyLabel, { name }) }, t.fly);
        go.addEventListener('click', fly);
        text.append(go);
      }
      el.replaceChildren(text, close);
      el.hidden = false;
    },
    hide() {
      el.hidden = true;
      el.replaceChildren();
      shownFor = '';
      shownRows = null;
    },
  };
}
