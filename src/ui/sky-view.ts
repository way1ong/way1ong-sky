// The sky from a place, painted on a flat canvas: the ground and the horizon with the points of the compass,
// the figures of the constellations, the stars, the Sun, the Moon and the planets, and their names. It only
// paints what it is told: where the view looks, how the sky is turned, which layers are on.
import { SKY } from '../config.ts';
import { horizonOnScreen, project, skyDirection, type Frame, type Look } from '../core/dome.ts';
import { moonLitFraction } from '../core/ephemeris.ts';
import { SKY_BODY_IDS, altAz, bodyInSky, toSky, type SkyBodyId, type SkyTurn } from '../core/sky.ts';
import { FIGURES, NAMED_STARS, STARS, STARS_LIMIT, starName } from '../core/stars.ts';
import type { Vec3 } from '../core/vec.ts';
import type { Dict } from './i18n.ts';

export interface SkyLayers {
  figures: boolean;
  names: boolean;
}

export interface SkyPicture {
  look: Look;
  turn: SkyTurn;
  layers: SkyLayers;
  lang: string;
  d: Dict;
}

export interface SkyView {
  draw(picture: SkyPicture): void;
  resize(): void;
  /** How much of the canvas the bars cover at the top and at the bottom, CSS px: the sky centres between them. */
  setCovered(top: number, bottom: number): void;
  /** The part of the canvas the sky is centred on. */
  frame(): Frame;
  /** The colours have changed (night mode): read them again. */
  restyle(): void;
}

const COMPASS = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'] as const;

type Colours = Record<'night' | 'day' | 'ground' | 'horizon' | 'star' | 'figure' | 'figureName' | 'sun' | 'moon' | 'planet' | 'text' | 'muted' | 'bg', string>;

/** "#rrggbb" as numbers, to mix two colours. */
function rgb(hex: string): [number, number, number] {
  const h = hex.trim().replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
type Rgb = [number, number, number];
/** A colour between two, as numbers — and as the canvas wants it written. */
const blend = (a: Rgb, b: Rgb, t: number): Rgb => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const written = (colour: Rgb): string => `rgb(${colour.map(Math.round).join(' ')})`;
const mix = (a: string, b: string, t: number): string => written(blend(rgb(a), rgb(b), t));
const between = (t: number) => Math.max(0, Math.min(1, t));

export function createSkyView(canvas: HTMLCanvasElement): SkyView {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  let covered = { top: 0, bottom: 0 };
  let colours: Colours | null = null;
  // The stars in the sky of the place: worked out once for a turn of the sky, not for every frame of a drag.
  let turnedFor: SkyTurn | null = null;
  const inSky: Vec3[] = [];

  function palette(): Colours {
    if (colours) return colours;
    const css = getComputedStyle(canvas);
    const get = (name: string) => css.getPropertyValue(name).trim();
    colours = {
      night: get('--sky-night'),
      day: get('--sky-day'),
      ground: get('--ground'),
      horizon: get('--horizon'),
      star: get('--star'),
      figure: get('--figure'),
      figureName: get('--figure-name'),
      sun: get('--sun'),
      moon: get('--moon'),
      planet: get('--planet'),
      text: get('--text'),
      muted: get('--muted'),
      bg: get('--bg'),
    };
    return colours;
  }

  function resize(): void {
    const ratio = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.round(canvas.clientWidth * ratio);
    const height = Math.round(canvas.clientHeight * ratio);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function frame(): Frame {
    const width = canvas.clientWidth;
    const free = Math.max(1, canvas.clientHeight - covered.top - covered.bottom);
    return { cx: width / 2, cy: covered.top + free / 2, half: Math.max(1, Math.min(width, free) / 2) };
  }

  function draw(picture: SkyPicture): void {
    resize();
    const { look, turn, layers, d, lang } = picture;
    const c = palette();
    const f = frame();
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const paint = SKY.paint;

    if (turnedFor !== turn) {
      turnedFor = turn;
      STARS.forEach((star, i) => (inSky[i] = toSky(turn, star.at)));
    }
    const bodies = SKY_BODY_IDS.map((id) => ({ id, sky: bodyInSky(id, turn) }));
    const sunHeight = altAz((bodies.find((b) => b.id === 'sun') as { sky: Vec3 }).sky).altitude;
    const day = between((sunHeight - paint.daylight.from) / (paint.daylight.to - paint.daylight.from));
    const starStrength = 1 - (1 - paint.daylight.starsLeft) * day;
    // How narrow the view is, 0 (widest) … 1 (narrowest): the nearer, the more is shown.
    const near = between((SKY.dome.fov.most - look.fov) / (SKY.dome.fov.most - SKY.dome.fov.least));

    // ---------- the sky ----------
    ctx.fillStyle = mix(c.night, c.day, day);
    ctx.fillRect(0, 0, width, height);

    // ---------- the figures ----------
    if (layers.figures) {
      ctx.strokeStyle = c.figure;
      ctx.globalAlpha = 0.75 * (0.35 + 0.65 * starStrength);
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const figure of Object.values(FIGURES)) {
        for (const [a, b] of figure) {
          const p = project(look, f, inSky[a] as Vec3);
          const q = project(look, f, inSky[b] as Vec3);
          if (!p || !q) continue;
          if ((p.x < 0 && q.x < 0) || (p.x > width && q.x > width) || (p.y < 0 && q.y < 0) || (p.y > height && q.y > height)) continue;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
        }
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // ---------- the stars ----------
    const faintest = paint.faintest.wide + (paint.faintest.narrow - paint.faintest.wide) * near;
    ctx.fillStyle = c.star;
    for (let i = 0; i < STARS.length; i++) {
      const star = STARS[i] as (typeof STARS)[number];
      if (star.mag > faintest) break;
      const p = project(look, f, inSky[i] as Vec3);
      if (!p || p.x < -4 || p.y < -4 || p.x > width + 4 || p.y > height + 4) continue;
      const share = between((star.mag - paint.star.brightMag) / (STARS_LIMIT - paint.star.brightMag));
      const radius = paint.star.brightPx + (paint.star.faintPx - paint.star.brightPx) * Math.sqrt(share);
      ctx.globalAlpha = starStrength * (0.55 + 0.45 * (1 - share));
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ---------- the Sun, the Moon, the planets ----------
    const marks: { x: number; y: number; r: number; name: string; rank: number }[] = [];
    for (const { id, sky } of bodies) {
      const p = project(look, f, sky);
      if (!p) continue;
      const r = id === 'sun' ? paint.discPx.sun : id === 'moon' ? paint.discPx.moon : paint.discPx.planet;
      if (id === 'moon') {
        // The Moon shows its phase: the lit part is turned to the Sun, as wide as the engine says it is lit.
        const sun = (bodies.find((b) => b.id === 'sun') as { sky: Vec3 }).sky;
        const along = sun[0] * sky[0] + sun[1] * sky[1] + sun[2] * sky[2];
        // A short step from the Moon towards the Sun across the sky: its direction on the screen.
        const step: Vec3 = [sky[0] + 0.02 * (sun[0] - along * sky[0]), sky[1] + 0.02 * (sun[1] - along * sky[1]), sky[2] + 0.02 * (sun[2] - along * sky[2])];
        const l = Math.hypot(...step);
        const q = project(look, f, [step[0] / l, step[1] / l, step[2] / l]);
        const lit = moonLitFraction(turn.date);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(q ? Math.atan2(q.y - p.y, q.x - p.x) : 0);
        // The unlit part is a little lighter than the sky of the moment, by day as by night.
        ctx.fillStyle = written(blend(blend(rgb(c.night), rgb(c.day), day), rgb(c.moon), 0.22));
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = c.moon;
        ctx.beginPath();
        ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2);
        ctx.ellipse(0, 0, r * Math.abs(1 - 2 * lit), r, 0, Math.PI / 2, -Math.PI / 2, lit < 0.5);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = id === 'sun' ? c.sun : c.planet;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      marks.push({ x: p.x, y: p.y, r, name: d.bodies[id as SkyBodyId], rank: 0 });
    }

    // ---------- the ground and the horizon ----------
    const horizon = horizonOnScreen(look, f);
    ctx.fillStyle = c.ground;
    ctx.globalAlpha = 0.93;
    ctx.beginPath();
    if (horizon.kind === 'line') {
      ctx.rect(0, horizon.y, width, Math.max(0, height - horizon.y));
      ctx.fill();
    } else if (horizon.skyInside) {
      ctx.rect(0, 0, width, height);
      ctx.arc(horizon.cx, horizon.cy, horizon.r, 0, Math.PI * 2);
      ctx.fill('evenodd');
    } else {
      ctx.arc(horizon.cx, horizon.cy, horizon.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = c.horizon;
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (horizon.kind === 'line') {
      ctx.moveTo(0, horizon.y);
      ctx.lineTo(width, horizon.y);
    } else {
      ctx.arc(horizon.cx, horizon.cy, horizon.r, 0, Math.PI * 2);
    }
    ctx.stroke();

    // ---------- names: what is nearer to the top of this list is written first and keeps its place ----------
    const taken: { left: number; right: number; top: number; bottom: number }[] = [];
    const write = (text: string, x: number, y: number, colour: string, size: number, weight: number, align: CanvasTextAlign = 'left'): void => {
      ctx.font = `${weight} ${size}px ${getComputedStyle(canvas).fontFamily}`;
      const w = ctx.measureText(text).width;
      const left = align === 'center' ? x - w / 2 : x;
      const box = { left: left - paint.labelGapPx, right: left + w + paint.labelGapPx, top: y - size / 2 - paint.labelGapPx, bottom: y + size / 2 + paint.labelGapPx };
      if (box.right < 0 || box.left > width || box.bottom < covered.top || box.top > height - covered.bottom) return;
      if (taken.some((t) => box.left < t.right && box.right > t.left && box.top < t.bottom && box.bottom > t.top)) return;
      taken.push(box);
      ctx.textAlign = align;
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 3;
      ctx.strokeStyle = c.bg;
      ctx.globalAlpha = 0.7;
      ctx.strokeText(text, x, y);
      ctx.globalAlpha = 1;
      ctx.fillStyle = colour;
      ctx.fillText(text, x, y);
    };

    // The points of the compass sit on the horizon.
    COMPASS.forEach((key, i) => {
      const p = project(look, f, skyDirection(i * 45, 0));
      if (p) write(d.sky.compass[key], p.x, p.y + 14, i % 2 === 0 ? c.text : c.muted, i % 2 === 0 ? 15 : 12, 700, 'center');
    });
    for (const mark of marks) write(mark.name, mark.x + mark.r + 5, mark.y, c.text, 14, 650);
    if (layers.names) {
      const named = paint.named.wide + (paint.named.narrow - paint.named.wide) * near;
      for (const i of NAMED_STARS) {
        const star = STARS[i] as (typeof STARS)[number];
        if (star.mag > named) continue;
        const sky = inSky[i] as Vec3;
        if (sky[2] < 0) continue;
        const p = project(look, f, sky);
        const name = starName(i, lang);
        if (p && name) write(name, p.x + 6, p.y, c.muted, 12, 500);
      }
    }
    if (layers.figures && layers.names) {
      for (const [id, figure] of Object.entries(FIGURES)) {
        const ends = [...new Set(figure.flat())];
        if (ends.length === 0) continue;
        const middle = ends.reduce<[number, number, number]>((sum, i) => [sum[0] + (inSky[i] as Vec3)[0], sum[1] + (inSky[i] as Vec3)[1], sum[2] + (inSky[i] as Vec3)[2]], [0, 0, 0]);
        const l = Math.hypot(...middle) || 1;
        const sky: Vec3 = [middle[0] / l, middle[1] / l, middle[2] / l];
        if (sky[2] < 0) continue;
        const p = project(look, f, sky);
        const name = (d.sky.constellations as Record<string, string>)[id];
        if (p && name) write(name.toLocaleUpperCase(lang), p.x, p.y, c.figureName, 11, 650, 'center');
      }
    }
  }

  function setCovered(top: number, bottom: number): void {
    covered = { top, bottom };
  }

  function restyle(): void {
    colours = null;
  }

  return { draw, resize, setCovered, frame, restyle };
}
