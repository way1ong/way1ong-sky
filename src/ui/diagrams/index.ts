// The drawing of each instrument, by its key.
import type { InstrumentId } from '../../core/instruments.ts';
import { armillary } from './armillary.ts';
import { astrolabe } from './astrolabe.ts';
import { gnomon } from './gnomon.ts';
import { hubble } from './hubble.ts';
import { plate } from './plate.ts';
import { quadrant } from './quadrant.ts';
import { radio } from './radio.ts';
import { reflector } from './reflector.ts';
import { refractor } from './refractor.ts';
import { spectroscope } from './spectroscope.ts';
import type { Diagram } from './types.ts';
import { webb } from './webb.ts';

export const DIAGRAMS: Readonly<Record<InstrumentId, Diagram>> = { gnomon, armillary, astrolabe, quadrant, refractor, reflector, spectroscope, plate, radio, hubble, webb };
