// Looking around: a drag turns the view, two fingers or the wheel change the distance, and so do the keys
// (arrows, plus, minus). It only reports what the player asks for; the app decides what is allowed.
import { SKY } from '../config.ts';

export interface ControlEvents {
  /** Turn by these angles, radians. */
  turn(yaw: number, pitch: number): void;
  /** A finger has begun to drag (it moved farther than a tap may), or an arrow key was pressed: before the first `turn` of it. */
  grab?(): void;
  /** Multiply the distance by this. */
  zoom(factor: number): void;
  /** A short touch that did not drag: where it landed, CSS px from the element's corner. */
  tap?(x: number, y: number): void;
  /** Enter or the space bar: the same as a touch in the middle of the view, for the keyboard. */
  pick?(): void;
}

export function attachControls(el: HTMLElement, events: ControlEvents): () => void {
  const pointers = new Map<number, { x: number; y: number }>();
  const perPixel = () => (SKY.turnDegPerScreen * Math.PI) / 180 / Math.max(1, Math.min(el.clientWidth, el.clientHeight));
  const spread = () => {
    const [a, b] = [...pointers.values()];
    return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
  };

  // A touch that neither dragged nor lasted is a tap; a second finger makes it a pinch, never a tap.
  let touch: { id: number; x: number; y: number; at: number; moved: boolean } | null = null;
  const down = (e: PointerEvent) => {
    touch = pointers.size === 0 ? { id: e.pointerId, x: e.clientX, y: e.clientY, at: e.timeStamp, moved: false } : null;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    el.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent) => {
    const before = pointers.get(e.pointerId);
    if (!before) return;
    const wasApart = spread();
    if (touch && !touch.moved && Math.hypot(e.clientX - touch.x, e.clientY - touch.y) > SKY.pick.tap.slopPx) {
      touch.moved = true;
      events.grab?.();
    }
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) events.turn(-(e.clientX - before.x) * perPixel(), (e.clientY - before.y) * perPixel());
    else if (wasApart > 0 && spread() > 0) events.zoom(wasApart / spread());
  };
  const up = (e: PointerEvent) => {
    pointers.delete(e.pointerId);
    const tapped = touch && touch.id === e.pointerId && e.type === 'pointerup' && !touch.moved && e.timeStamp - touch.at <= SKY.pick.tap.ms;
    touch = null;
    if (tapped && events.tap) {
      const box = el.getBoundingClientRect();
      events.tap(e.clientX - box.left, e.clientY - box.top);
    }
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
    if ((e.key === 'Enter' || e.key === ' ') && events.pick) {
      e.preventDefault();
      events.pick();
      return;
    }
    const action = moves[e.key];
    if (!action) return;
    e.preventDefault();
    if (e.key.startsWith('Arrow')) events.grab?.();
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
