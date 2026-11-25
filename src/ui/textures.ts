// The pictures of the app, by name. They are part of the app itself (no address outside it).
import earth from '../textures/earth.jpg';
import jupiter from '../textures/jupiter.jpg';
import mars from '../textures/mars.jpg';
import mercury from '../textures/mercury.jpg';
import moon from '../textures/moon.jpg';
import neptune from '../textures/neptune.jpg';
import ring from '../textures/saturn-ring.png';
import saturn from '../textures/saturn.jpg';
import stars from '../textures/stars.jpg';
import sun from '../textures/sun.jpg';
import uranus from '../textures/uranus.jpg';
import venus from '../textures/venus.jpg';
import type { BodyId } from '../core/bodies.ts';

export const BODY_TEXTURES: Record<BodyId, string> = { sun, mercury, venus, earth, moon, mars, jupiter, saturn, uranus, neptune };
export const RING_TEXTURE = ring;
export const STARS_TEXTURE = stars;
