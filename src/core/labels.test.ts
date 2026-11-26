import { describe, expect, it } from 'vitest';
import { SKY } from '../config.ts';
import { project, type Frame } from './dome.ts';
import { markBox, nameBox, placeAround, placeBeside, placeFree, shared, type Box } from './labels.ts';
import { CITIES } from './places.ts';
import { altAz, bodyInSky, bodyMagnitude, skyTurn } from './sky.ts';

const SCREEN: Box = { left: 0, right: 360, top: 0, bottom: 640 };
const GAP = SKY.paint.labelGapPx;
const mark = (x: number, y: number) => ({ x, y, r: SKY.paint.discPx.planet });

describe('a name beside its mark', () => {
  it('stands to the right when nothing is in the way, clear of the mark', () => {
    const m = mark(100, 100);
    const place = placeBeside(m, 40, 14, GAP, [markBox(m)], SCREEN);
    expect(place?.align).toBe('left');
    expect(place && place.x > m.x + m.r).toBe(true);
    expect(place && shared(place.box, markBox(m))).toBe(0);
  });

  it('moves to another side when the right one is taken, and never lies on a name or a mark', () => {
    // Two planets a few px apart, as Mars and Jupiter in a wide view.
    const a = mark(100, 100);
    const b = mark(108, 103);
    const taken = [markBox(a), markBox(b)];
    const first = placeBeside(a, 40, 14, GAP, taken, SCREEN);
    expect(first).not.toBeNull();
    taken.push((first as { box: Box }).box);
    const second = placeBeside(b, 50, 14, GAP, taken, SCREEN);
    expect(second).not.toBeNull();
    for (const other of taken) expect(shared((second as { box: Box }).box, other)).toBe(0);
  });

  it('is written even when every side is taken: on the side that covers the least', () => {
    const m = mark(100, 100);
    const wall: Box = { left: 0, right: 360, top: 0, bottom: 640 };
    expect(placeBeside(m, 40, 14, GAP, [wall], SCREEN)).not.toBeNull();
    const freeBelow = [nameBox(110, 100, 60, 14, GAP), nameBox(30, 100, 60, 14, GAP), nameBox(70, 80, 60, 14, GAP)];
    const place = placeBeside(m, 40, 14, GAP, freeBelow, SCREEN);
    expect(place && place.y > m.y).toBe(true);
  });

  it('keeps on the screen at its edge, and has no place when the mark is far out of sight', () => {
    const atRight = placeBeside(mark(355, 100), 40, 14, GAP, [], SCREEN);
    expect(atRight?.align).toBe('right');
    expect(placeBeside(mark(900, 100), 40, 14, GAP, [], SCREEN)).toBeNull();
  });
});

describe('Mars and Jupiter side by side over Budapest on 27 November 2026', () => {
  // The night of the owner's screenshot: Jupiter's mark stood by Mars with no name of its own.
  const budapest = CITIES.find((city) => city.names.en === 'Budapest');
  const date = new Date('2026-11-27T02:49:00Z');

  it('both names are written, apart from one another and from both marks, in every width of the view', () => {
    expect(budapest).toBeDefined();
    if (!budapest) return;
    const turn = skyTurn(budapest, date);
    const mars = bodyInSky('mars', turn);
    const jupiter = bodyInSky('jupiter', turn);
    const frame: Frame = { cx: 180, cy: 320, half: 180 };
    const towards = altAz(mars);
    for (const fov of [SKY.dome.fov.most, SKY.dome.fov.first, SKY.dome.fov.least]) {
      for (const turnBy of [0, 20, -20]) {
        const look = { azimuth: towards.azimuth + turnBy, altitude: towards.altitude, fov };
        const a = project(look, frame, jupiter);
        const b = project(look, frame, mars);
        expect(a && b).toBeTruthy();
        if (!a || !b) continue;
        const marks = [{ ...a, r: SKY.paint.discPx.planet }, { ...b, r: SKY.paint.discPx.planet }];
        const taken = marks.map(markBox);
        // Jupiter is the brighter and chooses first; a name is some 8 px a letter wide.
        expect(bodyMagnitude('jupiter', date)).toBeLessThan(bodyMagnitude('mars', date));
        const first = placeBeside(marks[0] as (typeof marks)[number], 8 * 7, 14, GAP, taken, SCREEN);
        expect(first).not.toBeNull();
        if (!first) continue;
        taken.push(first.box);
        const second = placeBeside(marks[1] as (typeof marks)[number], 8 * 4, 14, GAP, taken, SCREEN);
        expect(second).not.toBeNull();
        if (!second) continue;
        for (const other of taken) expect(shared(second.box, other), `fov ${fov}, turned ${turnBy}`).toBe(0);
      }
    }
  });

  it('Neptune is too faint for the eye that night and Jupiter is not', () => {
    expect(bodyMagnitude('neptune', date)).toBeGreaterThan(SKY.tonight.eyeMagnitude);
    expect(bodyMagnitude('jupiter', date)).toBeLessThan(SKY.tonight.eyeMagnitude);
  });
});

describe('a name at a point of its own (a constellation at the middle of its figure)', () => {
  const seen: Box = { left: 0, right: 360, top: 0, bottom: 600 };
  const [width, size, gap] = [60, 11, 4];
  const row = size + 2 * gap;

  it('stands on the point when the place is free', () => {
    const place = placeAround(180, 300, width, size, gap, [], seen, 2);
    expect(place).toMatchObject({ x: 180, y: 300, align: 'center' });
  });

  it('moves a row lower when a star\'s name has the place, a row higher when that is taken too', () => {
    const star = nameBox(170, 300, 70, size, gap);
    const lower = placeAround(180, 300, width, size, gap, [star], seen, 2);
    expect(lower?.y).toBe(300 + row);
    expect(shared(lower!.box, star)).toBe(0);
    const higher = placeAround(180, 300, width, size, gap, [star, lower!.box], seen, 2);
    expect(higher?.y).toBe(300 - row);
  });

  it('is left out when every row it may take is taken, and when it would not be seen at all', () => {
    const wall: Box = { left: 100, right: 260, top: 300 - 3 * row, bottom: 300 + 3 * row };
    expect(placeAround(180, 300, width, size, gap, [wall], seen, 2)).toBeNull();
    expect(placeAround(180, -200, width, size, gap, [], seen, 2)).toBeNull();
  });

  it('never lies on what is taken', () => {
    const taken: Box[] = [];
    for (let i = 0; i < 40; i++) {
      const place = placeAround(60 + ((i * 53) % 240), 80 + ((i * 97) % 440), width, size, gap, taken, seen, 2);
      if (!place) continue;
      for (const other of taken) expect(shared(place.box, other)).toBe(0);
      taken.push(place.box);
    }
    expect(taken.length).toBeGreaterThan(10);
  });
});

describe('a name that may be left out (a galaxy, a cluster)', () => {
  const seen: Box = { left: 0, right: 360, top: 0, bottom: 640 };
  const mark = { x: 180, y: 300, r: 6 };
  const width = 60;
  const size = 12;
  const gap = 4;

  it('stands to the right of its mark when that is free, and does not touch the mark', () => {
    const place = placeFree(mark, width, size, gap, [markBox(mark)], seen);
    expect(place?.align).toBe('left');
    expect(shared(place!.box, markBox(mark))).toBe(0);
  });

  it('moves to the left, under, over as the places are taken', () => {
    // Something thin on the mark's own row to the right, then to the left too: a line of a figure, a star's name.
    const atRight: Box = { left: 200, right: 230, top: 298, bottom: 302 };
    const atLeft: Box = { left: 130, right: 160, top: 298, bottom: 302 };
    expect(placeFree(mark, width, size, gap, [atRight], seen)?.align).toBe('right');
    const under = placeFree(mark, width, size, gap, [atRight, atLeft], seen)!;
    expect(under.align).toBe('center');
    expect(under.y).toBeGreaterThan(mark.y);
    const over = placeFree(mark, width, size, gap, [atRight, atLeft, under.box], seen)!;
    expect(over.y).toBeLessThan(mark.y);
  });

  it('is left out when all four places are taken — it never covers another name', () => {
    const all: Box = { left: 0, right: 360, top: 250, bottom: 350 };
    expect(placeFree(mark, width, size, gap, [all], seen)).toBeNull();
  });

  it('a neighbour a pixel into the place to the right is enough to move it', () => {
    const right = placeFree(mark, width, size, gap, [], seen)!;
    const neighbour: Box = { left: right.box.left + 3, right: right.box.right, top: right.box.bottom - 1, bottom: right.box.bottom + 19 };
    expect(placeFree(mark, width, size, gap, [neighbour], seen)?.align).toBe('right');
  });
});
