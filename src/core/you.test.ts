import { describe, expect, it } from 'vitest';
import { SKY } from '../config.ts';
import facts from '../data/facts.json';
import { BODY_IDS } from './bodies.ts';
import { besideFor, diameterRatio, scaleThere, sizeDrawing, typedNumber, yearsThere } from './you.ts';

describe('what if you were here', () => {
  it('counts an age in the planet’s own years from NASA’s lengths of the years', () => {
    // forty Earth years on Mars: forty times the Earth's year over the year of Mars, both from the fact sheet
    expect(yearsThere('mars', 40)).toBeCloseTo((40 * facts.planets.earth.yearDays) / facts.planets.mars.yearDays, 9);
    expect(yearsThere('mercury', 10)).toBeGreaterThan(10);
    expect(yearsThere('neptune', 10)).toBeLessThan(1);
    // the Earth, the Moon and the Sun have no other year to count in
    for (const id of ['earth', 'moon', 'sun'] as const) expect(yearsThere(id, 40)).toBeNull();
  });

  it('says what a scale would show from NASA’s gravities: less on the Moon, more on Jupiter', () => {
    expect(scaleThere('moon', 60)).toBeCloseTo((60 * facts.moon.gravity) / facts.planets.earth.gravity, 9);
    expect(scaleThere('jupiter', 60)).toBeGreaterThan(60);
    expect(scaleThere('mars', 60)).toBeLessThan(60);
    expect(scaleThere('earth', 60)).toBeNull();
    expect(scaleThere('sun', 60)).toBeNull();
  });

  it('takes a typed number with a comma or a point, and nothing else', () => {
    expect(typedNumber('42', 130)).toBe(42);
    expect(typedNumber(' 42,5 ', 130)).toBe(42.5);
    expect(typedNumber('42.5', 130)).toBe(42.5);
    for (const text of ['', ' ', 'abc', '-3', '0', '131', '1e9']) expect(typedNumber(text, 130), text).toBeNull();
  });
});

describe('a body beside the Earth, to one scale', () => {
  it('compares every body with the Earth, and the Earth with the Moon', () => {
    for (const id of BODY_IDS) expect(besideFor(id)).toBe(id === 'earth' ? 'moon' : 'earth');
    expect(diameterRatio('jupiter')).toBeGreaterThan(10);
    expect(diameterRatio('moon')).toBeLessThan(1);
    expect(diameterRatio('earth')).toBeCloseTo(1 / diameterRatio('moon'), 9);
  });

  it('draws the two circles to one scale, standing on one line, the smaller never too small to see', () => {
    const [width, height] = [320, 130];
    for (const id of BODY_IDS) {
      const ratio = diameterRatio(id);
      const { body, other } = sizeDrawing(ratio, width, height);
      expect(body.r / other.r, id).toBeCloseTo(ratio, 6);
      expect(Math.min(body.r, other.r), id).toBeGreaterThanOrEqual(SKY.you.drawing.leastPx - 1e-9);
      // the body on the left, the other on the right, never touching
      expect(body.cx + body.r, id).toBeLessThan(other.cx - other.r);
      // a circle that fits is whole inside the drawing and stands on the common line
      for (const circle of [body, other]) {
        if (circle.r * 2 > height * SKY.you.drawing.mostShare + 1e-9) continue;
        expect(circle.cx - circle.r, id).toBeGreaterThanOrEqual(0);
        expect(circle.cx + circle.r, id).toBeLessThanOrEqual(width);
        expect(circle.cy + circle.r, id).toBeCloseTo(height / 2 + (height * SKY.you.drawing.mostShare) / 2, 6);
      }
    }
    // the Sun is too big for the drawing: an arc, its edge inside the drawing, the Earth whole beside it
    const sun = sizeDrawing(diameterRatio('sun'), width, height);
    expect(sun.body.r * 2).toBeGreaterThan(height);
    expect(sun.body.cx + sun.body.r).toBeGreaterThan(0);
    expect(sun.body.cx + sun.body.r).toBeLessThan(width / 2);
  });
});
