// Galileo's refractor: the light of a star, the convex lens at the front, the tube, the concave eyepiece, the eye.
import type { Diagram } from './types.ts';

export const refractor: Diagram = {
  width: 350,
  height: 190,
  shapes: `
    <rect class="dg-line" x="92" y="52" width="196" height="76" rx="4"/>
    <path class="dg-ray" d="M8 62H98" marker-end="url(#dg-arrow)"/>
    <path class="dg-ray" d="M8 90H98" marker-end="url(#dg-arrow)"/>
    <path class="dg-ray" d="M8 118H98" marker-end="url(#dg-arrow)"/>
    <path class="dg-ray" d="M108 62L262 84M108 90H262M108 118L262 96"/>
    <path class="dg-ray" d="M270 84H318M270 96H318"/>
    <path class="dg-ray" d="M270 90H320" marker-end="url(#dg-arrow)"/>
    <path class="dg-glass" d="M104 54C114 74 114 106 104 126C94 106 94 74 104 54Z"/>
    <path class="dg-glass" d="M261 76H271C266 84 266 96 271 104H261C266 96 266 84 261 76Z"/>
    <path class="dg-body dg-thin" d="M326 90C332 82 340 82 346 90C340 98 332 98 326 90Z"/>
    <circle class="dg-fill" cx="336" cy="90" r="3"/>
    <path class="dg-soft" d="M104 128V140M266 106V140"/>
  `,
  labels: [
    { key: 'light', x: 8, y: 46 },
    { key: 'tube', x: 190, y: 42, anchor: 'middle' },
    { key: 'lens', x: 104, y: 158, anchor: 'middle' },
    { key: 'eyepiece', x: 346, y: 158, anchor: 'end' },
    { key: 'eye', x: 348, y: 120, anchor: 'end' },
  ],
};
