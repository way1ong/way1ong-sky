// Turns a drawing into an SVG element with its labels in the language of the screen.
import type { Diagram } from './types.ts';

const NS = 'http://www.w3.org/2000/svg';

/** The head of an arrow at the end of a ray; one drawing is on the screen at a time, so one name is enough. */
const ARROW = '<defs><marker id="dg-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path class="dg-arrow" d="M0 0L8 4L0 8z"/></marker></defs>';

/**
 * `words` — the labels by their keys; `alt` — what the drawing shows, for those who do not see it. The
 * shapes are the program's own markup; the words are set as text, never as markup.
 */
export function drawDiagram(diagram: Diagram, words: Readonly<Record<string, string>>, alt: string): SVGSVGElement {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${diagram.width} ${diagram.height}`);
  svg.setAttribute('class', 'diagram');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', alt);
  svg.innerHTML = ARROW + diagram.shapes;
  for (const label of diagram.labels) {
    const text = document.createElementNS(NS, 'text');
    text.setAttribute('x', String(label.x));
    text.setAttribute('y', String(label.y));
    text.setAttribute('text-anchor', label.anchor ?? 'start');
    text.setAttribute('class', label.quiet ? 'dg-text dg-quiet' : 'dg-text');
    text.textContent = words[label.key] ?? '';
    svg.append(text);
  }
  return svg;
}
