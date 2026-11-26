// Beyond the Solar System, painted on a flat canvas: NASA's picture of the Milky Way laid in the Galaxy's
// plane, the Sun's mark, the marks of clusters and nebulae on stems over that plane, the photographs of the
// other galaxies, their names and a line that shows the scale. It only paints what it is told: how the model
// is turned, what is in the middle and how much fits the screen.
import { SKY } from '../config.ts';
import { messierName } from '../core/deep-sky.ts';
import { FAR, GALAXIES, MIDDLE, MILKY_WAY, SUN, footOf, marksShown, mergedWithHome, milkyWayPx, pictureLight, pictureOnScreen, projectFar, scaleLine, type FarFrame, type FarView } from '../core/far.ts';
import { markBox, nameBox, shared, type Box, type NameAlign } from '../core/labels.ts';
import picture from '../far/milky-way.webp?url';
import { deepPhotoUrl } from './deep-photo.ts';
import { deepSign } from './deep-signs.ts';
import { deepDistance } from './deep-text.ts';
import type { Dict } from './i18n.ts';

export interface FarPicture {
  view: FarView;
  lang: string;
  d: Dict;
  /** The galaxy flown to, and how much of the way its photograph has grown to its full size, 0…1. */
  arrived: { id: string; share: number } | null;
}

export interface FarViewPort {
  draw(picture: FarPicture): void;
  resize(): void;
  /** How much of the canvas the bars cover at the top and at the bottom, CSS px: the model centres between them. */
  setCovered(top: number, bottom: number): void;
  /** The part of the canvas the model is centred on. */
  frame(): FarFrame;
  /** Called when a picture has come and the canvas should be painted again. */
  onLoad: () => void;
}

type Colours = Record<'bg' | 'text' | 'muted' | 'line' | 'deep' | 'sun', string>;

export function createFarView(canvas: HTMLCanvasElement): FarViewPort {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  let covered = { top: 0, bottom: 0 };
  let colours: Colours | null = null;
  const port: FarViewPort = { draw, resize, setCovered, frame, onLoad: () => undefined };

  // The pictures are fetched when the model is first painted, not when the app starts.
  const images = new Map<string, HTMLImageElement>();
  function image(url: string | undefined): HTMLImageElement | null {
    if (!url) return null;
    let img = images.get(url);
    if (!img) {
      img = new Image();
      img.decoding = 'async';
      img.addEventListener('load', () => port.onLoad());
      img.src = url;
      images.set(url, img);
    }
    return img.complete && img.naturalWidth > 0 ? img : null;
  }

  function palette(): Colours {
    if (colours) return colours;
    const css = getComputedStyle(canvas);
    const get = (name: string) => css.getPropertyValue(name).trim();
    colours = { bg: get('--bg'), text: get('--text'), muted: get('--muted'), line: get('--line'), deep: get('--deep'), sun: get('--sun') };
    return colours;
  }

  let ratio = 1;
  function resize(): void {
    ratio = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.round(canvas.clientWidth * ratio);
    const height = Math.round(canvas.clientHeight * ratio);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function frame(): FarFrame {
    const width = canvas.clientWidth;
    const free = Math.max(1, canvas.clientHeight - covered.top - covered.bottom);
    return { cx: width / 2, cy: covered.top + free / 2, half: Math.max(1, Math.min(width, free) / 2) };
  }

  function draw({ view, lang, d, arrived }: FarPicture): void {
    resize();
    const c = palette();
    const f = frame();
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const far = SKY.far;
    const family = getComputedStyle(canvas).fontFamily;
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, width, height);

    // ---------- the Milky Way: a flat picture in the Galaxy's plane ----------
    const milkyWay = image(picture);
    if (milkyWay) {
      ctx.save();
      // Light is added to the dark of space: the black round the picture leaves no edge.
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = pictureLight(view, f);
      ctx.transform(...pictureOnScreen(view, f));
      ctx.drawImage(milkyWay, 0, 0, MILKY_WAY.width, MILKY_WAY.height);
      ctx.restore();
    }

    const seen: Box = { left: 4, right: width - 4, top: covered.top + 2, bottom: height - covered.bottom - 2 };
    // The scale line at the bottom keeps its place: no name is written over it.
    const line = scaleLine(view, f, Math.min(140, width * 0.4));
    const lineY = height - covered.bottom - 12;
    const words = deepDistance(d, lang, line.lightYears);
    ctx.font = `600 12px ${family}`;
    const lineHalf = Math.max(line.px, ctx.measureText(words).width) / 2 + 6;
    /** Where names are written, and where marks stand: a name avoids both, but a name that must be there avoids only names. */
    const written: Box[] = [{ left: f.cx - lineHalf, right: f.cx + lineHalf, top: lineY - 26, bottom: lineY + 4 }];
    const taken: Box[] = [];
    /** A name beside its mark: to the right, to the left, under or over — the first place that is free and wholly seen. */
    const name = (text: string, mark: { x: number; y: number; r: number }, colour: string, size: number, weight: number, must = false): void => {
      ctx.font = `${weight} ${size}px ${family}`;
      const wide = ctx.measureText(text).width;
      const off = mark.r + 5;
      const tries: [number, number, NameAlign][] = [
        [mark.x + off, mark.y, 'left'],
        [mark.x - off, mark.y, 'right'],
        [mark.x, mark.y + off + size / 2, 'center'],
        [mark.x, mark.y - off - size / 2, 'center'],
      ];
      for (const [x, y, align] of tries) {
        const box = nameBox(x, y, wide, size, 4, align);
        if (box.left < seen.left || box.right > seen.right || box.top < seen.top || box.bottom > seen.bottom) continue;
        if (!written.every((other) => shared(box, other) === 0)) continue;
        if (!must && !taken.every((other) => shared(box, other) === 0)) continue;
        written.push(box);
        ctx.textAlign = align;
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.strokeStyle = c.bg;
        ctx.globalAlpha = 0.75;
        ctx.strokeText(text, x, y);
        ctx.globalAlpha = 1;
        ctx.fillStyle = colour;
        ctx.fillText(text, x, y);
        return;
      }
    };
    const onScreen = (p: { x: number; y: number }, r: number) => p.x > -r && p.x < width + r && p.y > -r && p.y < height + r;
    const names = d.sky.deep.names as Record<string, string>;

    // ---------- inside the Galaxy: the Sun, clusters and nebulae ----------
    const marks = marksShown(view, f);
    if (marks) {
      const sun = projectFar(SUN, view, f);
      const middle = projectFar(MIDDLE, view, f);
      const shown = FAR.filter((o) => !o.galaxy).map((o) => ({ o, p: projectFar(o.at, view, f), foot: projectFar(footOf(o.at), view, f) }));
      for (const { p } of shown) taken.push(markBox({ x: p.x, y: p.y, r: far.markPx }));
      taken.push(markBox({ x: sun.x, y: sun.y, r: far.sunPx + 2 }));
      // The stems: how high over the plane of the Galaxy, or how deep under it, a thing stands.
      ctx.lineWidth = 1;
      ctx.strokeStyle = c.muted;
      ctx.fillStyle = c.muted;
      for (const { p, foot } of shown) {
        if (Math.hypot(p.x - foot.x, p.y - foot.y) < far.stemFromPx) continue;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.moveTo(foot.x, foot.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(foot.x, foot.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = c.deep;
      for (const { o, p } of shown) if (onScreen(p, far.markPx)) deepSign[o.object.kind](ctx, p.x, p.y, far.markPx);
      // The Sun: a dot in a ring.
      ctx.fillStyle = c.sun;
      ctx.strokeStyle = c.sun;
      ctx.beginPath();
      ctx.arc(sun.x, sun.y, far.sunPx, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sun.x, sun.y, far.sunPx + 4, 0, Math.PI * 2);
      ctx.stroke();
      if (onScreen(sun, 0)) name(d.far.sun, { ...sun, r: far.sunPx + 4 }, c.sun, 13, 700, true);
      if (onScreen(middle, 0)) name(d.far.middle, { ...middle, r: 2 }, c.text, 12, 600, true);
      // Brightest first, as on the sky map: where two names would meet, the brighter object keeps its name.
      for (const { o, p } of [...shown].sort((a, b) => a.o.object.mag - b.o.object.mag)) {
        if (onScreen(p, 0)) name(names[o.object.id] ?? messierName(o.object), { ...p, r: far.markPx }, c.deep, 12, 500);
      }
    } else {
      const middle = projectFar(MIDDLE, view, f);
      const r = Math.max(far.thumbPx, milkyWayPx(view, f)) / 2;
      if (onScreen(middle, r)) {
        taken.push(markBox({ x: middle.x, y: middle.y, r: r * 0.7 }));
        const company = GALAXIES.some((o) => o.object.id !== arrived?.id && mergedWithHome(o, view, f));
        name(company ? d.far.milkyWayAndNear : d.far.milkyWay, { ...middle, r: r * 0.7 }, c.sun, 13, 700, true);
      }
    }

    // ---------- the other galaxies: photographs that face the viewer, farthest first ----------
    const full = far.arrivedShare * 2 * f.half;
    const galaxies = GALAXIES.filter((o) => o.object.id === arrived?.id || !mergedWithHome(o, view, f)).map((o) => {
      const share = arrived?.id === o.object.id ? arrived.share : 0;
      return { o, p: projectFar(o.at, view, f), size: far.thumbPx + (full - far.thumbPx) * share, share };
    }).sort((a, b) => a.share - b.share || a.p.depth - b.p.depth);
    for (const { p, size } of galaxies) if (onScreen(p, size / 2)) taken.push(markBox({ x: p.x, y: p.y, r: size / 2 }));
    for (const { o, p, size } of galaxies) {
      if (!onScreen(p, size / 2)) continue;
      const photo = image(deepPhotoUrl(o.object.id));
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = c.bg;
      ctx.fill();
      if (photo) {
        ctx.clip();
        // The photograph covers the circle: its shorter side fills it.
        const k = size / Math.min(photo.naturalWidth, photo.naturalHeight);
        ctx.drawImage(photo, p.x - (photo.naturalWidth * k) / 2, p.y - (photo.naturalHeight * k) / 2, photo.naturalWidth * k, photo.naturalHeight * k);
      } else {
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = c.deep;
        deepSign.galaxy(ctx, p.x, p.y, far.markPx);
      }
      ctx.restore();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = c.line;
      ctx.beginPath();
      ctx.arc(p.x, p.y, size / 2, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (const { o, p, size } of galaxies.reverse()) {
      if (onScreen(p, 0)) name(names[o.object.id] ?? messierName(o.object), { ...p, r: size / 2 }, c.text, 13, 650);
    }

    // ---------- the scale: a line of a round length ----------
    const y = lineY;
    const x = f.cx - line.px / 2;
    ctx.strokeStyle = c.text;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y - 5);
    ctx.lineTo(x, y);
    ctx.lineTo(x + line.px, y);
    ctx.lineTo(x + line.px, y - 5);
    ctx.stroke();
    ctx.font = `600 12px ${family}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = c.bg;
    ctx.strokeText(words, f.cx, y - 9);
    ctx.fillStyle = c.text;
    ctx.fillText(words, f.cx, y - 9);
  }

  function setCovered(top: number, bottom: number): void {
    covered = { top, bottom };
  }

  return port;
}
