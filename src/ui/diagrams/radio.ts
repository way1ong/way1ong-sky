// The radio telescope: a large dish — a mirror for radio waves — gathers them at its focus, where the
// receiver stands.
import type { Diagram } from './types.ts';

export const radio: Diagram = {
  width: 350,
  height: 190,
  shapes: `
    <path class="dg-ray" d="M170 6q7 7 0 14t0 14t0 14t0 14t0 14t0 14t0 14t0 14" marker-end="url(#dg-arrow)"/>
    <path class="dg-ray" d="M270 6q7 7 0 14t0 14t0 14t0 14t0 14t0 14t0 14t0 14" marker-end="url(#dg-arrow)"/>
    <path class="dg-ray" d="M220 6q7 7 0 14t0 14t0 14" marker-end="url(#dg-arrow)"/>
    <path class="dg-ray dg-thin" d="M170 122L220 66M270 122L220 66"/>
    <path class="dg-body dg-thick" d="M130 104Q220 168 310 104"/>
    <path class="dg-soft" d="M144 112L220 60L296 112"/>
    <circle class="dg-fill" cx="220" cy="60" r="6"/>
    <path class="dg-line" d="M220 136V176M186 176H254"/>
    <path class="dg-soft" d="M162 76L212 62"/>
  `,
  labels: [
    { key: 'waves', x: 8, y: 22 },
    { key: 'receiver', x: 8, y: 84 },
    { key: 'dish', x: 8, y: 150 },
    { key: 'reflects', x: 8, y: 170, quiet: true },
  ],
};
