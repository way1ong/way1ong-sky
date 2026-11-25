// The pictures of the app, by name. They are part of the app itself (no address outside it).
import callisto from '../textures/callisto.jpg';
import earth from '../textures/earth.jpg';
import europa from '../textures/europa.jpg';
import ganymede from '../textures/ganymede.jpg';
import io from '../textures/io.jpg';
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
import type { WorldId } from '../core/bodies.ts';

/** The maps of the Sun, the planets and the Moon are in colour; those of Jupiter's moons (U.S. Geological Survey) are in shades of grey. */
export const BODY_TEXTURES: Record<WorldId, string> = { sun, mercury, venus, earth, moon, mars, jupiter, saturn, uranus, neptune, io, europa, ganymede, callisto };
export const RING_TEXTURE = ring;
export const STARS_TEXTURE = stars;
