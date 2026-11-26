// The armillary sphere: rings for the meridian, the equator and the ecliptic round a small Earth.
import type { Diagram } from './types.ts';

export const armillary: Diagram = {
  width: 350,
  height: 190,
  shapes: `
    <path class="dg-soft" d="M106 176L150 14"/>
    <circle class="dg-line" cx="128" cy="95" r="72"/>
    <ellipse class="dg-glass dg-open" cx="128" cy="95" rx="72" ry="19" transform="rotate(-15 128 95)"/>
    <ellipse class="dg-ray dg-open" cx="128" cy="95" rx="72" ry="24" transform="rotate(9 128 95)"/>
    <circle class="dg-fill" cx="128" cy="95" r="7"/>
    <path class="dg-soft" d="M199 77L214 72M201 107L214 118M179 146L214 152M135 95H214"/>
  `,
  labels: [
    { key: 'axis', x: 158, y: 20 },
    { key: 'equator', x: 218, y: 76 },
    { key: 'earth', x: 218, y: 99 },
    { key: 'ecliptic', x: 218, y: 123 },
    { key: 'meridian', x: 218, y: 156 },
  ],
};
