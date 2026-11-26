// Webb: the main mirror of eighteen gold segments, the second mirror on its booms, the instruments behind
// the main mirror, and the sunshield that keeps the telescope's side cold.
import type { Diagram } from './types.ts';

export const webb: Diagram = {
  width: 350,
  height: 190,
  shapes: `
    <path class="dg-line" d="M30 140H320M42 147H308M54 154H296"/>
    <path class="dg-soft" d="M150 132L262 74L190 50"/>
    <rect class="dg-line" x="112" y="92" width="34" height="32" rx="3"/>
    <path class="dg-ray" d="M344 62H190" marker-end="url(#dg-arrow)"/>
    <path class="dg-ray" d="M344 116H164" marker-end="url(#dg-arrow)"/>
    <path class="dg-ray dg-thin" d="M184 62L262 72M158 116L262 76M262 74L150 104"/>
    <path class="dg-gold dg-thick" d="M150 132L190 50"/>
    <path class="dg-glass dg-thick" d="M264 66Q258 74 264 82"/>
    <circle class="dg-sun" cx="175" cy="186" r="9"/>
  `,
  labels: [
    { key: 'primary', x: 8, y: 40 },
    { key: 'secondary', x: 342, y: 46, anchor: 'end' },
    { key: 'instruments', x: 8, y: 86 },
    { key: 'light', x: 342, y: 134, anchor: 'end' },
    { key: 'shield', x: 342, y: 170, anchor: 'end' },
    { key: 'hot', x: 8, y: 176 },
  ],
};
