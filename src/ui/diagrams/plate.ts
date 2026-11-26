// The photographic plate: it stands at the focus of a telescope in place of the eye and gathers faint
// light for a long time.
import type { Diagram } from './types.ts';

export const plate: Diagram = {
  width: 350,
  height: 190,
  shapes: `
    <rect class="dg-line" x="70" y="60" width="140" height="72" rx="4"/>
    <path class="dg-ray dg-dashed" d="M8 70H74M8 96H74M8 122H74"/>
    <path class="dg-ray dg-dashed" d="M86 70L226 95M86 96H226M86 122L226 97"/>
    <path class="dg-glass" d="M82 62C92 80 92 112 82 130C72 112 72 80 82 62Z"/>
    <rect class="dg-fill" x="226" y="80" width="7" height="34"/>
    <circle class="dg-line" cx="310" cy="30" r="16"/>
    <path class="dg-body dg-thin" d="M310 30V19M310 30L319 36"/>
    <path class="dg-soft" d="M229 116V146"/>
  `,
  labels: [
    { key: 'light', x: 8, y: 50 },
    { key: 'telescope', x: 140, y: 154, anchor: 'middle' },
    { key: 'plate', x: 346, y: 164, anchor: 'end' },
    { key: 'time', x: 346, y: 70, anchor: 'end' },
  ],
};
