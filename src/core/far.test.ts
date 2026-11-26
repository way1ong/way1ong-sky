import { Constellation } from 'astronomy-engine';
import { describe, expect, it } from 'vitest';
import { SKY } from '../config.ts';
import { DEEP } from './deep-sky.ts';
import { FAR, GALAXIES, MIDDLE, MILKY_WAY, RUNGS, SUN, arrivedAt, clampSpan, enlarged, farAt, farAxes, farById, farFlightAt, firstFarView, footOf, fromGalactic, galactic, longLat, marksShown, mergedWithHome, milkyWayPx, pictureLight, pictureOnScreen, pictureToModel, projectFar, rungLook, rungMembers, rungOf, scaleLine, turnFar, zoomFar, type FarFrame, type FarView } from './far.ts';
import { starDirection } from './sky.ts';
import { cross, dot, length, sub, type Vec3 } from './vec.ts';

const frame: FarFrame = { cx: 195, cy: 400, half: 180 };
const fromAbove = (rung: (typeof RUNGS)[number]): FarView => ({ ...firstFarView(rung), pitch: Math.PI / 2 });
const degrees = (a: Vec3, b: Vec3) => (Math.acos(Math.min(1, dot(a, b) / (length(a) * length(b)))) * 180) / Math.PI;

describe('the axes of the Galaxy', () => {
  // Wikipedia, "Galactic coordinate system" (revision 1342140023): "Radio source Sagittarius A*, which is the
  // best physical marker of the true Galactic Center, is located at 17h 45m 40.0409s, −29° 00′ 28.118″
  // (J2000) … there is an offset of about 0.07° from the defined coordinate center".
  it('longitude 0° points at the middle of the Galaxy', () => {
    const ra = (17 + 45 / 60 + 40.0409 / 3600) * 15;
    const dec = -(29 + 0 / 60 + 28.118 / 3600);
    const offset = degrees(galactic(starDirection(ra, dec)), [1, 0, 0]);
    expect(offset).toBeLessThan(0.1);
    expect(offset).toBeGreaterThan(0.04);
  });

  // The same article: "the north galactic pole is defined at … in the constellation Coma Berenices".
  it('the north pole of the Galaxy lies in Coma Berenices', () => {
    const [x, y, z] = fromGalactic([0, 0, 1]);
    const ra = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
    expect(Constellation(ra / 15, (Math.asin(z) * 180) / Math.PI).symbol).toBe('Com');
  });

  it('are three axes at right angles, turned the same way as the axes of the catalogues', () => {
    const [x, y, z] = [galactic([1, 0, 0]), galactic([0, 1, 0]), galactic([0, 0, 1])];
    expect(dot(x, y)).toBeCloseTo(0, 12);
    expect(length(x)).toBeCloseTo(1, 12);
    expect(dot(cross(x, y), z)).toBeCloseTo(1, 12);
    const back = fromGalactic(galactic([0.3, -0.5, 0.81]));
    expect(back[0]).toBeCloseTo(0.3, 12);
    expect(back[2]).toBeCloseTo(0.81, 12);
  });

  it('gives longitude and latitude', () => {
    expect(longLat([0, 1, 0]).longitude).toBeCloseTo(90);
    expect(longLat([-1, 0, 0]).longitude).toBeCloseTo(180);
    expect(longLat([1, 0, 1]).latitude).toBeCloseTo(45);
  });
});

describe('the picture of the Milky Way', () => {
  // NASA, science.nasa.gov/universe/galaxies: "a spiral galaxy with a disk of stars spanning more than
  // 100,000 light-years. Earth is located along one of the galaxy's spiral arms, about halfway from the center."
  it('is wider than the disk NASA speaks of, and has the Sun about halfway from the middle', () => {
    expect(MILKY_WAY.lightYears).toBeGreaterThan(100_000);
    expect(MILKY_WAY.lightYears).toBeLessThan(160_000);
    const share = length(MIDDLE) / 50_000;
    expect(share).toBeGreaterThan(0.4);
    expect(share).toBeLessThan(0.65);
  });

  it('has the Sun at the start of the model and the middle straight up from it', () => {
    const sun = pictureToModel(MILKY_WAY.sun[0], MILKY_WAY.sun[1]);
    expect(length(sun)).toBeCloseTo(0, 6);
    // up in the picture is towards longitude 0°, left is towards 90°
    expect(longLat(pictureToModel(MILKY_WAY.sun[0], 0)).longitude).toBeCloseTo(0);
    expect(longLat(pictureToModel(0, MILKY_WAY.sun[1])).longitude).toBeCloseTo(90);
    expect(MIDDLE[1]).toBe(0);
    expect(MIDDLE[0]).toBeGreaterThan(0);
  });

  it('names its record and whose it is', () => {
    expect(MILKY_WAY.source.page).toBe(`https://images.nasa.gov/details/${MILKY_WAY.source.nasaId}`);
    expect(MILKY_WAY.source.credit).toContain('NASA');
    expect(MILKY_WAY.source.rules).toMatch(/^https:\/\/www\.nasa\.gov\//);
  });
});

describe('the objects in the model', () => {
  it('are all there, each as far from the Sun as NASA says', () => {
    expect(FAR).toHaveLength(DEEP.length);
    for (const o of FAR) expect(length(o.at) / o.object.lightYears).toBeCloseTo(1, 9);
    expect(farById('m31')?.galaxy).toBe(true);
    expect(farById('m45')?.galaxy).toBe(false);
    expect(GALAXIES.map((o) => o.object.id)).toEqual(['m31', 'm33', 'm81', 'm104', 'm51']);
  });

  // NASA, the same page: the band of the Milky Way in the sky "marks the central disk of our home galaxy seen
  // edge on" — the nebulae and the open clusters belong to that disk, the globular clusters do not.
  it('have the nebulae and open clusters by the plane of the Galaxy, and globular clusters far from it', () => {
    for (const o of FAR) {
      if (o.object.kind === 'nebula' || o.object.kind === 'open') expect(Math.abs(o.at[2]), o.object.id).toBeLessThan(2000);
    }
    const high = FAR.filter((o) => o.object.kind === 'globular' && Math.abs(o.at[2]) > 5000);
    expect(high.length).toBeGreaterThanOrEqual(5);
  });

  it('have every part of our Galaxy inside its picture, and every other galaxy far outside', () => {
    for (const o of FAR) {
      const fromMiddle = length(sub(o.at, MIDDLE));
      if (o.galaxy) expect(fromMiddle, o.object.id).toBeGreaterThan(MILKY_WAY.lightYears * 10);
      else expect(fromMiddle, o.object.id).toBeLessThan(MILKY_WAY.lightYears / 2);
    }
  });

  it('gives the foot of a point on the plane', () => {
    expect(footOf([3, 4, 5])).toEqual([3, 4, 0]);
  });
});

describe('the ladder', () => {
  it('has four rungs, each wider than the one before', () => {
    expect(RUNGS).toEqual(['near', 'galaxy', 'group', 'far']);
    const spans = RUNGS.map((rung) => rungLook(rung).span);
    for (let i = 1; i < spans.length; i++) expect(spans[i]! / spans[i - 1]!).toBeGreaterThan(3);
    for (const rung of RUNGS) expect(rungOf(rungLook(rung).span)).toBe(rung);
    expect(rungOf(rungLook('galaxy').span * 1.5)).toBe('galaxy');
  });

  it('knows what each rung holds', () => {
    expect(rungMembers('near').every((o) => !o.galaxy && o.object.lightYears <= SKY.far.nearLightYears)).toBe(true);
    expect(rungMembers('near').length).toBeGreaterThan(8);
    expect(rungMembers('galaxy')).toHaveLength(FAR.length - GALAXIES.length);
    expect(rungMembers('group').map((o) => o.object.id)).toEqual(['m31', 'm33']);
    expect(rungMembers('far')).toHaveLength(GALAXIES.length);
  });

  it('fits everything a rung holds on the screen, however the view is turned', () => {
    for (const rung of RUNGS) {
      for (const yaw of [0, 1, 2.5, 4]) {
        for (const pitch of [SKY.far.pitchDeg.least, SKY.far.pitchDeg.first, SKY.far.pitchDeg.most]) {
          const view: FarView = { ...firstFarView(rung), yaw, pitch: (pitch * Math.PI) / 180 };
          const points = [...rungMembers(rung).map((o) => o.at), ...(rung === 'near' ? [SUN] : [MIDDLE])];
          for (const at of points) {
            const p = projectFar(at, view, frame);
            expect(Math.hypot(p.x - frame.cx, p.y - frame.cy), rung).toBeLessThanOrEqual(frame.half);
          }
        }
      }
    }
  });

  it('keeps the scale within its limits and the plane never seen from the edge', () => {
    expect(clampSpan(1)).toBe(rungLook('near').span * SKY.far.zoom.closer);
    expect(clampSpan(1e12)).toBe(rungLook('far').span * SKY.far.zoom.farther);
    const view = firstFarView('galaxy');
    expect(zoomFar(view, 2).span).toBe(view.span * 2);
    expect(turnFar(view, 0, -10).pitch).toBeCloseTo((SKY.far.pitchDeg.least * Math.PI) / 180);
    expect(turnFar(view, 0, 10).pitch).toBeCloseTo(Math.PI / 2);
    expect(turnFar(view, 0.5, 0).yaw).toBeCloseTo(view.yaw - 0.5);
  });
});

describe('the model on the screen', () => {
  it('seen from above stands as NASA’s picture does: the middle up from the Sun, longitude 90° to the left', () => {
    const view = fromAbove('galaxy');
    const sun = projectFar(SUN, view, frame);
    const middle = projectFar(MIDDLE, view, frame);
    expect(middle.x).toBeCloseTo(sun.x, 6);
    expect(middle.y).toBeLessThan(sun.y);
    expect(projectFar([0, 1000, 0], view, frame).x).toBeLessThan(sun.x);
    // a point above the plane is nearer to the viewer
    expect(projectFar([0, 0, 1000], view, frame).depth).toBeGreaterThan(sun.depth);
    const { right, up, out } = farAxes(firstFarView('galaxy'));
    expect(dot(right, up)).toBeCloseTo(0, 12);
    expect(dot(cross(right, up), out)).toBeCloseTo(1, 12);
  });

  it('lays the picture so that its Sun is where the model’s Sun is', () => {
    for (const view of [fromAbove('galaxy'), firstFarView('galaxy'), turnFar(firstFarView('near'), 1.3, -0.4)]) {
      const [a, b, c, d, e, f] = pictureOnScreen(view, frame);
      const [u, v] = [MILKY_WAY.sun[0] * MILKY_WAY.width, MILKY_WAY.sun[1] * MILKY_WAY.height];
      const sun = projectFar(SUN, view, frame);
      expect(a * u + c * v + e).toBeCloseTo(sun.x, 6);
      expect(b * u + d * v + f).toBeCloseTo(sun.y, 6);
    }
    // from above and at the rung of the Galaxy the picture is not turned and fills the shorter side
    const [a, b, c, d] = pictureOnScreen(fromAbove('galaxy'), frame);
    expect(b).toBeCloseTo(0, 9);
    expect(c).toBeCloseTo(0, 9);
    expect(a * MILKY_WAY.width).toBeCloseTo(2 * frame.half, 6);
    expect(d * MILKY_WAY.height).toBeCloseTo(2 * frame.half, 6);
  });

  it('draws the Milky Way larger than life among the other galaxies, and says so', () => {
    const near = firstFarView('galaxy');
    const far = firstFarView('far');
    expect(enlarged(MILKY_WAY.lightYears, near, frame, SKY.far.thumbPx)).toBe(1);
    expect(enlarged(MILKY_WAY.lightYears, far, frame, SKY.far.thumbPx)).toBeGreaterThan(50);
    expect(milkyWayPx(far, frame)).toBeLessThan(2);
    const [a] = pictureOnScreen({ ...far, pitch: Math.PI / 2 }, frame);
    expect(Math.abs(a) * MILKY_WAY.width).toBeCloseTo(SKY.far.thumbPx, 6);
    expect(marksShown(near, frame)).toBe(true);
    expect(marksShown(firstFarView('near'), frame)).toBe(true);
    expect(marksShown(firstFarView('group'), frame)).toBe(false);
  });

  it('dims the picture when the view is deep inside it', () => {
    expect(pictureLight(firstFarView('galaxy'), frame)).toBe(SKY.far.pictureLight);
    expect(pictureLight(firstFarView('far'), frame)).toBe(SKY.far.pictureLight);
    const near = pictureLight(firstFarView('near'), frame);
    expect(near).toBeLessThan(SKY.far.pictureLight * 0.6);
    expect(near).toBeGreaterThanOrEqual(SKY.far.pictureLeastLight);
  });

  it('does not draw our neighbours apart from the Milky Way where they would lie on it', () => {
    const [m31, m33, m81] = [farById('m31')!, farById('m33')!, farById('m81')!];
    for (const yaw of [0, 1.5, 3, 4.5]) {
      const far: FarView = { ...firstFarView('far'), yaw };
      expect(mergedWithHome(m31, far, frame)).toBe(true);
      expect(mergedWithHome(m33, far, frame)).toBe(true);
      // a touch there means the Milky Way, not a neighbour hidden in it
      const home = projectFar(MIDDLE, far, frame);
      expect(farAt(home.x, home.y, far, frame, null)).toEqual({ kind: 'milkyWay' });
      // a galaxy of the far rung is drawn however the model is turned
      expect(mergedWithHome(m81, far, frame)).toBe(false);
    }
    for (const yaw of [0, 1.5, 3, 4.5]) expect(mergedWithHome(m31, { ...firstFarView('group'), yaw }, frame)).toBe(false);
    expect(mergedWithHome(m31, firstFarView('galaxy'), frame)).toBe(false);
  });

  it('draws a round scale line no longer than asked', () => {
    for (const rung of RUNGS) {
      const line = scaleLine(firstFarView(rung), frame, 120);
      expect(line.px).toBeLessThanOrEqual(120);
      expect(line.px).toBeGreaterThan(120 / 2.6);
      expect(['1', '2', '5']).toContain(String(line.lightYears)[0]);
      expect(Number(String(line.lightYears).slice(1))).toBe(0);
    }
  });
});

describe('a flight between two views', () => {
  it('starts at one and ends at the other, keeping the turn', () => {
    const from = turnFar(firstFarView('near'), 0.7, 0.1);
    const to = firstFarView('far');
    const flight = { from, to, startedAt: 1000, ms: SKY.far.flyMs };
    expect(farFlightAt(flight, 1000).view.span).toBeCloseTo(from.span, 6);
    const end = farFlightAt(flight, 1000 + SKY.far.flyMs);
    expect(end.done).toBe(true);
    expect(end.view.span).toBeCloseTo(to.span, 3);
    expect(length(sub(end.view.centre, to.centre))).toBeLessThan(1);
    expect(end.view.yaw).toBe(from.yaw);
    expect(farFlightAt({ ...flight, ms: 0 }, 1000).done).toBe(true);
  });

  it('to a galaxy keeps it on the screen all the way and ends with it in the middle', () => {
    const m81 = farById('m81')!;
    const from = firstFarView('far');
    const to = arrivedAt(m81, from);
    expect(to.span).toBeCloseTo(rungLook('far').span / SKY.far.arriveZoom, 3);
    expect(arrivedAt(farById('m31')!, from).span).toBeCloseTo(rungLook('group').span / SKY.far.arriveZoom, 3);
    for (let t = 0; t <= 1; t += 0.1) {
      const { view } = farFlightAt({ from, to, startedAt: 0, ms: 1000 }, t * 1000);
      const p = projectFar(m81.at, view, frame);
      expect(Math.hypot(p.x - frame.cx, p.y - frame.cy)).toBeLessThanOrEqual(frame.half);
    }
    const p = projectFar(m81.at, to, frame);
    expect(p.x).toBeCloseTo(frame.cx, 6);
  });
});

describe('a touch', () => {
  it('on a galaxy’s photograph means the galaxy', () => {
    const view = firstFarView('far');
    const m51 = projectFar(farById('m51')!.at, view, frame);
    expect(farAt(m51.x + 5, m51.y - 5, view, frame, null)).toEqual({ kind: 'object', id: 'm51' });
  });

  it('on the small Milky Way among the galaxies means the Milky Way', () => {
    const view = firstFarView('group');
    const middle = projectFar(MIDDLE, view, frame);
    expect(farAt(middle.x + 4, middle.y + 4, view, frame, null)).toEqual({ kind: 'milkyWay' });
  });

  it('by the Sun means the Sun, on a mark — the cluster or the nebula, on empty space — nothing', () => {
    const view = fromAbove('near');
    const sun = projectFar(SUN, view, frame);
    const m42 = projectFar(farById('m42')!.at, view, frame);
    expect(farAt(sun.x + 1, sun.y, view, frame, null)).toEqual({ kind: 'sun' });
    expect(farAt(m42.x, m42.y + 2, view, frame, null)).toEqual({ kind: 'object', id: 'm42' });
    expect(farAt(frame.cx + frame.half, frame.cy - frame.half, view, frame, null)).toBeNull();
  });

  it('reaches the photograph of the galaxy arrived at over its whole size', () => {
    const m31 = farById('m31')!;
    const view = arrivedAt(m31, firstFarView('group'));
    const reach = SKY.far.arrivedShare * frame.half;
    expect(farAt(frame.cx + reach - 2, frame.cy, view, frame, 'm31')).toEqual({ kind: 'object', id: 'm31' });
    expect(farAt(frame.cx + reach - 2, frame.cy, view, frame, null)).not.toEqual({ kind: 'object', id: 'm31' });
  });
});
