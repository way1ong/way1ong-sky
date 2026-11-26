// The gnomon: a rod, the Sun's ray over its top and the shadow on the ground, with the marks of a sundial.
import type { Diagram } from './types.ts';

export const gnomon: Diagram = {
  width: 350,
  height: 190,
  shapes: `
    <path class="dg-line" d="M14 150H336"/>
    <path class="dg-soft" d="M44 144V156M74 144V156M104 144V156"/>
    <path class="dg-shadow" d="M150 150H23"/>
    <path class="dg-body" d="M150 150V80"/>
    <circle class="dg-sun" cx="262" cy="18" r="11"/>
    <path class="dg-ray" d="M250 25L23 150" marker-end="url(#dg-arrow)"/>
    <path class="dg-ray dg-thin" d="M63 150A40 40 0 0 0 58 131"/>
  `,
  labels: [
    { key: 'sun', x: 280, y: 22 },
    { key: 'rod', x: 158, y: 112 },
    { key: 'shadow', x: 104, y: 142, anchor: 'middle' },
    { key: 'angle', x: 14, y: 176 },
  ],
};
