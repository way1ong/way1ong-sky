// The astrolabe: the disc with its graduated rim, the cut-out star map over it, and the sighting rule
// aimed at a star — the height is read on the rim.
import type { Diagram } from './types.ts';

export const astrolabe: Diagram = {
  width: 350,
  height: 190,
  shapes: `
    <circle class="dg-line" cx="96" cy="100" r="76"/>
    <circle class="dg-dash" cx="96" cy="100" r="68"/>
    <path class="dg-soft" d="M20 100H232"/>
    <circle class="dg-glass dg-open" cx="96" cy="84" r="32"/>
    <path class="dg-glass dg-open" d="M70 66L56 52M122 66L138 50M118 108L140 126M74 108L58 130"/>
    <circle class="dg-fill" cx="56" cy="52" r="2.5"/><circle class="dg-fill" cx="138" cy="50" r="2.5"/><circle class="dg-fill" cx="140" cy="126" r="2.5"/><circle class="dg-fill" cx="58" cy="130" r="2.5"/>
    <path class="dg-body" d="M26 128L166 72"/>
    <path class="dg-ray dg-dashed" d="M300 18L170 70" marker-end="url(#dg-arrow)"/>
    <circle class="dg-sun" cx="304" cy="16" r="4"/>
    <path class="dg-ray dg-thin" d="M206 100A110 110 0 0 0 198 59"/>
    <path class="dg-soft" d="M168 140L196 148M128 84L196 128M150 79L196 108"/>
  `,
  labels: [
    { key: 'star', x: 304, y: 36, anchor: 'middle' },
    { key: 'altitude', x: 212, y: 86 },
    { key: 'rule', x: 200, y: 112 },
    { key: 'rete', x: 200, y: 132 },
    { key: 'disc', x: 200, y: 152 },
  ],
};
