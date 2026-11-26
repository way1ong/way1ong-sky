// Newton's reflector: the light falls on the curved mirror at the bottom of the tube, a small flat mirror
// near the focus sends it out through the side, to the eyepiece.
import type { Diagram } from './types.ts';

export const reflector: Diagram = {
  width: 350,
  height: 190,
  shapes: `
    <path class="dg-line" d="M60 64H300V136H60"/>
    <path class="dg-ray" d="M8 76H288" marker-end="url(#dg-arrow)"/>
    <path class="dg-ray" d="M8 124H288" marker-end="url(#dg-arrow)"/>
    <path class="dg-ray" d="M290 76L176 98M290 124L176 102"/>
    <path class="dg-ray" d="M172 98V50M178 102V50"/>
    <path class="dg-ray" d="M175 100V34" marker-end="url(#dg-arrow)"/>
    <path class="dg-glass dg-thick" d="M287 68Q299 100 287 132"/>
    <path class="dg-glass dg-thick" d="M166 90L184 110"/>
    <ellipse class="dg-glass" cx="175" cy="46" rx="11" ry="4"/>
    <path class="dg-body dg-thin" d="M165 20C171 12 179 12 185 20C179 28 171 28 165 20Z"/>
    <circle class="dg-fill" cx="175" cy="20" r="3"/>
    <path class="dg-soft" d="M175 112V162"/>
  `,
  labels: [
    { key: 'light', x: 8, y: 58 },
    { key: 'eye', x: 192, y: 24 },
    { key: 'eyepiece', x: 192, y: 50 },
    { key: 'flat', x: 175, y: 178, anchor: 'middle' },
    { key: 'mirror', x: 342, y: 156, anchor: 'end' },
    { key: 'tube', x: 64, y: 154 },
  ],
};
