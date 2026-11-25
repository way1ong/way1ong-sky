// Where a name is written on the sky map so that names do not lie on one another. A box is a part of the
// screen in CSS px. A star's name has one place and is left out when the place is taken; a planet's name is
// never left out: it takes the freest of the four places round its mark.

export interface Box {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export type NameAlign = 'left' | 'right' | 'center';

/** A name written at a point: where its text is anchored and the room it takes, the gap round it included. */
export interface NamePlace {
  x: number;
  y: number;
  align: NameAlign;
  box: Box;
}

/** How much of the screen two boxes share, px². */
export function shared(a: Box, b: Box): number {
  const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  return w > 0 && h > 0 ? w * h : 0;
}

const area = (box: Box): number => Math.max(0, box.right - box.left) * Math.max(0, box.bottom - box.top);

/** The room a line of text takes: `y` is its middle, `x` its left end, right end or middle, by `align`. */
export function nameBox(x: number, y: number, width: number, size: number, gap: number, align: NameAlign = 'left'): Box {
  const left = align === 'center' ? x - width / 2 : align === 'right' ? x - width : x;
  return { left: left - gap, right: left + width + gap, top: y - size / 2 - gap, bottom: y + size / 2 + gap };
}

/** The square a round mark takes. */
export function markBox(mark: { x: number; y: number; r: number }): Box {
  return { left: mark.x - mark.r, right: mark.x + mark.r, top: mark.y - mark.r, bottom: mark.y + mark.r };
}

/**
 * The place for a name beside its mark: to the right of it, to the left, under or over — the first place that
 * is free and wholly seen, else the one that covers the least of what is taken and loses the least beyond the
 * edge of what is seen. No place at all (null) only when the name would not be seen in any of the four.
 */
export function placeBeside(mark: { x: number; y: number; r: number }, width: number, size: number, gap: number, taken: readonly Box[], seen: Box): NamePlace | null {
  const off = mark.r + gap + 1;
  const tries: [number, number, NameAlign][] = [
    [mark.x + off, mark.y, 'left'],
    [mark.x - off, mark.y, 'right'],
    [mark.x, mark.y + off + size / 2, 'center'],
    [mark.x, mark.y - off - size / 2, 'center'],
  ];
  let best: NamePlace | null = null;
  let least = Infinity;
  for (const [x, y, align] of tries) {
    const box = nameBox(x, y, width, size, gap, align);
    const inside = shared(box, seen);
    if (inside === 0) continue;
    const cost = area(box) - inside + taken.reduce((sum, other) => sum + shared(box, other), 0);
    if (cost < least) {
      least = cost;
      best = { x, y, align, box };
    }
  }
  return best;
}

/**
 * The place for a name that belongs to a point rather than to a mark (a constellation's, at the middle of its
 * figure): centred on the point, else a row lower, a row higher, and so on up to `rows` rows away — the first
 * place that is free and at least partly seen. No place (null) when all are taken: such a name is left out.
 */
export function placeAround(x: number, y: number, width: number, size: number, gap: number, taken: readonly Box[], seen: Box, rows: number): NamePlace | null {
  const row = size + 2 * gap;
  for (let step = 0; step <= rows; step++) {
    for (const way of step === 0 ? [0] : [1, -1]) {
      const at = y + way * step * row;
      const box = nameBox(x, at, width, size, gap, 'center');
      if (shared(box, seen) > 0 && taken.every((other) => shared(box, other) === 0)) return { x, y: at, align: 'center', box };
    }
  }
  return null;
}
