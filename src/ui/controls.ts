// Looking around: a drag turns the view, two fingers or the wheel change the distance, and so do the keys
// (arrows, plus, minus). It only reports what the player asks for; the app decides what is allowed.
import { SKY } from '../config.ts';

export interface ControlEvents {
  /** Turn by these angles, radians. */
  turn(yaw: number, pitch: number): void;
  /** Multiply the distance by this. */
  zoom(factor: number): void;
}

export function attachControls(el: HTMLElement, events: ControlEvents): () => void {
  const pointers = new Map<number, { x: number; y: number }>();
  const perPixel = () => (SKY.turnDegPerScreen * Math.PI) / 180 / Math.max(1, Math.min(el.clientWidth, el.clientHeight));
  const spread = () => {
    const [a, b] = [...pointers.values()];
    return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
  };

  const down = (e: PointerEvent) => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    el.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent) => {
    const before = pointers.get(e.pointerId);
    if (!before) return;
    const wasApart = spread();
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) events.turn(-(e.clientX - before.x) * perPixel(), (e.clientY - before.y) * perPixel());
    else if (wasApart > 0 && spread() > 0) events.zoom(wasApart / spread());
  };
  const up = (e: PointerEvent) => {
    pointers.delete(e.pointerId);
  };
  const wheel = (e: WheelEvent) => {
    e.preventDefault();
    events.zoom(e.deltaY > 0 ? SKY.zoomStep : 1 / SKY.zoomStep);
  };
  const key = (e: KeyboardEvent) => {
    const step = (10 * Math.PI) / 180;
    const moves: Record<string, () => void> = {
      ArrowLeft: () => events.turn(-step, 0),
      ArrowRight: () => events.turn(step, 0),
      ArrowUp: () => events.turn(0, step),
      ArrowDown: () => events.turn(0, -step),
      '+': () => events.zoom(1 / SKY.zoomStep),
      '=': () => events.zoom(1 / SKY.zoomStep),
      '-': () => events.zoom(SKY.zoomStep),
    };
    const action = moves[e.key];
    if (!action) return;
    e.preventDefault();
    action();
  };

  el.addEventListener('pointerdown', down);
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
  el.addEventListener('wheel', wheel, { passive: false });
  el.addEventListener('keydown', key);
  return () => {
    el.removeEventListener('pointerdown', down);
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerup', up);
    el.removeEventListener('pointercancel', up);
    el.removeEventListener('wheel', wheel);
    el.removeEventListener('keydown', key);
  };
}
