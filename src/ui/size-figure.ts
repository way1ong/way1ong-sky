// A body beside the Earth (the Earth — beside the Moon), both to one scale: a small drawing for the card.
import { SKY } from '../config.ts';
import type { BodyId } from '../core/bodies.ts';
import { besideFor, diameterRatio, sizeDrawing } from '../core/you.ts';
import { h } from './dom.ts';
import { fmt, num, type Dict } from './i18n.ts';

const SVG = 'http://www.w3.org/2000/svg';
const WIDTH = 320;
const HEIGHT = 130;

function svg<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>, text = ''): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG, tag);
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, String(value));
  if (text) el.textContent = text;
  return el;
}

export function sizeFigure(d: Dict, lang: string, id: BodyId): HTMLElement {
  const beside = besideFor(id);
  const ratio = diameterRatio(id);
  const { body, other } = sizeDrawing(ratio, WIDTH, HEIGHT);
  const t = d.card.size;
  const said = id === 'earth' ? fmt(t.earthVsMoon, { n: num(lang, ratio, 1) }) : ratio >= 1 ? fmt(t.bigger, { n: num(lang, ratio, 1) }) : fmt(t.smaller, { percent: num(lang, ratio * 100) });
  // A circle too big for the drawing shows only its edge: said in words too.
  const arc = Math.max(body.r, other.r) * 2 > HEIGHT * SKY.you.drawing.mostShare + 1e-9;
  const picture = svg('svg', { class: 'size__drawing', viewBox: `0 0 ${WIDTH} ${HEIGHT}`, role: 'img', 'aria-label': said });
  picture.append(
    svg('circle', { class: 'size__body', cx: body.cx, cy: body.cy, r: body.r }),
    svg('circle', { class: 'size__other', cx: other.cx, cy: other.cy, r: other.r }),
    svg('text', { class: 'size__name', x: WIDTH / 4, y: HEIGHT - 2, 'text-anchor': 'middle' }, d.bodies[id]),
    svg('text', { class: 'size__name', x: (WIDTH * 3) / 4, y: HEIGHT - 2, 'text-anchor': 'middle' }, d.bodies[beside]),
  );
  return h(
    'section',
    { class: 'site-section', 'aria-labelledby': 'size-title' },
    h('h3', { id: 'size-title' }, beside === 'earth' ? t.earth : t.moon),
    h('figure', { class: 'size' }, picture as unknown as HTMLElement, h('figcaption', {}, arc ? `${said} ${t.arc}` : said)),
  );
}
