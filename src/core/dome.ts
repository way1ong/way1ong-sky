// The sky as it is seen from inside: the view looks along a bearing and a height over the horizon, and a
// direction in the sky ([east, north, up]) falls on a flat screen. The projection is the stereographic one
// of star charts: it keeps the shapes of the constellations however wide the view is.
import { SKY } from '../config.ts';
import type { Vec3 } from './vec.ts';

export interface Look {
  /** Where the middle of the view points: the compass bearing (north 0, east 90) and the height, degrees. */
  azimuth: number;
  altitude: number;
  /** How wide the view is across the shorter side of the screen, degrees. */
  fov: number;
}

/** The part of the screen the sky is drawn on: its middle and half of its shorter side, CSS pixels. */
export interface Frame {
  cx: number;
  cy: number;
  half: number;
}

const RAD = Math.PI / 180;

export function firstLook(): Look {
  return { ...SKY.dome.firstLook, fov: SKY.dome.fov.first };
}

/** The direction in the sky of a bearing and a height. */
export function skyDirection(azimuth: number, altitude: number): Vec3 {
  const az = azimuth * RAD;
  const alt = altitude * RAD;
  return [Math.cos(alt) * Math.sin(az), Math.cos(alt) * Math.cos(az), Math.sin(alt)];
}

/** How many pixels from the middle a point lies that is `angle` degrees off the middle of the view. */
function reach(look: Look, frame: Frame, angle: number): number {
  return (frame.half * Math.tan((angle * RAD) / 2)) / Math.tan((look.fov * RAD) / 4);
}

/**
 * Where a direction in the sky is on the screen; null — too far behind the view to be drawn. Seen from
 * inside, east is to the left when one looks south.
 */
export function project(look: Look, frame: Frame, sky: Vec3): { x: number; y: number } | null {
  const az = look.azimuth * RAD;
  const alt = look.altitude * RAD;
  // The view's own axes: forward, to the right along the horizon, and up across the view.
  const fx = Math.cos(alt) * Math.sin(az);
  const fy = Math.cos(alt) * Math.cos(az);
  const fz = Math.sin(alt);
  const rx = Math.cos(az);
  const ry = -Math.sin(az);
  const ux = -Math.sin(alt) * Math.sin(az);
  const uy = -Math.sin(alt) * Math.cos(az);
  const uz = Math.cos(alt);
  const forward = sky[0] * fx + sky[1] * fy + sky[2] * fz;
  if (forward < SKY.dome.behind) return null;
  const right = sky[0] * rx + sky[1] * ry;
  const up = sky[0] * ux + sky[1] * uy + sky[2] * uz;
  const k = frame.half / (1 + forward) / Math.tan((look.fov * RAD) / 4);
  return { x: frame.cx + right * k, y: frame.cy - up * k };
}

/** A drag: the sky follows the finger. Looking straight up or down the bearing still turns. */
export function turnLook(look: Look, dxPx: number, dyPx: number, frame: Frame): Look {
  // Degrees a pixel spans in the middle of the view.
  const perPx = (2 * Math.tan((look.fov * RAD) / 4)) / frame.half / RAD;
  const azimuth = (((look.azimuth - dxPx * perPx) % 360) + 360) % 360;
  return { ...look, azimuth, altitude: Math.max(-90, Math.min(90, look.altitude + dyPx * perPx)) };
}

/** Nearer (a factor below one) or wider, within what the screen can show well. */
export function zoomLook(look: Look, factor: number): Look {
  return { ...look, fov: Math.max(SKY.dome.fov.least, Math.min(SKY.dome.fov.most, look.fov * factor)) };
}

/**
 * The horizon on the screen. In this projection it is a circle (seen from inside when the view looks up,
 * from outside when it looks down) or, when the view looks level, a straight line through the middle.
 */
export function horizonOnScreen(look: Look, frame: Frame): { kind: 'line'; y: number } | { kind: 'circle'; cx: number; cy: number; r: number; skyInside: boolean } {
  const scale = frame.half / Math.tan((look.fov * RAD) / 4);
  const a = look.altitude * RAD;
  if (Math.abs(look.altitude) < 0.05) return { kind: 'line', y: frame.cy + scale * Math.tan(a / 2) };
  // The horizon ahead and the horizon behind the back both lie on the screen's upright axis.
  const ahead = frame.cy + scale * Math.tan(a / 2);
  const behind = frame.cy - scale / Math.tan(a / 2);
  return { kind: 'circle', cx: frame.cx, cy: (ahead + behind) / 2, r: Math.abs(ahead - behind) / 2, skyInside: look.altitude > 0 };
}

export { reach };
