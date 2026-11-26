// Beyond the Solar System: where the Sun stands in the Galaxy and where the clusters, nebulae and galaxies of
// the list stand from the Sun — in light-years, in the Galaxy's own axes — and how that model is laid on the
// screen: turned, without perspective, at one of four scales. How far each object is — NASA's pages
// (data/deep-sky.json); the Galaxy's plane and middle — astronomy-engine; the Sun's place in NASA's picture
// of the Milky Way and the picture's scale — read from the picture's own grid (data/milky-way.json).
import { Rotation_EQJ_GAL } from 'astronomy-engine';
import { SKY } from '../config.ts';
import file from '../data/milky-way.json';
import { DEEP, type DeepObject } from './deep-sky.ts';
import { starDirection } from './sky.ts';
import { add, dot, length, scale, sub, type Vec3 } from './vec.ts';

/**
 * A direction among the stars (axes of the catalogues, J2000) in the Galaxy's axes: x to its middle, y to
 * where galactic longitude is 90°, z to its north pole.
 */
export function galactic(direction: Vec3): Vec3 {
  // The engine keeps a rotation as columns.
  const m = Rotation_EQJ_GAL().rot as number[][];
  const [x, y, z] = direction;
  return [m[0]![0]! * x + m[1]![0]! * y + m[2]![0]! * z, m[0]![1]! * x + m[1]![1]! * y + m[2]![1]! * z, m[0]![2]! * x + m[1]![2]! * y + m[2]![2]! * z];
}

/** The same, back: a direction of the Galaxy's axes among the stars. */
export function fromGalactic(direction: Vec3): Vec3 {
  const m = Rotation_EQJ_GAL().rot as number[][];
  const [x, y, z] = direction;
  return [m[0]![0]! * x + m[0]![1]! * y + m[0]![2]! * z, m[1]![0]! * x + m[1]![1]! * y + m[1]![2]! * z, m[2]![0]! * x + m[2]![1]! * y + m[2]![2]! * z];
}

/** Galactic longitude (0…360) and latitude of a direction in the Galaxy's axes, degrees. */
export function longLat(at: Vec3): { longitude: number; latitude: number } {
  const longitude = ((Math.atan2(at[1], at[0]) * 180) / Math.PI + 360) % 360;
  return { longitude, latitude: (Math.asin(at[2] / (length(at) || 1)) * 180) / Math.PI };
}

// ---------- NASA's picture of the Milky Way ----------
const grid = file.grid;
const lightYearsPerGridPx = grid.ringLightYears / grid.ringPx;

export const MILKY_WAY = {
  /** The picture's size in the program, px. */
  width: file.picture.width,
  height: file.picture.height,
  /** How many light-years the picture is across, by its own grid. */
  lightYears: grid.frame * lightYearsPerGridPx,
  /** The Sun's place in the picture, as shares of its width and height. */
  sun: [grid.sun[0]! / grid.frame, grid.sun[1]! / grid.frame] as const,
  source: file.source,
} as const;

/** The Sun: the model is measured from it. */
export const SUN: Vec3 = [0, 0, 0];
/** The middle of the Galaxy as the picture draws it: straight towards longitude 0°. */
export const MIDDLE: Vec3 = [grid.middleUpPx * lightYearsPerGridPx, 0, 0];

/**
 * A point of the picture (shares of its width and height, from the top left corner) in the model: the
 * picture looks at the Galaxy from its north pole, longitude 0° up from the Sun and 90° to the left.
 */
export function pictureToModel(u: number, v: number): Vec3 {
  return [(MILKY_WAY.sun[1] - v) * MILKY_WAY.lightYears, (MILKY_WAY.sun[0] - u) * MILKY_WAY.lightYears, 0];
}

// ---------- the objects ----------
export interface FarObject {
  object: DeepObject;
  /** Where it stands from the Sun, light-years, in the Galaxy's axes. */
  at: Vec3;
  /** Its own galaxy, or a part of ours. */
  galaxy: boolean;
}

/** Nearest first. */
export const FAR: readonly FarObject[] = [...DEEP]
  .sort((a, b) => a.lightYears - b.lightYears)
  .map((object) => ({ object, at: scale(galactic(starDirection(object.ra, object.dec)), object.lightYears), galaxy: object.kind === 'galaxy' }));

export function farById(id: string): FarObject | undefined {
  return FAR.find((o) => o.object.id === id);
}

/** The other galaxies, nearest first. */
export const GALAXIES: readonly FarObject[] = FAR.filter((o) => o.galaxy);

// ---------- the ladder ----------
export const RUNGS = ['near', 'galaxy', 'group', 'far'] as const;
export type Rung = (typeof RUNGS)[number];

/** What a rung must fit. */
export function rungMembers(rung: Rung): readonly FarObject[] {
  const { nearLightYears, neighbourLightYears } = SKY.far;
  if (rung === 'near') return FAR.filter((o) => !o.galaxy && o.object.lightYears <= nearLightYears);
  if (rung === 'galaxy') return FAR.filter((o) => !o.galaxy);
  if (rung === 'group') return GALAXIES.filter((o) => o.object.lightYears <= neighbourLightYears);
  return GALAXIES;
}

/** What a rung looks at and how many light-years it shows across the shorter side of the screen. */
export function rungLook(rung: Rung): { centre: Vec3; span: number } {
  const members = rungMembers(rung);
  if (rung === 'near') return { centre: SUN, span: 2 * Math.max(...members.map((o) => length(o.at))) * SKY.far.margin };
  if (rung === 'galaxy') return { centre: MIDDLE, span: MILKY_WAY.lightYears };
  // The galaxies and our own: the middle of the box that holds them all, and room for the farthest corner.
  const points = [MIDDLE, ...members.map((o) => o.at)];
  const low = [0, 1, 2].map((i) => Math.min(...points.map((p) => p[i]!)));
  const high = [0, 1, 2].map((i) => Math.max(...points.map((p) => p[i]!)));
  const centre: Vec3 = [(low[0]! + high[0]!) / 2, (low[1]! + high[1]!) / 2, (low[2]! + high[2]!) / 2];
  return { centre, span: 2 * Math.max(...points.map((p) => length(sub(p, centre)))) * SKY.far.margin };
}

/** The rung a view of this many light-years across belongs to: the nearest by ratio. */
export function rungOf(span: number): Rung {
  let best: Rung = 'near';
  let gap = Infinity;
  for (const rung of RUNGS) {
    const now = Math.abs(Math.log(span / rungLook(rung).span));
    if (now < gap) [best, gap] = [rung, now];
  }
  return best;
}

// ---------- the view ----------
export interface FarView {
  /** Round the Galaxy's axis, radians; at π its middle is away from the viewer, as in NASA's picture. */
  yaw: number;
  /** How steeply the Galaxy's plane is looked at, radians: π/2 — straight from above its north pole. */
  pitch: number;
  /** The point of the model in the middle of the free screen. */
  centre: Vec3;
  /** Light-years shown across the shorter side of the free screen. */
  span: number;
}

/** The part of the canvas the model is centred on, CSS px: its middle and half of its shorter side. */
export interface FarFrame {
  cx: number;
  cy: number;
  half: number;
}

const rad = (deg: number) => (deg * Math.PI) / 180;

export function firstFarView(rung: Rung): FarView {
  return { yaw: rad(SKY.far.yawDeg), pitch: rad(SKY.far.pitchDeg.first), ...rungLook(rung) };
}

/** The limits of the scale: a little closer than the nearest rung, a little farther than the farthest. */
export function clampSpan(span: number): number {
  const least = rungLook('near').span * SKY.far.zoom.closer;
  const most = rungLook('far').span * SKY.far.zoom.farther;
  return Math.max(least, Math.min(most, span));
}

/** A drag: `right` and `down` in radians. The plane is never seen from the edge or from below. */
export function turnFar(view: FarView, right: number, down: number): FarView {
  const { least, most } = SKY.far.pitchDeg;
  return { ...view, yaw: view.yaw - right, pitch: Math.max(rad(least), Math.min(rad(most), view.pitch + down)) };
}

export function zoomFar(view: FarView, factor: number): FarView {
  return { ...view, span: clampSpan(view.span * factor) };
}

/** The screen's own axes in the model: to the right, up, and towards the viewer. */
export function farAxes(view: FarView): { right: Vec3; up: Vec3; out: Vec3 } {
  const [cy, sy, cp, sp] = [Math.cos(view.yaw), Math.sin(view.yaw), Math.cos(view.pitch), Math.sin(view.pitch)];
  return { right: [-sy, cy, 0], up: [-sp * cy, -sp * sy, cp], out: [cp * cy, cp * sy, sp] };
}

/** Where a point of the model is on the screen, CSS px; `depth` — light-years towards the viewer from the view's centre. */
export function projectFar(at: Vec3, view: FarView, frame: FarFrame): { x: number; y: number; depth: number } {
  const { right, up, out } = farAxes(view);
  const from = sub(at, view.centre);
  const pxPerLightYear = (2 * frame.half) / view.span;
  return { x: frame.cx + dot(from, right) * pxPerLightYear, y: frame.cy - dot(from, up) * pxPerLightYear, depth: dot(from, out) };
}

/** How many times a thing `lightYears` across is drawn larger than life to be `leastPx` wide; 1 — it is drawn to scale. */
export function enlarged(lightYears: number, view: FarView, frame: FarFrame, leastPx: number): number {
  const truePx = (lightYears * 2 * frame.half) / view.span;
  return Math.max(1, leastPx / truePx);
}

/** How wide the picture of the Milky Way is on the screen at its true scale, CSS px. */
export function milkyWayPx(view: FarView, frame: FarFrame): number {
  return (MILKY_WAY.lightYears * 2 * frame.half) / view.span;
}

/** The clusters and nebulae are marked while the Milky Way is large enough to tell them apart. */
export function marksShown(view: FarView, frame: FarFrame): boolean {
  return milkyWayPx(view, frame) >= SKY.far.marksFromPx;
}

/** How bright the picture of the Milky Way is drawn: dimmer when the view is deep inside it. */
export function pictureLight(view: FarView, frame: FarFrame): number {
  const { pictureLight: full, pictureDimFrom, pictureLeastLight } = SKY.far;
  const sides = milkyWayPx(view, frame) / (2 * frame.half);
  return Math.max(pictureLeastLight, full * Math.min(1, Math.sqrt(pictureDimFrom / sides)));
}

/**
 * A galaxy so near the Milky Way at this scale that the two would lie on one another however the model is
 * turned: among the far galaxies our neighbours are such. It is not drawn apart, and the Milky Way's name
 * says it has company.
 */
export function mergedWithHome(o: FarObject, view: FarView, frame: FarFrame): boolean {
  if (marksShown(view, frame)) return false;
  return (length(sub(o.at, MIDDLE)) * 2 * frame.half) / view.span < SKY.far.mergedWithinPx;
}

/**
 * How the picture of the Milky Way is laid on the screen: the six numbers of a canvas transform that takes
 * a pixel of the picture to its place. Smaller than `thumbPx`, the picture is enlarged about the Galaxy's middle.
 */
export function pictureOnScreen(view: FarView, frame: FarFrame): [number, number, number, number, number, number] {
  const grow = enlarged(MILKY_WAY.lightYears, view, frame, SKY.far.thumbPx);
  const corner = (u: number, v: number): Vec3 => add(MIDDLE, scale(sub(pictureToModel(u, v), MIDDLE), grow));
  const origin = projectFar(corner(0, 0), view, frame);
  const along = projectFar(corner(1, 0), view, frame);
  const down = projectFar(corner(0, 1), view, frame);
  return [(along.x - origin.x) / MILKY_WAY.width, (along.y - origin.y) / MILKY_WAY.width, (down.x - origin.x) / MILKY_WAY.height, (down.y - origin.y) / MILKY_WAY.height, origin.x, origin.y];
}

/** The foot of a point on the Galaxy's plane: where its stem stands. */
export function footOf(at: Vec3): Vec3 {
  return [at[0], at[1], 0];
}

// ---------- flying from one view to another ----------
export interface FarFlight {
  from: FarView;
  to: FarView;
  startedAt: number;
  ms: number;
}

const ease = (t: number) => t * t * (3 - 2 * t);

/**
 * The view at a moment of a flight: the centre slides, the scale changes by equal ratios in equal times; the
 * turn is kept. `share` — how much of the way is done, 0…1.
 */
export function farFlightAt(flight: FarFlight, now: number): { view: FarView; done: boolean; share: number } {
  const t = flight.ms <= 0 ? 1 : Math.max(0, Math.min(1, (now - flight.startedAt) / flight.ms));
  const k = ease(t);
  const { from, to } = flight;
  const span = Math.exp(Math.log(from.span) + (Math.log(to.span) - Math.log(from.span)) * k);
  // The centre moves with the scale, or a far target would stay off the screen for most of the flight.
  const share = from.span === to.span ? k : (span - from.span) / (to.span - from.span);
  const centre = add(from.centre, scale(sub(to.centre, from.centre), share));
  return { view: { yaw: from.yaw, pitch: from.pitch, centre, span }, done: t >= 1, share: k };
}

/** The view that has arrived at a galaxy: it in the middle, `arriveZoom` times closer than its rung. */
export function arrivedAt(o: FarObject, view: FarView): FarView {
  const rung: Rung = rungMembers('group').includes(o) ? 'group' : 'far';
  return { ...view, centre: o.at, span: rungLook(rung).span / SKY.far.arriveZoom };
}

// ---------- what a touch means ----------
export type FarTouch = { kind: 'object'; id: string } | { kind: 'sun' } | { kind: 'milkyWay' };

/**
 * What lies under a point of the screen: a galaxy's photograph, the mark of a cluster or a nebula, the
 * Sun's mark, or the Milky Way itself when it is drawn small among the other galaxies; null — nothing.
 */
export function farAt(x: number, y: number, view: FarView, frame: FarFrame, arrived: string | null): FarTouch | null {
  const { reachPx, thumbPx, arrivedShare } = SKY.far;
  let best: { touch: FarTouch; gap: number } | null = null;
  const offer = (touch: FarTouch, at: Vec3, reach: number) => {
    const p = projectFar(at, view, frame);
    const gap = Math.hypot(p.x - x, p.y - y);
    if (gap <= reach && (!best || gap < best.gap)) best = { touch, gap };
  };
  for (const o of GALAXIES) {
    if (o.object.id !== arrived && mergedWithHome(o, view, frame)) continue;
    offer({ kind: 'object', id: o.object.id }, o.at, o.object.id === arrived ? arrivedShare * frame.half : Math.max(reachPx, thumbPx / 2));
  }
  if (marksShown(view, frame)) {
    for (const o of FAR) if (!o.galaxy) offer({ kind: 'object', id: o.object.id }, o.at, reachPx);
    offer({ kind: 'sun' }, SUN, reachPx);
  } else {
    offer({ kind: 'milkyWay' }, MIDDLE, Math.max(reachPx, milkyWayPx(view, frame) / 2, thumbPx / 2));
  }
  return (best as { touch: FarTouch; gap: number } | null)?.touch ?? null;
}

/** A round length for the scale line: 1, 2 or 5 with zeros, at most `mostPx` long on the screen. */
export function scaleLine(view: FarView, frame: FarFrame, mostPx: number): { lightYears: number; px: number } {
  const pxPerLightYear = (2 * frame.half) / view.span;
  const most = mostPx / pxPerLightYear;
  const power = 10 ** Math.floor(Math.log10(most));
  const lightYears = [5, 2, 1].map((n) => n * power).find((n) => n <= most) ?? power;
  return { lightYears, px: lightYears * pxPerLightYear };
}
