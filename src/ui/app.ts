// The screen: which body the camera looks at, from where, in which scale; the list of bodies to fly to, the
// names over the picture, the menu. The astronomy is in ../core, the drawing in ./scene.ts.
import { SKY } from '../config.ts';
import { BODY_IDS, PLANET_IDS, parentOf, type BodyId } from '../core/bodies.ts';
import { attitude, orbitKm, positionsKm, type Attitude } from '../core/ephemeris.ts';
import { arrivalDistance, clampDistance, clampPitch, distanceToFit, eye, flightAt, progress, type Flight, type View } from '../core/flight.ts';
import { SCALES, sceneFromPlanet, sceneFromSun, scenePositions, sceneRadius, sceneRing, type ScaleMode } from '../core/scale.ts';
import { length, type Vec3 } from '../core/vec.ts';
import { attachControls } from './controls.ts';
import { h } from './dom.ts';
import { dict, fmt, pickLang, type Dict } from './i18n.ts';
import { createMenuDialog } from './menu-dialog.ts';
import { createSceneView, type Orbit, type SceneView } from './scene.ts';

const STORE = 'way1ong-sky:v1:settings';

function loadLang(): string | null {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORE) ?? '{}') as { lang?: unknown };
    return typeof saved.lang === 'string' ? saved.lang : null;
  } catch {
    return null;
  }
}

function saveLang(lang: string): void {
  try {
    window.localStorage.setItem(STORE, JSON.stringify({ lang }));
  } catch {
    // Storage blocked: the choice lasts until the page is closed.
  }
}

export function startApp(root: HTMLElement): void {
  let lang = pickLang(loadLang(), navigator.languages ?? [navigator.language]);
  let d: Dict = dict(lang);
  let mode: ScaleMode = 'handy';
  /** The moment the picture shows: now, refreshed every minute. */
  let date = new Date();
  let focus: BodyId = 'sun';
  let flight: Flight | null = null;
  let view: View = { yaw: 0.6, pitch: (SKY.overview.pitchDeg * Math.PI) / 180, distance: 1 };
  let dirty = true;

  // ---------- what the picture is made from, recomputed when the day or the scale changes ----------
  let where = {} as Record<BodyId, Vec3>;
  let radius = {} as Record<BodyId, number>;
  let turned = {} as Record<BodyId, Attitude>;

  function compute(): void {
    where = scenePositions(positionsKm(date), mode);
    for (const id of BODY_IDS) {
      radius[id] = sceneRadius(id, mode);
      turned[id] = attitude(id, date);
    }
  }

  function orbits(): Partial<Record<BodyId, Orbit>> {
    const out: Partial<Record<BodyId, Orbit>> = {};
    for (const id of PLANET_IDS) out[id] = { around: 'sun', points: orbitKm(id, date, SKY.orbitPoints).map((p) => sceneFromSun(p, mode)) };
    out.moon = { around: 'earth', points: orbitKm('moon', date, SKY.orbitPoints).map((p) => sceneFromPlanet(p, 'earth', mode)) };
    return out;
  }

  /** From how far the orbit of this planet fits the screen, with the Sun in the middle. */
  const fit = (planet: BodyId) => distanceToFit(length(where[planet]));
  const farthest = () => fit(SKY.overview.whole) * 1.5;

  // ---------- elements ----------
  const canvas = h('canvas', { tabindex: 0, role: 'img' });
  const labels = h('div', { class: 'labels', 'aria-hidden': 'true' });
  const title = h('h1', { class: 'top__name' });
  const line = h('p', { class: 'top__line' });
  const menuBtn = h('button', { class: 'icon-btn', type: 'button' }, h('span', { class: 'icon-menu', 'aria-hidden': 'true' }));
  const note = h('p', { class: 'note', role: 'status' });
  const dock = h('ul', { class: 'dock' });
  const scaleBox = h('fieldset', { class: 'scale' });
  const menu = createMenuDialog();
  const stage = h('div', { class: 'stage' }, canvas, labels);
  const main = h(
    'main',
    { class: 'app' },
    stage,
    h('header', { class: 'top' }, h('div', { class: 'top__text' }, title, line), menuBtn),
    h('div', { class: 'bottom' }, note, h('div', { class: 'bar' }, scaleBox), dock),
    menu.el,
  );
  root.replaceChildren(main);

  let scene: SceneView;
  try {
    scene = createSceneView(canvas);
  } catch {
    stage.replaceChildren(h('p', { class: 'fail' }, d.status.noGraphics));
    title.textContent = SKY.name;
    return;
  }
  scene.onLoad = () => {
    dirty = true;
  };

  const labelOf = new Map<BodyId, HTMLButtonElement>();
  const chipOf = new Map<BodyId | 'whole', HTMLButtonElement>();

  /** Everything that is words: built again when the language changes. */
  function build(): void {
    document.documentElement.lang = lang;
    document.title = d.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', d.meta.description);
    canvas.setAttribute('aria-label', d.app.scene);
    menuBtn.setAttribute('aria-label', d.app.menu);
    dock.setAttribute('aria-label', d.dock.label);

    labels.replaceChildren();
    dock.replaceChildren();
    labelOf.clear();
    chipOf.clear();
    const whole = h('button', { class: 'chip', type: 'button' }, d.dock.whole);
    whole.addEventListener('click', showWhole);
    chipOf.set('whole', whole);
    dock.append(h('li', {}, whole));
    for (const id of BODY_IDS) {
      const chip = h('button', { class: 'chip', type: 'button' }, d.bodies[id]);
      chip.addEventListener('click', () => flyTo(id));
      chipOf.set(id, chip);
      dock.append(h('li', {}, chip));
      // The names over the picture repeat the list for the finger and the mouse: the keyboard walks the list.
      const label = h('button', { class: 'label', type: 'button', tabindex: -1 }, d.bodies[id]);
      label.addEventListener('click', () => flyTo(id));
      labelOf.set(id, label);
      labels.append(label);
    }

    scaleBox.replaceChildren(h('legend', {}, d.scale.label));
    for (const m of SCALES) {
      const button = h('button', { class: 'chip', type: 'button', 'aria-pressed': String(m === mode) }, d.scale[m]);
      button.addEventListener('click', () => setMode(m));
      scaleBox.append(button);
    }
    describe();
    dirty = true;
  }

  /** The title, the line under it and the marks in the list. */
  function describe(): void {
    const whole = focus === 'sun' && !flight && view.distance > arrivalDistance('sun', radius.sun) * 1.5;
    title.textContent = flight ? fmt(d.status.flying, { name: d.bodies[flight.to] }) : whole ? d.dock.whole : fmt(d.status.at, { name: d.bodies[focus] });
    line.textContent = fmt(d.status.today, { date: new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric' }).format(date) });
    for (const [id, chip] of chipOf) {
      const here = id === 'whole' ? whole : !whole && id === (flight?.to ?? focus);
      if (here) chip.setAttribute('aria-current', 'true');
      else chip.removeAttribute('aria-current');
    }
  }

  // ---------- moves ----------
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fly(to: BodyId, endDistance: number): void {
    flight = { from: focus, to, startDistance: view.distance, endDistance, startedAt: performance.now(), durationMs: reducedMotion() ? 0 : SKY.flightMs };
    note.textContent = '';
    describe();
    dirty = true;
  }

  function flyTo(id: BodyId): void {
    fly(id, arrivalDistance(id, radius[id]));
  }

  function showWhole(): void {
    fly('sun', fit(SKY.overview.whole));
  }

  function setMode(next: ScaleMode): void {
    if (next === mode) return;
    // The view keeps what it shows: a body stays as large on the screen, the whole system stays whole.
    const whole = focus === 'sun' && view.distance > arrivalDistance('sun', radius.sun) * 1.5;
    const before = whole ? length(where[SKY.overview.whole]) : radius[focus];
    mode = next;
    compute();
    scene.setOrbits(orbits());
    const after = whole ? length(where[SKY.overview.whole]) : radius[focus];
    flight = null;
    view = { ...view, distance: clampDistance((view.distance * after) / before, radius[focus], farthest()) };
    for (const button of scaleBox.querySelectorAll('button')) button.setAttribute('aria-pressed', String(button.textContent === d.scale[mode]));
    note.textContent = mode === 'true' ? d.scale.trueNote : d.scale.handyNote;
    describe();
    dirty = true;
  }

  attachControls(canvas, {
    turn(yaw, pitch) {
      view = { ...view, yaw: view.yaw + yaw, pitch: clampPitch(view.pitch + pitch) };
      dirty = true;
    },
    zoom(factor) {
      if (flight) return;
      view = { ...view, distance: clampDistance(view.distance * factor, radius[focus], farthest()) };
      describe();
      dirty = true;
    },
  });

  menuBtn.addEventListener('click', () =>
    menu.open(d, lang, (code) => {
      lang = code;
      d = dict(lang);
      saveLang(lang);
      menu.el.close();
      build();
    }),
  );

  /** The radius of the body looked at as it is seen on the screen, CSS pixels. */
  function focusOnScreenPx(): number {
    const half = Math.min(canvas.clientWidth, canvas.clientHeight) / 2;
    return ((radius[focus] / view.distance) * half) / Math.tan((SKY.fovDeg * Math.PI) / 360);
  }

  // ---------- the names over the picture ----------
  function placeLabels(): void {
    const taken: { x: number; y: number }[] = [];
    // The body looked at first, then the Sun and the planets, the Moon last: a name too close to one already
    // placed is left out, or the Moon's would lie on the Earth's.
    const order = [flight?.to ?? focus, ...BODY_IDS.filter((id) => id !== (flight?.to ?? focus) && parentOf(id) !== 'earth'), 'moon' as const];
    const seen = new Set<BodyId>();
    for (const id of order) {
      if (seen.has(id)) continue;
      seen.add(id);
      const label = labelOf.get(id);
      if (!label) continue;
      const at = scene.onScreen(id);
      const inside = at && at.x > -20 && at.y > -20 && at.x < canvas.clientWidth + 20 && at.y < canvas.clientHeight + 20;
      const free = at && taken.every((t) => Math.hypot(t.x - at.x, t.y - at.y) > 26);
      // A body that fills the view needs no name on its face: the title says what it is.
      const large = id === focus && !flight && focusOnScreenPx() > SKY.labelHiddenFromPx;
      label.hidden = !(at && inside && free) || large;
      if (!at || label.hidden) continue;
      taken.push(at);
      label.style.transform = `translate(${at.x.toFixed(1)}px, ${at.y.toFixed(1)}px)`;
      label.classList.toggle('is-here', id === focus && !flight);
    }
  }

  // ---------- the loop: a frame is drawn only when something has changed ----------
  function frame(now: number): void {
    let target = where[focus];
    if (flight) {
      const at = flightAt(flight, now, where);
      target = at.target;
      view = { ...view, distance: at.distance };
      if (progress(flight, now) >= 1) {
        focus = flight.to;
        flight = null;
        target = where[focus];
        view = { ...view, distance: clampDistance(view.distance, radius[focus], farthest()) };
        describe();
      }
      dirty = true;
    }
    if (dirty) {
      dirty = false;
      scene.draw({ where, radius, turned, ring: sceneRing(mode), target, eye: eye(target, view) });
      placeLabels();
    }
    window.requestAnimationFrame(frame);
  }

  window.addEventListener('resize', () => {
    scene.resize();
    dirty = true;
  });
  // The planets move slowly, the Earth turns a quarter of a degree a minute: once a minute is often enough.
  window.setInterval(() => {
    date = new Date();
    compute();
    describe();
    dirty = true;
  }, 60_000);

  compute();
  scene.setOrbits(orbits());
  view = { ...view, distance: fit(SKY.overview.first) };
  build();
  window.requestAnimationFrame(frame);
}
