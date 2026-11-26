// The spectroscope: the light of a star passes a narrow slit, a prism spreads it into colours, and dark
// lines stand in the band of colours.
import type { Diagram } from './types.ts';

export const spectroscope: Diagram = {
  width: 350,
  height: 190,
  shapes: `
    <path class="dg-ray" d="M8 96H72" marker-end="url(#dg-arrow)"/>
    <path class="dg-body" d="M80 58V88M80 104V134"/>
    <path class="dg-ray" d="M84 96H160"/>
    <path class="dg-glass" d="M146 132L196 132L171 58Z"/>
    <path class="dg-c1" d="M186 100L296 52"/><path class="dg-c2" d="M186 101L296 74"/><path class="dg-c3" d="M186 102L296 96"/><path class="dg-c4" d="M186 103L296 118"/><path class="dg-c5" d="M186 104L296 140"/>
    <rect class="dg-f1" x="298" y="42" width="16" height="22"/><rect class="dg-f2" x="298" y="64" width="16" height="22"/><rect class="dg-f3" x="298" y="86" width="16" height="22"/><rect class="dg-f4" x="298" y="108" width="16" height="22"/><rect class="dg-f5" x="298" y="130" width="16" height="22"/>
    <path class="dg-dark" d="M298 58H314M298 92H314M298 97H314M298 124H314"/>
    <rect class="dg-line" x="298" y="42" width="16" height="110"/>
    <path class="dg-soft" d="M294 26L304 56"/>
  `,
  labels: [
    { key: 'light', x: 8, y: 44 },
    { key: 'slit', x: 80, y: 154, anchor: 'middle' },
    { key: 'prism', x: 171, y: 154, anchor: 'middle' },
    { key: 'lines', x: 290, y: 22, anchor: 'end' },
    { key: 'spectrum', x: 342, y: 172, anchor: 'end' },
  ],
};
