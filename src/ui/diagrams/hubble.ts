// Hubble: the light falls on the main mirror, goes to the small second mirror in front of it and back
// through a hole in the main one to the cameras; the telescope flies above the air of the Earth.
import type { Diagram } from './types.ts';

export const hubble: Diagram = {
  width: 350,
  height: 190,
  shapes: `
    <path class="dg-ground" d="M0 190Q175 150 350 190Z"/>
    <path class="dg-dash" d="M0 178Q175 138 350 178"/>
    <path class="dg-line" d="M70 46H290V114H70"/>
    <path class="dg-ray" d="M8 56H277" marker-end="url(#dg-arrow)"/>
    <path class="dg-ray" d="M8 104H277" marker-end="url(#dg-arrow)"/>
    <path class="dg-ray" d="M279 56L122 76M279 104L122 84"/>
    <path class="dg-ray" d="M122 76L318 80M122 84L318 80"/>
    <path class="dg-glass dg-thick" d="M276 50Q284 62 284 74M284 86Q284 98 276 110"/>
    <path class="dg-glass dg-thick" d="M118 72Q125 80 118 88"/>
    <rect class="dg-line" x="300" y="64" width="38" height="32" rx="3"/>
    <path class="dg-soft" d="M120 90V124M282 112V124"/>
  `,
  labels: [
    { key: 'light', x: 8, y: 40 },
    { key: 'instruments', x: 342, y: 36, anchor: 'end' },
    { key: 'secondary', x: 120, y: 138, anchor: 'middle' },
    { key: 'primary', x: 342, y: 138, anchor: 'end' },
    { key: 'air', x: 175, y: 183, anchor: 'middle' },
  ],
};
