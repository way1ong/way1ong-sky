// The screen: which body the camera looks at, from where, in which scale; the list of bodies to fly to, the
// names over the picture, the menu. The astronomy is in ../core, the drawing in ./scene.ts.
import { SKY } from '../config.ts';
import { BODY_IDS, PLANET_IDS, parentOf, radiusKm, type BodyId } from '../core/bodies.ts';
import { RATES, atLimit, isLive, isRunningFast, jumpTo, liveClock, showsSpin, showsTimeOfDay, shownAt, stepRate, togglePause, type Clock } from '../core/clock.ts';
import { nextLunarEclipse, nextSolarEclipse } from '../core/eclipses.ts';
import { attitude, orbitKm, positionsKm, type Attitude } from '../core/ephemeris.ts';
import { arrivalDistance, clampDistance, clampPitch, distanceToFit, eye, facing, flightAt, progress, type Flight, type View } from '../core/flight.ts';
import { SCALES, sceneFromPlanet, sceneFromSun, scenePositions, sceneRadius, sceneRing, type ScaleMode } from '../core/scale.ts';
import { shadeOf, type Shade } from '../core/shadow.ts';
import { length, sub, type Vec3 } from '../core/vec.ts';
import { attachControls } from './controls.ts';
import { h } from './dom.ts';
import { dict, fmt, pickLang, type Dict } from './i18n.ts';
import { createMenuDialog } from './menu-dialog.ts';
import { createSceneView, type Orbit, type SceneView } from './scene.ts';
import { createTimeDialog } from './time-dialog.ts';

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
  /** The app's clock and the moment it shows right now. */
  let clock: Clock = liveClock(Date.now());
  let date = new Date(shownAt(clock, Date.now()));
  /** The moment the bodies are turned for: it stops following the clock when the clock runs too fast. */
  let spinDate = date;
  /** The moment the lines of the orbits were drawn for. */
  let orbitsDate = date;
  let focus: BodyId = 'sun';
  let flight: Flight | null = null;
  let view: View = { yaw: 0.6, pitch: (SKY.overview.pitchDeg * Math.PI) / 180, distance: 1 };
  let dirty = true;

  // ---------- what the picture is made from, recomputed when the day or the scale changes ----------
  let where = {} as Record<BodyId, Vec3>;
  let radius = {} as Record<BodyId, number>;
  let turned = {} as Record<BodyId, Attitude>;
  let shade: Partial<Record<BodyId, Shade | null>> = {};

  function compute(): void {
    const km = positionsKm(date);
    where = scenePositions(km, mode);
    if (showsSpin(clock)) spinDate = date;
    for (const id of BODY_IDS) {
      radius[id] = sceneRadius(id, mode);
      turned[id] = attitude(id, spinDate);
    }
    // Shadows come from the real places and sizes, whichever the scale of the picture.
    const shadow = (body: BodyId, by: BodyId) => shadeOf(km[body], radiusKm(body), km.sun, radiusKm('sun'), km[by], radiusKm(by));
    shade = { moon: shadow('moon', 'earth'), earth: shadow('earth', 'moon') };
  }

  /** The lines of the orbits follow the clock: drawn again when it has moved on by two days. */
  function refreshOrbits(force = false): void {
    if (!force && Math.abs(date.getTime() - orbitsDate.getTime()) < 2 * 86_400_000) return;
    orbitsDate = date;
    scene.setOrbits(orbits());
  }

  function orbits(): Partial<Record<BodyId, Orbit>> {
    const out: Partial<Record<BodyId, Orbit>> = {};
    for (const id of PLANET_IDS) out[id] = { around: 'sun', points: orbitKm(id, date, SKY.orbitPoints).map((p) => sceneFromSun(p, mode)) };
    out.moon = { around: 'earth', points: orbitKm('moon', date, SKY.orbitPoints).map((p) => sceneFromPlanet(p, 'earth', mode)) };
    return out;
  }

  /** From how far the orbit of this planet fits the screen, with the Sun in the middle. */
  /** How much smaller the free part of the screen is than the screen: a view that must fit stands that much farther. */
  let squeeze = 1;
  const fit = (planet: BodyId) => distanceToFit(length(where[planet])) * squeeze;
  const farthest = () => fit(SKY.overview.whole) * 1.5;

  // ---------- elements ----------
  const canvas = h('canvas', { tabindex: 0, role: 'img' });
  const labels = h('div', { class: 'labels', 'aria-hidden': 'true' });
  const title = h('h1', { class: 'top__name' });
  const line = h('p', { class: 'top__line' });
  /** The speed of the clock on a line of its own: the date beside it changes its width all the time. */
  const speedLine = h('p', { class: 'top__line top__speed' });
  const menuBtn = h('button', { class: 'icon-btn', type: 'button' }, h('span', { class: 'icon-menu', 'aria-hidden': 'true' }));
  const note = h('p', { class: 'note__text', role: 'status' });
  const noteClose = h('button', { class: 'icon-btn', type: 'button' }, h('span', { class: 'icon-close', 'aria-hidden': 'true' }));
  const noteBox = h('div', { class: 'note', hidden: true }, note, noteClose);
  const dock = h('ul', { class: 'dock' });
  const scaleBox = h('fieldset', { class: 'scale' });
  const timeBox = h('div', { class: 'time', role: 'group' });
  const slowerBtn = h('button', { class: 'icon-btn', type: 'button' }, h('span', { class: 'icon-skip icon-skip--back', 'aria-hidden': 'true' }));
  const pauseBtn = h('button', { class: 'icon-btn', type: 'button' });
  const fasterBtn = h('button', { class: 'icon-btn', type: 'button' }, h('span', { class: 'icon-skip', 'aria-hidden': 'true' }));
  const nowBtn = h('button', { class: 'chip', type: 'button' });
  const moreBtn = h('button', { class: 'chip', type: 'button' });
  timeBox.append(slowerBtn, pauseBtn, fasterBtn, nowBtn, moreBtn);
  const menu = createMenuDialog();
  const timeDialog = createTimeDialog();
  const stage = h('div', { class: 'stage' }, canvas, labels);
  const header = h('header', { class: 'top' }, h('div', { class: 'top__text' }, title, line, speedLine), menuBtn);
  const bottom = h('div', { class: 'bottom' }, h('div', { class: 'bar' }, timeBox), h('div', { class: 'bar' }, scaleBox), dock);
  const main = h(
    'main',
    { class: 'app' },
    stage,
    header,
    noteBox,
    bottom,
    menu.el,
    timeDialog.el,
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
  /** How wide every name is on the screen, CSS px — measured when the names are written. */
  const labelWidth = new Map<BodyId, number>();
  const chipOf = new Map<BodyId | 'whole', HTMLButtonElement>();

  /** Everything that is words: built again when the language changes. */
  function build(): void {
    document.documentElement.lang = lang;
    document.title = d.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', d.meta.description);
    canvas.setAttribute('aria-label', d.app.scene);
    menuBtn.setAttribute('aria-label', d.app.menu);
    dock.setAttribute('aria-label', d.dock.label);
    timeBox.setAttribute('aria-label', d.time.label);
    slowerBtn.setAttribute('aria-label', d.time.slower);
    fasterBtn.setAttribute('aria-label', d.time.faster);
    nowBtn.textContent = d.time.now;
    moreBtn.textContent = d.time.moreShort;
    moreBtn.setAttribute('aria-label', d.time.more);
    noteClose.setAttribute('aria-label', d.actions.close);

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

    for (const [id, label] of labelOf) {
      label.hidden = false;
      labelWidth.set(id, label.getBoundingClientRect().width);
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
    const real = Date.now();
    const live = isLive(clock, real);
    const moment = showsTimeOfDay(clock) ? fmt(d.time.at, { date: dayText(date), time: new Intl.DateTimeFormat(lang, { hour: 'numeric', minute: '2-digit' }).format(date) }) : dayText(date);
    const name = d.time.rates[SKY.time.names[clock.rate] as keyof Dict['time']['rates']];
    const speed = (RATES[clock.rate] as number) < 0 ? fmt(d.time.back, { rate: name }) : name;
    line.textContent = moment;
    speedLine.textContent = clock.paused ? d.time.paused : live ? '' : speed;
    speedLine.hidden = speedLine.textContent === '';
    nowBtn.hidden = live;
    pauseBtn.setAttribute('aria-label', clock.paused ? d.time.play : d.time.pause);
    pauseBtn.replaceChildren(h('span', { class: clock.paused ? 'icon-play' : 'icon-pause', 'aria-hidden': 'true' }));
    for (const [id, chip] of chipOf) {
      const here = id === 'whole' ? whole : !whole && id === (flight?.to ?? focus);
      if (here) chip.setAttribute('aria-current', 'true');
      else chip.removeAttribute('aria-current');
    }
  }

  /** Says something over the picture, or takes the words away. */
  function say(text: string): void {
    note.textContent = text;
    noteBox.hidden = text === '';
  }
  noteClose.addEventListener('click', () => {
    say('');
    canvas.focus();
  });

  /** The bars cover the top and the bottom of the picture: the view centres on what is left free. */
  function measure(): void {
    const top = header.getBoundingClientRect().bottom;
    const low = canvas.clientHeight - bottom.getBoundingClientRect().top;
    scene.setCovered(top, low);
    const free = Math.max(1, Math.min(canvas.clientWidth, canvas.clientHeight - top - low));
    squeeze = Math.min(canvas.clientWidth, canvas.clientHeight) / free;
    dirty = true;
  }

  const dayText = (moment: Date) => new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric' }).format(moment);

  // ---------- time ----------
  /** After the clock was changed: the picture for the new moment. */
  function retime(text = ''): void {
    date = new Date(shownAt(clock, Date.now()));
    compute();
    refreshOrbits();
    say(text);
    describe();
    dirty = true;
  }

  slowerBtn.addEventListener('click', () => {
    clock = stepRate(clock, Date.now(), -1);
    retime(showsSpin(clock) ? '' : d.time.noSpin);
  });
  fasterBtn.addEventListener('click', () => {
    clock = stepRate(clock, Date.now(), 1);
    retime(showsSpin(clock) ? '' : d.time.noSpin);
  });
  pauseBtn.addEventListener('click', () => {
    clock = togglePause(clock, Date.now());
    retime();
  });
  nowBtn.addEventListener('click', () => {
    clock = liveClock(Date.now());
    retime();
    pauseBtn.focus();
  });

  /** To the middle of an eclipse: time stands, the camera flies to the body in shadow and looks at its lit side. */
  function showEclipse(body: 'moon' | 'earth', peak: Date, text: string): void {
    clock = jumpTo(clock, Date.now(), peak.getTime());
    retime(text);
    const side = facing(sub(where.sun, where[body]), (SKY.eclipseViewOffsetDeg[body] * Math.PI) / 180);
    view = { ...view, ...side };
    fly(body, arrivalDistance(body, radius[body]), text);
  }

  moreBtn.addEventListener('click', () =>
    timeDialog.open(d, date, {
      goTo(day) {
        clock = jumpTo(clock, Date.now(), day.getTime());
        retime();
      },
      nextLunar() {
        const eclipse = nextLunarEclipse(date);
        showEclipse('moon', eclipse.peak, fmt(d.time.lunarAt[eclipse.kind], { date: dayText(eclipse.peak) }));
      },
      nextSolar() {
        const eclipse = nextSolarEclipse(date);
        showEclipse('earth', eclipse.peak, fmt(d.time.solarAt[eclipse.kind], { date: dayText(eclipse.peak) }));
      },
    }),
  );

  // ---------- moves ----------
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fly(to: BodyId, endDistance: number, text = ''): void {
    flight = { from: focus, to, startDistance: view.distance, endDistance, startedAt: performance.now(), durationMs: reducedMotion() ? 0 : SKY.flightMs };
    say(text);
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
    refreshOrbits(true);
    const after = whole ? length(where[SKY.overview.whole]) : radius[focus];
    flight = null;
    view = { ...view, distance: clampDistance((view.distance * after) / before, radius[focus], farthest()) };
    for (const button of scaleBox.querySelectorAll('button')) button.setAttribute('aria-pressed', String(button.textContent === d.scale[mode]));
    say(mode === 'true' ? d.scale.trueNote : d.scale.handyNote);
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
    const taken: { left: number; right: number; y: number }[] = [];
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
      // A name is drawn only with its dot on the screen, and only where it does not run into a name already placed.
      const inside = at && at.x > 6 && at.y > 0 && at.x < canvas.clientWidth && at.y < canvas.clientHeight;
      const box = at ? { left: at.x - 10, right: at.x + (labelWidth.get(id) ?? 0) + 4, y: at.y } : null;
      const free = box && taken.every((t) => Math.abs(t.y - box.y) > SKY.labelRowPx || box.left > t.right || box.right < t.left);
      // A body that fills the view needs no name on its face: the title says what it is.
      const large = id === focus && !flight && focusOnScreenPx() > SKY.labelHiddenFromPx;
      label.hidden = !(at && inside && free) || large;
      if (!at || !box || label.hidden) continue;
      taken.push(box);
      label.style.transform = `translate(${at.x.toFixed(1)}px, ${at.y.toFixed(1)}px)`;
      label.classList.toggle('is-here', id === focus && !flight);
    }
  }

  // ---------- the loop: a frame is drawn only when something has changed ----------
  function frame(now: number): void {
    if (isRunningFast(clock)) {
      const real = Date.now();
      if (atLimit(clock, real)) {
        clock = togglePause(clock, real);
        retime(fmt(d.time.limit, { from: SKY.time.fromYear, to: SKY.time.toYear }));
      } else {
        date = new Date(shownAt(clock, real));
        compute();
        refreshOrbits();
        describe();
        dirty = true;
      }
    }
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
      scene.draw({ where, radius, turned, ring: sceneRing(mode), shade, target, eye: eye(target, view) });
      placeLabels();
    }
    window.requestAnimationFrame(frame);
  }

  window.addEventListener('resize', () => {
    scene.resize();
    measure();
  });
  // The bars change their height with the language and the width of the screen.
  const bars = new ResizeObserver(measure);
  bars.observe(header);
  bars.observe(bottom);
  // The planets move slowly, the Earth turns a quarter of a degree a minute: once a minute is often enough.
  window.setInterval(() => {
    if (clock.paused || isRunningFast(clock)) return;
    date = new Date(shownAt(clock, Date.now()));
    compute();
    refreshOrbits();
    describe();
    dirty = true;
  }, 60_000);

  compute();
  refreshOrbits(true);
  build();
  measure();
  view = { ...view, distance: fit(SKY.overview.first) };
  describe();
  window.requestAnimationFrame(frame);
}
