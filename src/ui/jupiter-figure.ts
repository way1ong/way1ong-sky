// Jupiter through binoculars: the planet's disc and its four large moons where they stand at the moment,
// drawn for the card of Jupiter on the sky map — and said in words, left to right.
import { SKY } from '../config.ts';
import type { MoonBeside } from '../core/jupiter-moons.ts';
import { markBox, placeBeside, type Box } from '../core/labels.ts';
import { h } from './dom.ts';
import { fmt, type Dict } from './i18n.ts';

const SVG = 'http://www.w3.org/2000/svg';

function svg<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>, text = ''): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG, tag);
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, String(value));
  if (text) el.textContent = text;
  return el;
}

export function jupiterFigure(d: Dict, moons: readonly MoonBeside[]): HTMLElement {
  const t = d.sky.pick.jupiter;
  const { width, height, radiusPx, moonPx } = SKY.moonsDrawing;
  const [cx, cy] = [width / 2, height / 2];
  // One scale for the disc and the distances; smaller only when a moon would stand above or below the drawing.
  const highest = Math.max(1, ...moons.map((moon) => Math.abs(moon.up)));
  const widest = Math.max(1, ...moons.map((moon) => Math.abs(moon.right)));
  const k = Math.min(radiusPx, (height / 2 - 14) / highest, (width / 2 - 8) / widest);

  // In words: the moons and the planet from left to right; a moon behind the disc is told apart.
  const seen = moons.filter((moon) => moon.onDisc !== 'behind');
  const row = [...seen.map((moon) => ({ at: moon.right, name: moon.onDisc === 'inFront' ? fmt(t.inFront, { name: t.names[moon.id] }) : t.names[moon.id] })), { at: 0, name: d.bodies.jupiter }];
  row.sort((one, other) => one.at - other.at);
  const said = [fmt(t.order, { list: row.map((item) => item.name).join(', ') }), ...moons.filter((moon) => moon.onDisc === 'behind').map((moon) => fmt(t.behind, { name: t.names[moon.id] }))].join(' ');

  const picture = svg('svg', { class: 'moons__drawing', viewBox: `0 0 ${width} ${height}`, role: 'img', 'aria-label': said });
  picture.append(svg('circle', { class: 'moons__planet', cx, cy, r: k }));
  const marks = seen.map((moon) => ({ moon, x: cx + moon.right * k, y: cy - moon.up * k, r: moonPx }));
  // Names stand clear of the planet, of every moon and of one another, as names on the sky map do.
  const taken: Box[] = [markBox({ x: cx, y: cy, r: k }), ...marks.map(markBox)];
  const frame: Box = { left: 0, right: width, top: 0, bottom: height };
  for (const mark of marks) {
    picture.append(svg('circle', { class: 'moons__moon', cx: mark.x, cy: mark.y, r: mark.r }));
    const name = t.names[mark.moon.id];
    const place = placeBeside(mark, name.length * 6.4, 11, 2, taken, frame);
    if (!place) continue;
    taken.push(place.box);
    picture.append(svg('text', { class: 'moons__name', x: place.x, y: place.y + 4, 'text-anchor': place.align === 'left' ? 'start' : place.align === 'right' ? 'end' : 'middle' }, name));
  }
  return h('figure', { class: 'moons' }, picture as unknown as HTMLElement, h('figcaption', {}, h('span', { class: 'moons__said' }, said), ' ', h('span', { class: 'moons__note' }, t.note)));
}
