// The mural quadrant: a wall along the meridian, the quarter arc with its degrees, a sight at the centre
// and a sight that slides along the arc until both point at the star.
import type { Diagram } from './types.ts';

export const quadrant: Diagram = {
  width: 350,
  height: 190,
  shapes: `
    <path class="dg-line" d="M110 172H340"/>
    <path class="dg-wall" d="M250 20V62M250 78V172"/>
    <path class="dg-soft" d="M250 70H150M250 70V170"/>
    <path class="dg-line" d="M250 170A100 100 0 0 1 150 70"/>
    <path class="dg-dash" d="M250 160A90 90 0 0 1 160 70"/>
    <path class="dg-ray" d="M311 27L172 125" marker-end="url(#dg-arrow)"/>
    <circle class="dg-sun" cx="315" cy="24" r="4"/>
    <circle class="dg-fill" cx="250" cy="70" r="3.5"/>
    <circle class="dg-fill" cx="168" cy="127" r="4.5"/>
    <path class="dg-ray dg-thin" d="M212 70A38 38 0 0 0 219 92"/>
  `,
  labels: [
    { key: 'star', x: 315, y: 44, anchor: 'middle' },
    { key: 'centre', x: 242, y: 60, anchor: 'end' },
    { key: 'altitude', x: 206, y: 88, anchor: 'end' },
    { key: 'slide', x: 158, y: 138, anchor: 'end' },
    { key: 'arc', x: 196, y: 164, anchor: 'end' },
    { key: 'wall', x: 260, y: 150 },
  ],
};
