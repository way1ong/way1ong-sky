// Jupiter through binoculars: where its four large moons stand beside it at a moment, as seen from a place
// on the Earth. astronomy-engine gives the moons' places round Jupiter; this module turns them into what the
// eye sees — how far to the right or left of the planet and how far up, in radii of Jupiter's disc.
import { C_AUDAY, Equator, JupiterMoons, KM_PER_AU, Observer, Body } from 'astronomy-engine';
import { radiusKm } from './bodies.ts';
import data from '../data/jupiter-moons.json';
import { toSky, type SkyTurn } from './sky.ts';
import { cross, dot, normalize, scale, sub, type Vec3 } from './vec.ts';

export const JUPITER_MOON_IDS = ['io', 'europa', 'ganymede', 'callisto'] as const;
export type JupiterMoonId = (typeof JUPITER_MOON_IDS)[number];
export const JUPITER_MOONS = data.moons;
export const JUPITER_MOONS_SOURCE = data.source;

export interface MoonBeside {
  id: JupiterMoonId;
  /** From the middle of Jupiter's disc, in radii of the disc: to the right (left when negative) and up, as the eye sees it — up is towards the zenith. */
  right: number;
  up: number;
  /** Where it is when it stands within the disc: behind Jupiter (not seen) or in front of it. Null — beside the disc. */
  onDisc: 'behind' | 'inFront' | null;
}

/**
 * Where a second direction lies as seen when looking along the first: to the right and up, radians. Both are
 * directions in the sky of a place, [east, north, up]; "up" on the picture is towards the zenith.
 */
export function offsetInView(looking: Vec3, other: Vec3): { right: number; up: number } {
  const zenith: Vec3 = [0, 0, 1];
  const up = normalize(sub(zenith, scale(looking, dot(zenith, looking))));
  const right = cross(looking, up);
  return { right: dot(other, right), up: dot(other, up) };
}

/** The four moons beside Jupiter for the sky of a place at a moment. */
export function moonsBesideJupiter(turn: SkyTurn): MoonBeside[] {
  const observer = new Observer(turn.place.lat, turn.place.lon, 0);
  // Jupiter as the place sees it: the engine has already taken off the time its light was on the way.
  const jupiter = Equator(Body.Jupiter, turn.date, observer, false, true).vec;
  const distance = Math.hypot(jupiter.x, jupiter.y, jupiter.z);
  // The moons are seen where they were when that light left them.
  const moons = JupiterMoons(new Date(turn.date.getTime() - (distance / C_AUDAY) * 86_400_000));
  const toJupiter: Vec3 = [jupiter.x / distance, jupiter.y / distance, jupiter.z / distance];
  const looking = toSky(turn, toJupiter);
  // The radius of Jupiter's disc as an angle, radians: small enough for the angle and its sine to be one.
  const disc = radiusKm('jupiter') / KM_PER_AU / distance;
  return JUPITER_MOON_IDS.map((id) => {
    const around = moons[id];
    const at: Vec3 = [jupiter.x + around.x, jupiter.y + around.y, jupiter.z + around.z];
    const { right, up } = offsetInView(looking, toSky(turn, normalize(at)));
    const beside = { id, right: right / disc, up: up / disc };
    if (Math.hypot(beside.right, beside.up) >= 1) return { ...beside, onDisc: null };
    // Farther than Jupiter along the line of sight — behind it; nearer — in front.
    const farther = around.x * toJupiter[0] + around.y * toJupiter[1] + around.z * toJupiter[2] > 0;
    return { ...beside, onDisc: farther ? 'behind' : 'inFront' };
  });
}
