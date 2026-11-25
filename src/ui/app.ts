// The screen: which body the camera looks at, from where, in which scale; the list of bodies to fly to, the
// names over the picture, the menu. The astronomy is in ../core, the drawing in ./scene.ts.
import { SKY } from '../config.ts';
import { BODY_IDS, PLANET_IDS, SATELLITE_IDS, WORLD_IDS, isSatellite, parentOf, radiusKm, type BodyId, type WorldId } from '../core/bodies.ts';
import { RATES, atLimit, isLive, isRunningFast, jumpTo, liveClock, showsSpin, showsTimeOfDay, shownAt, slowedTo, stepRate, togglePause, type Clock } from '../core/clock.ts';
import { firstLook, project, turnLook, zoomLook, type Frame, type Look } from '../core/dome.ts';
import type { SkyEvent } from '../core/events.ts';
import { nextLunarEclipse, nextSolarEclipse } from '../core/eclipses.ts';
import { attitude, orbitKm, positionsKm, type Attitude } from '../core/ephemeris.ts';
import { arrivalDistance, clampDistance, clampPitch, distanceToFit, eye, facing, flightAt, progress, type Flight, type View } from '../core/flight.ts';
import { advance, freeFrom, keepOutside, lookPoint, nearest, radiusOnScreenPx, turnFree, type FreeView } from '../core/free.ts';
import { moonsBesideJupiter } from '../core/jupiter-moons.ts';
import { deepAt, deepById, deepNearerThanBody, type DeepObject } from '../core/deep-sky.ts';
import { pickAt, pickedInSky, skyInfo, type Picked } from '../core/pick.ts';
import { cityById, cityName, firstCity, type City } from '../core/places.ts';
import type { PlanetTonight } from '../core/tonight.ts';
import { SCALES, sceneFromPlanet, sceneFromSun, scenePositions, sceneRadius, sceneRing, type ScaleMode } from '../core/scale.ts';
import { shadeOf, type Shade } from '../core/shadow.ts';
import { SITE_IDS, SITES, sunOverSite, surfaceDirection, type SiteId } from '../core/sites.ts';
import { altAz, bodyInSky, skyTurn, type SkyTurn } from '../core/sky.ts';
import { add, length, scale, sub, type Vec3 } from '../core/vec.ts';
import { attachControls } from './controls.ts';
import { h } from './dom.ts';
import { eventBody, eventMoment, eventName } from './events-list.ts';
import { createFactsDialog } from './facts-dialog.ts';
import { dict, fmt, num, pickLang, type Dict } from './i18n.ts';
import { createMenuDialog } from './menu-dialog.ts';
import { createPickCard } from './pick-card.ts';
import { createPlaceDialog } from './place-dialog.ts';
import { createSatelliteDialog } from './satellite-dialog.ts';
import { createSceneView, type Orbit, type SceneView } from './scene.ts';
import { createSiteDialog } from './site-dialog.ts';
import { dayUT, missionName } from './site-text.ts';
import { createAim } from './aim.ts';
import { createConstellationDialog } from './constellation-dialog.ts';
import { createDeepSkyDialog } from './deep-sky-dialog.ts';
import { createSkyView, type SkyLayers } from './sky-view.ts';
import { createTimeDialog } from './time-dialog.ts';
import { createTonightDialog } from './tonight-dialog.ts';

const STORE = 'way1ong-sky:v1:settings';

/** What is kept on the device: the language, the place of the sky and its layers. Nothing else, nowhere else. */
interface Saved {
  lang?: string;
  place?: string;
  figures?: boolean;
  names?: boolean;
  deep?: boolean;
  night?: boolean;
}

function load(): Saved {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORE) ?? '{}') as Record<string, unknown>;
    return {
      lang: typeof saved.lang === 'string' ? saved.lang : undefined,
      place: typeof saved.place === 'string' ? saved.place : undefined,
      figures: typeof saved.figures === 'boolean' ? saved.figures : undefined,
      names: typeof saved.names === 'boolean' ? saved.names : undefined,
      deep: typeof saved.deep === 'boolean' ? saved.deep : undefined,
      night: typeof saved.night === 'boolean' ? saved.night : undefined,
    };
  } catch {
    return {};
  }
}

function save(saved: Saved): void {
  try {
    window.localStorage.setItem(STORE, JSON.stringify(saved));
  } catch {
    // Storage blocked: the choices last until the page is closed.
  }
}

export function startApp(root: HTMLElement): void {
  const saved = load();
  let lang = pickLang(saved.lang ?? null, navigator.languages ?? [navigator.language]);
  let d: Dict = dict(lang);
  let mode: ScaleMode = 'handy';
  /** The app's clock and the moment it shows right now. */
  let clock: Clock = liveClock(Date.now());
  let date = new Date(shownAt(clock, Date.now()));
  /** The moment the bodies are turned for: it stops following the clock when the clock runs too fast. */
  let spinDate = date;
  /** The moment the lines of the orbits were drawn for. */
  let orbitsDate = date;
  let focus: WorldId = 'sun';
  /** Which of the two modes is on the screen: the flight through the Solar System or the sky from a place. */
  let screen: 'flight' | 'sky' = 'flight';
  let look: Look = firstLook();
  /** The place the sky is shown for: the saved one, else the city of the device's time zone, else a capital by language. */
  let place: City = cityById(saved.place) ?? firstCity(new Intl.DateTimeFormat().resolvedOptions().timeZone, lang);
  let layers: SkyLayers = { figures: saved.figures ?? true, names: saved.names ?? true, deep: saved.deep ?? true };
  /** How the sky is turned over the place at the moment shown; null — to be worked out again. */
  let turnNow: SkyTurn | null = null;
  /** The red screen for the dark: on while the sky is on the screen. */
  let night = saved.night ?? false;
  const keep = () => save({ lang, place: place.id, figures: layers.figures, names: layers.names, deep: layers.deep, night });
  let flight: Flight | null = null;
  /** Free flight: the camera stands where the player has flown it, tied to no body. */
  let free: FreeView | null = null;
  /** "Forward" (1) or "back" (-1) is held down. */
  let thrust = 0;
  /** Where the camera stood in the last frame drawn. */
  let cameraAt: Vec3 = [0, 0, 0];
  let view: View = { yaw: 0.6, pitch: (SKY.overview.pitchDeg * Math.PI) / 180, distance: 1 };
  let dirty = true;

  // ---------- what the picture is made from, recomputed when the day or the scale changes ----------
  let where = {} as Record<WorldId, Vec3>;
  let radius = {} as Record<WorldId, number>;
  let turned = {} as Record<WorldId, Attitude>;
  let shade: Partial<Record<BodyId, Shade | null>> = {};

  function compute(): void {
    const km = positionsKm(date);
    where = scenePositions(km, mode);
    if (showsSpin(clock)) spinDate = date;
    for (const id of WORLD_IDS) {
      radius[id] = sceneRadius(id, mode);
      turned[id] = attitude(id, spinDate);
    }
    // Shadows come from the real places and sizes, whichever the scale of the picture.
    const shadow = (body: BodyId, by: BodyId) => shadeOf(km[body], radiusKm(body), km.sun, radiusKm('sun'), km[by], radiusKm(by));
    shade = { moon: shadow('moon', 'earth'), earth: shadow('earth', 'moon') };
    turnNow = null;
  }

  /** The lines of the orbits follow the clock: drawn again when it has moved on by two days. */
  function refreshOrbits(force = false): void {
    if (!force && Math.abs(date.getTime() - orbitsDate.getTime()) < 2 * 86_400_000) return;
    orbitsDate = date;
    scene.setOrbits(orbits());
  }

  function orbits(): Partial<Record<WorldId, Orbit>> {
    const out: Partial<Record<WorldId, Orbit>> = {};
    for (const id of PLANET_IDS) out[id] = { around: 'sun', points: orbitKm(id, date, SKY.orbitPoints).map((p) => sceneFromSun(p, mode)) };
    out.moon = { around: 'earth', points: orbitKm('moon', date, SKY.orbitPoints).map((p) => sceneFromPlanet(p, 'earth', mode)) };
    for (const id of SATELLITE_IDS) out[id] = { around: 'jupiter', points: orbitKm(id, date, SKY.orbitPoints).map((p) => sceneFromPlanet(p, 'jupiter', mode, id)) };
    return out;
  }

  /** From how far the orbit of this planet fits the screen, with the Sun in the middle. */
  /** How much smaller the free part of the screen is than the screen: a view that must fit stands that much farther. */
  let squeeze = 1;
  const fit = (planet: BodyId) => distanceToFit(length(where[planet])) * squeeze;
  const farthest = () => fit(SKY.overview.whole) * 1.5;

  // ---------- elements ----------
  const canvas = h('canvas', { tabindex: 0, role: 'img' });
  const skyCanvas = h('canvas', { class: 'sky', tabindex: 0, role: 'img', hidden: true });
  const labels = h('div', { class: 'labels', 'aria-hidden': 'true' });
  /** Marks of the landing places on the Moon: shown while the camera looks at the Moon from near enough. */
  const siteMarks = h('div', { class: 'labels' });
  const title = h('h1', { class: 'top__name' });
  const line = h('p', { class: 'top__line' });
  /** The speed of the clock on a line of its own: the date beside it changes its width all the time. */
  const speedLine = h('p', { class: 'top__line top__speed' });
  /** In free flight: the body the camera is nearest to. */
  const nearLine = h('p', { class: 'top__line', hidden: true });
  let nearNow: WorldId | null = null;
  const menuBtn = h('button', { class: 'icon-btn', type: 'button' }, h('span', { class: 'icon-menu', 'aria-hidden': 'true' }));
  /** Hides the panels for a wider view of the picture and brings them back; stays in its corner all the time. */
  const wideBtn = h('button', { class: 'icon-btn icon-btn--wide', type: 'button' }, h('span', { class: 'icon-wide', 'aria-hidden': 'true' }));
  let wide = false;
  const note = h('p', { class: 'note__text', role: 'status' });
  const noteClose = h('button', { class: 'icon-btn', type: 'button' }, h('span', { class: 'icon-close', 'aria-hidden': 'true' }));
  const noteBox = h('div', { class: 'note', hidden: true }, note, noteClose);
  /** The card of what a touch on the sky map has named; it takes the note's place. */
  const pickCard = createPickCard();
  /** Says the card once to a screen reader: the card itself is rewritten silently while the clock runs. */
  const pickSaid = h('p', { class: 'visually-hidden', role: 'status' });
  let picked: Picked | null = null;
  let pickShownAt = 0;
  const dock = h('ul', { class: 'dock' });
  const scaleBox = h('fieldset', { class: 'scale' });
  const timeBox = h('div', { class: 'time', role: 'group' });
  const backBtn = h('button', { class: 'chip chip--fly', type: 'button' });
  const forwardBtn = h('button', { class: 'chip chip--fly', type: 'button' });
  const flyBox = h('div', { class: 'bar fly', role: 'group', hidden: true }, backBtn, forwardBtn);
  const toFlightBtn = h('button', { class: 'chip', type: 'button' });
  const placeBtn = h('button', { class: 'chip', type: 'button' });
  const tonightBtn = h('button', { class: 'chip', type: 'button' });
  /** A trial: the sky map turns to where the phone is pointed. Offered only on devices held in the hand. */
  const aimBtn = h('button', { class: 'chip', type: 'button', 'aria-pressed': 'false', hidden: true });
  const skyBox = h('div', { class: 'bar sky-bar', role: 'group', hidden: true }, toFlightBtn, placeBtn, tonightBtn, aimBtn);
  const scaleBar = h('div', { class: 'bar bar--scale' });
  const slowerBtn = h('button', { class: 'icon-btn', type: 'button' }, h('span', { class: 'icon-skip icon-skip--back', 'aria-hidden': 'true' }));
  const pauseBtn = h('button', { class: 'icon-btn', type: 'button' });
  const fasterBtn = h('button', { class: 'icon-btn', type: 'button' }, h('span', { class: 'icon-skip', 'aria-hidden': 'true' }));
  const nowBtn = h('button', { class: 'chip', type: 'button' });
  const moreBtn = h('button', { class: 'chip', type: 'button' });
  timeBox.append(slowerBtn, pauseBtn, fasterBtn, nowBtn, moreBtn);
  const factsBtn = h('button', { class: 'icon-btn', type: 'button' }, h('span', { class: 'icon-info', 'aria-hidden': 'true' }, 'i'));
  const menu = createMenuDialog();
  const timeDialog = createTimeDialog();
  const factsDialog = createFactsDialog();
  const siteDialog = createSiteDialog();
  const satelliteDialog = createSatelliteDialog();
  const placeDialog = createPlaceDialog();
  const tonightDialog = createTonightDialog();
  const constellationDialog = createConstellationDialog();
  const deepDialog = createDeepSkyDialog();
  const stage = h('div', { class: 'stage' }, canvas, skyCanvas, labels, siteMarks);
  const header = h('header', { class: 'top' }, h('div', { class: 'top__text' }, title, line, speedLine, nearLine), factsBtn, menuBtn, wideBtn);
  scaleBar.append(scaleBox);
  const timeBar = h('div', { class: 'bar bar--time' }, timeBox);
  const bottom = h('div', { class: 'bottom' }, flyBox, timeBar, scaleBar, dock, skyBox);
  const main = h(
    'main',
    { class: 'app' },
    stage,
    header,
    noteBox,
    pickCard.el,
    pickSaid,
    bottom,
    menu.el,
    timeDialog.el,
    factsDialog.el,
    siteDialog.el,
    satelliteDialog.el,
    placeDialog.el,
    tonightDialog.el,
    constellationDialog.el,
    deepDialog.el,
  );
  root.replaceChildren(main);

  // Without 3D graphics there is no flight, but the sky needs none: the app opens on the sky and stays there.
  let scene: SceneView;
  let graphics = true;
  try {
    scene = createSceneView(canvas);
  } catch {
    graphics = false;
    scene = { draw: () => undefined, setOrbits: () => undefined, onScreen: () => null, surfaceOnScreen: () => null, resize: () => undefined, setCovered: () => undefined, onLoad: () => undefined, destroy: () => undefined };
  }
  scene.onLoad = () => {
    dirty = true;
  };

  const labelOf = new Map<WorldId, HTMLButtonElement>();
  /** How wide every name is on the screen, CSS px — measured when the names are written. */
  const labelWidth = new Map<WorldId, number>();
  /** The name of anything the flight can fly to: a body of the list, or a moon of Jupiter. */
  const nameOf = (id: WorldId): string => (isSatellite(id) ? d.satellites[id] : d.bodies[id]);
  const chipOf = new Map<BodyId | 'whole' | 'free', HTMLButtonElement>();
  const markOf = new Map<SiteId, HTMLButtonElement>();

  /** Everything that is words: built again when the language changes. */
  function build(): void {
    document.documentElement.lang = lang;
    document.title = d.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', d.meta.description);
    canvas.setAttribute('aria-label', d.app.scene);
    menuBtn.setAttribute('aria-label', d.app.menu);
    wideBtn.setAttribute('aria-label', wide ? d.app.showPanels : d.app.hidePanels);
    dock.setAttribute('aria-label', d.dock.label);
    timeBox.setAttribute('aria-label', d.time.label);
    slowerBtn.setAttribute('aria-label', d.time.slower);
    fasterBtn.setAttribute('aria-label', d.time.faster);
    nowBtn.textContent = d.time.now;
    moreBtn.textContent = d.time.moreShort;
    moreBtn.setAttribute('aria-label', d.time.more);
    noteClose.setAttribute('aria-label', d.actions.close);
    flyBox.setAttribute('aria-label', d.free.title);
    backBtn.textContent = d.free.back;
    skyCanvas.setAttribute('aria-label', d.sky.scene);
    skyBox.setAttribute('aria-label', d.sky.open);
    toFlightBtn.textContent = d.sky.toFlight;
    toFlightBtn.hidden = !graphics;
    tonightBtn.textContent = d.sky.tonight.button;
    aimBtn.textContent = d.sky.aim.button;
    forwardBtn.textContent = d.free.forward;

    labels.replaceChildren();
    dock.replaceChildren();
    labelOf.clear();
    chipOf.clear();
    const toSky = h('button', { class: 'chip chip--mode', type: 'button' }, d.sky.open);
    toSky.addEventListener('click', () => setScreen('sky'));
    dock.append(h('li', {}, toSky));
    const whole = h('button', { class: 'chip', type: 'button' }, d.dock.whole);
    whole.addEventListener('click', showWhole);
    chipOf.set('whole', whole);
    dock.append(h('li', {}, whole));
    const freeChip = h('button', { class: 'chip', type: 'button' }, d.free.title);
    freeChip.addEventListener('click', enterFree);
    chipOf.set('free', freeChip);
    dock.append(h('li', {}, freeChip));
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
    // Jupiter's moons have names over the picture, but no place in the list: they are reached from Jupiter.
    for (const id of SATELLITE_IDS) {
      const label = h('button', { class: 'label', type: 'button', tabindex: -1 }, d.satellites[id]);
      label.addEventListener('click', () => flyTo(id));
      labelOf.set(id, label);
      labels.append(label);
    }

    siteMarks.replaceChildren();
    markOf.clear();
    for (const id of SITE_IDS) {
      const mark = h('button', { class: 'label site', type: 'button', hidden: true, 'aria-label': fmt(d.sites.open, { name: missionName(d, id) }) }, String(SITES[id].mission));
      mark.addEventListener('click', () => siteDialog.open(d, lang, id, showLanding));
      markOf.set(id, mark);
      siteMarks.append(mark);
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
    const whole = !free && focus === 'sun' && !flight && view.distance > arrivalDistance('sun', radius.sun) * 1.5;
    const sky = screen === 'sky';
    title.textContent = sky ? fmt(d.sky.title, { place: cityName(place, lang) }) : flight ? fmt(d.status.flying, { name: nameOf(flight.to) }) : free ? d.free.title : whole ? d.dock.whole : fmt(d.status.at, { name: nameOf(focus) });
    placeBtn.textContent = fmt(d.sky.placeButton, { place: cityName(place, lang) });
    document.documentElement.toggleAttribute('data-night', sky && night);
    nearNow = free && !sky ? nearest(free.at, where, radius).id : null;
    nearLine.textContent = nearNow ? fmt(d.free.near, { name: nameOf(nearNow) }) : '';
    nearLine.hidden = !nearNow;
    flyBox.hidden = !free || sky;
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
    // The card is of the body looked at: no body in front of the camera — no button.
    factsBtn.hidden = sky || whole || flight !== null || free !== null;
    factsBtn.setAttribute('aria-label', fmt(d.card.open, { name: nameOf(focus) }));
    for (const [id, chip] of chipOf) {
      const here = id === 'free' ? free !== null : id === 'whole' ? whole : !whole && !free && id === (flight?.to ?? focus);
      if (here) chip.setAttribute('aria-current', 'true');
      else chip.removeAttribute('aria-current');
    }
  }

  /** Says something over the picture, or takes the words away. */
  function say(text: string): void {
    note.textContent = text;
    noteBox.hidden = text === '';
    // The note and the card of a star share one place: words that come take it, and the ring goes with the card.
    if (text !== '' && picked) {
      picked = null;
      pickCard.hide();
      pickSaid.textContent = '';
      dirty = true;
    }
  }
  noteClose.addEventListener('click', () => {
    say('');
    canvas.focus();
  });

  /** The bars cover the top and the bottom of the picture: the view centres on what is left free. */
  function measure(): void {
    // On a phone lying on its side the bars stand in columns at the sides (the styles say so with --side):
    // the picture then has the whole height under the heading and the width between the columns.
    const side = getComputedStyle(main).getPropertyValue('--side').trim() === '1';
    // With the panels hidden the picture has the whole screen, but for the two buttons of free flight.
    const top = wide ? 0 : header.getBoundingClientRect().bottom;
    // The stage, not a canvas: of the two canvases one is always hidden and has no size.
    const low = (wide || side) && flyBox.hidden ? 0 : stage.clientHeight - (side ? flyBox : bottom).getBoundingClientRect().top;
    scene.setCovered(top, low);
    skyView.setCovered(top, low);
    const right = screen === 'sky' ? skyBox : dock;
    const between = side && !wide ? right.getBoundingClientRect().left - timeBar.getBoundingClientRect().right : stage.clientWidth;
    const free = Math.max(1, Math.min(between, stage.clientHeight - top - low));
    squeeze = Math.min(stage.clientWidth, stage.clientHeight) / free;
    dirty = true;
  }

  /** The panels hidden: only the picture, the button that brings them back and, in free flight, its two buttons. */
  function setWide(next: boolean): void {
    if (next === wide) return;
    wide = next;
    main.classList.toggle('app--wide', wide);
    wideBtn.setAttribute('aria-label', wide ? d.app.showPanels : d.app.hidePanels);
    measure();
  }
  wideBtn.addEventListener('click', () => setWide(!wide));
  // Escape brings the panels back — unless a window is open: then it closes the window.
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || document.querySelector('dialog[open]')) return;
    if (picked) closePicked();
    else if (wide) setWide(false);
  });

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

  /** The sky map runs no faster than an hour a second (config.ts); the flight has every speed. */
  const fastest = () => (screen === 'sky' ? SKY.time.skyUpToRate : Infinity);
  slowerBtn.addEventListener('click', () => {
    clock = stepRate(clock, Date.now(), -1, fastest());
    retime(showsSpin(clock) ? '' : d.time.noSpin);
  });
  fasterBtn.addEventListener('click', () => {
    clock = stepRate(clock, Date.now(), 1, fastest());
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

  function fly(to: WorldId, endDistance: number, text = ''): void {
    if (free) {
      // Out of free flight: the flight starts on the very spot, looking the same way.
      const look = lookPoint(free, where, radius);
      view = { yaw: free.yaw, pitch: free.pitch, distance: look.distance };
      flight = { from: focus, fromPoint: look.target, to, startDistance: look.distance, endDistance, startedAt: performance.now(), durationMs: reducedMotion() ? 0 : SKY.flightMs };
      free = null;
      thrust = 0;
    } else if (flight) {
      // Another body chosen on the way: the new flight starts where the camera is now, not back at the start.
      const at = flightAt(flight, performance.now(), where);
      view = { ...view, distance: at.distance };
      flight = { from: focus, fromPoint: at.target, to, startDistance: at.distance, endDistance, startedAt: performance.now(), durationMs: reducedMotion() ? 0 : SKY.flightMs };
    } else {
      flight = { from: focus, to, startDistance: view.distance, endDistance, startedAt: performance.now(), durationMs: reducedMotion() ? 0 : SKY.flightMs };
    }
    say(text);
    describe();
    dirty = true;
  }

  /** Into free flight from wherever the camera is: it stays on the spot and looks the same way. */
  function enterFree(): void {
    if (free) return;
    let target = where[focus];
    if (flight) {
      const at = flightAt(flight, performance.now(), where);
      target = at.target;
      view = { ...view, distance: at.distance };
      flight = null;
    }
    free = freeFrom(target, view);
    say(d.free.note);
    describe();
    dirty = true;
  }

  /** Along the line of sight by a share of the gap to the nearest surface; below zero — backwards. */
  function moveFree(share: number): void {
    if (!free) return;
    free = advance(free, share, where, radius, farthest());
    dirty = true;
  }

  // "Forward" and "back": a press is one step, a hold flies on until it is let go.
  for (const [button, way] of [[forwardBtn, 1], [backBtn, -1]] as const) {
    let held = false;
    button.addEventListener('pointerdown', (event) => {
      held = true;
      thrust = way;
      button.setPointerCapture(event.pointerId);
    });
    const release = () => {
      thrust = 0;
    };
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('lostpointercapture', release);
    button.addEventListener('click', () => {
      // A finger or the mouse has already flown while it was down; the keyboard takes one step.
      if (!held) moveFree(way * (1 - 1 / SKY.zoomStep));
      held = false;
    });
  }

  function flyTo(id: WorldId): void {
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
    // In free flight the camera keeps its place by the nearest body: as many of its radii away, on the same side.
    const by = free ? nearest(free.at, where, radius).id : null;
    const aside = free && by ? scale(sub(free.at, where[by]), 1 / radius[by]) : null;
    mode = next;
    compute();
    refreshOrbits(true);
    if (free && by && aside) free = { ...free, at: add(where[by], scale(aside, radius[by])) };
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
      // In free flight the sky is held by the finger: a drag across the screen turns by what the screen shows.
      if (free) free = turnFree(free, (yaw * SKY.fovDeg) / SKY.turnDegPerScreen, (pitch * SKY.fovDeg) / SKY.turnDegPerScreen);
      else view = { ...view, yaw: view.yaw + yaw, pitch: clampPitch(view.pitch + pitch) };
      dirty = true;
    },
    zoom(factor) {
      if (flight) return;
      if (free) {
        // Nearer on the wheel, the keys or two fingers is forward; farther is back.
        moveFree(1 - factor);
        return;
      }
      view = { ...view, distance: clampDistance(view.distance * factor, radius[focus], farthest()) };
      describe();
      dirty = true;
    },
  });

  // ---------- the sky from a place ----------
  const skyView = createSkyView(skyCanvas);
  attachControls(skyCanvas, {
    // A finger that drags the map takes it back from the phone's tilt; a touch that only names a star does not.
    grab: () => endAim(d.sky.aim.off),
    turn(yaw, pitch) {
      if (aim.on) return;
      // The controls speak in angles of the flight view; here the sky follows the finger pixel for pixel.
      const perPixel = (SKY.turnDegPerScreen * Math.PI) / 180 / Math.max(1, Math.min(skyCanvas.clientWidth, skyCanvas.clientHeight));
      look = turnLook(look, -yaw / perPixel, pitch / perPixel, skyView.frame());
      dirty = true;
    },
    zoom(factor) {
      look = zoomLook(look, factor);
      dirty = true;
    },
    tap(x, y) {
      const found = pickAt(x, y, look, skyView.frame(), (turnNow ??= skyTurn(place, date)));
      // A planet's mark wins over the stars; the mark of a galaxy, a nebula or a cluster wins over a star
      // beside it — its card tells more — and over a planet when the finger is nearer to it (Uranus by the
      // Pleiades); the name of a constellation wins over the stars when the finger is on its letters, or
      // near them with no star in reach.
      const deep = deepUnder(x, y, skyView.frame(), found);
      const figure = found?.kind === 'body' || deep ? null : skyView.figureAt(x, y);
      if (deep) showDeep(deep.id);
      else if (figure && (figure.gap === 0 || !found)) showConstellation(figure.id);
      else if (found) showPicked(found, true);
      else closePicked();
    },
    pick() {
      const middle = skyView.frame();
      const found = pickAt(middle.cx, middle.cy, look, middle, (turnNow ??= skyTurn(place, date)));
      const deep = deepUnder(middle.cx, middle.cy, middle, found);
      if (deep) showDeep(deep.id);
      else if (found) showPicked(found, true);
      else say(d.sky.pick.none);
    },
  });

  // ---------- the sky follows the phone (a trial) ----------
  const aim = createAim({
    look(azimuth, altitude) {
      look = { ...look, azimuth, altitude };
      dirty = true;
    },
    needsLevel: () => say(d.sky.aim.level),
    ended(why) {
      aimBtn.setAttribute('aria-pressed', 'false');
      say(why === 'denied' ? d.sky.aim.denied : d.sky.aim.none);
    },
  });
  aimBtn.hidden = !aim.offered;
  /** Gives the map back to the finger; `words` — what is said about it, none when something else speaks. */
  function endAim(words = ''): void {
    if (!aim.on) return;
    aim.stop();
    aimBtn.setAttribute('aria-pressed', 'false');
    if (words) say(words);
  }
  aimBtn.addEventListener('click', () => {
    if (aim.on) {
      endAim(d.sky.aim.off);
      return;
    }
    void aim.start().then(() => {
      if (!aim.on) return;
      aimBtn.setAttribute('aria-pressed', 'true');
      say(d.sky.aim.on);
    });
  });

  /**
   * The card of a star or a body on the sky map, with a ring round it. `aloud` — said to a screen reader:
   * so when it was picked, not each time the running clock rewrites the card.
   */
  function showPicked(what: Picked, aloud: boolean): void {
    picked = what;
    say('');
    const id = what.kind === 'body' ? what.id : null;
    const fly = id && graphics ? () => {
      closePicked();
      setScreen('flight');
      flyTo(id);
    } : null;
    const info = skyInfo(what, (turnNow ??= skyTurn(place, date)));
    // Jupiter over the horizon: its four moons as binoculars show them at this moment.
    const moons = id === 'jupiter' && info.altitude > 0 ? moonsBesideJupiter(turnNow) : null;
    // A star's card leads to the card of its constellation; a planet only passes through one.
    const about = what.kind === 'star' && info.constellation in d.sky.constellations ? () => showConstellation(info.constellation) : null;
    pickCard.show(d, lang, info, fly, moons, about);
    pickShownAt = performance.now();
    // Freshly picked and hidden by its own card (a low screen, a star low in the view): the sky moves up
    // just enough for it to stand over the card.
    if (aloud && !aim.on) {
      const card = pickCard.el.getBoundingClientRect();
      const from = stage.getBoundingClientRect();
      const at = project(look, skyView.frame(), pickedInSky(what, turnNow));
      const gap = SKY.pick.overCardPx;
      if (at && at.x + from.left > card.left - gap && at.x + from.left < card.right + gap && at.y + from.top > card.top - gap && at.y + from.top < card.bottom) {
        look = turnLook(look, 0, card.top - gap - (at.y + from.top), skyView.frame());
      }
    }
    if (aloud) pickSaid.textContent = [...pickCard.el.querySelectorAll('h2, .pick__row')].map((part) => part.textContent).join('. ');
    dirty = true;
  }
  /** The card of a constellation: its story, if one is written, and what the program works out about it. */
  function showConstellation(id: string): void {
    constellationDialog.open(d, lang, id, place, (turnNow ??= skyTurn(place, date)), showDeep);
  }
  /** The galaxy, nebula or cluster a touch means, given the star or body found under it; null — none. */
  function deepUnder(x: number, y: number, frame: Frame, found: Picked | null): DeepObject | null {
    if (!layers.deep) return null;
    const turn = (turnNow ??= skyTurn(place, date));
    const o = deepAt(x, y, look, frame, turn);
    if (!o || found?.kind !== 'body') return o;
    return deepNearerThanBody(x, y, look, frame, turn, o, pickedInSky(found, turn)) ? o : null;
  }
  /** The card of a galaxy, a nebula or a star cluster. */
  function showDeep(id: string): void {
    const o = deepById(id);
    if (!o) return;
    closePicked();
    deepDialog.open(d, lang, o, place, (turnNow ??= skyTurn(place, date)), () => showConstellation(o.constellation));
  }
  /** Takes the card and the ring away. */
  function closePicked(): void {
    if (!picked) return;
    picked = null;
    pickCard.hide();
    pickSaid.textContent = '';
    dirty = true;
    if (screen === 'sky') skyCanvas.focus({ preventScroll: true });
  }
  pickCard.onClose(closePicked);

  /** What is said on coming to the sky: whose sky it is, how to look around, and what is not as in life. */
  function skyNote(): string {
    const sunUp = altAz(bodyInSky('sun', skyTurn(place, date))).altitude > 0;
    return `${graphics ? '' : `${d.status.noGraphics} `}${fmt(d.sky.note, { place: cityName(place, lang) })}${sunUp ? ` ${d.sky.dayNote}` : ''}`;
  }

  function setScreen(next: 'flight' | 'sky'): void {
    if (next === screen || (next === 'flight' && !graphics)) return;
    screen = next;
    const sky = screen === 'sky';
    thrust = 0;
    closePicked();
    endAim();
    // A clock that ran a week a second in the flight slows to the sky's fastest.
    if (sky) clock = slowedTo(clock, Date.now(), SKY.time.skyUpToRate);
    canvas.hidden = sky;
    labels.hidden = sky;
    siteMarks.hidden = sky;
    skyCanvas.hidden = !sky;
    dock.hidden = sky;
    scaleBar.hidden = sky;
    skyBox.hidden = !sky;
    say(sky ? skyNote() : '');
    describe();
    measure();
    // The hidden canvas had no size: the window may have changed while the other mode was on.
    if (sky) skyView.resize();
    else scene.resize();
    (sky ? skyCanvas : canvas).focus({ preventScroll: true });
  }
  toFlightBtn.addEventListener('click', () => setScreen('flight'));
  placeBtn.addEventListener('click', () =>
    placeDialog.open(d, lang, place, (city) => {
      place = city;
      turnNow = null;
      keep();
      describe();
      dirty = true;
    }),
  );
  /** A planet from "Tonight": the clock goes to its best moment and stops, the view turns to it. */
  function showPlanet(planet: PlanetTonight): void {
    if (!planet.seen) return;
    endAim();
    clock = jumpTo(clock, Date.now(), planet.seen.best.getTime());
    look = { ...look, azimuth: planet.seen.azimuth, altitude: Math.max(planet.seen.altitude, SKY.dome.firstLook.altitude) };
    const moment = new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit' }).format(planet.seen.best);
    retime(fmt(d.sky.tonight.shown, { name: d.bodies[planet.id], date: moment }));
  }
  /** An event of the year: the clock goes to the moment it is seen from the place and stops, the view turns to it, a ring marks the body. */
  function showEvent(event: SkyEvent): void {
    if (!event.view) return;
    endAim();
    clock = jumpTo(clock, Date.now(), event.view.at.getTime());
    look = { ...look, azimuth: event.view.azimuth, altitude: Math.max(event.view.altitude, SKY.dome.firstLook.altitude) };
    retime(fmt(d.sky.events.shown, { name: eventName(d, event), when: eventMoment(d, lang, event.view.at) }));
    // the ring without the card: the note has the card's place and says what is shown
    picked = { kind: 'body', id: eventBody(event) };
    dirty = true;
  }
  tonightBtn.addEventListener('click', () => tonightDialog.open(d, lang, place, date, showPlanet, showEvent));

  /** From the Moon's card to a landing place: the Moon turns that place to the camera, and its window opens. */
  function showSite(id: SiteId): void {
    if (focus === 'moon' && !flight && !free) {
      view = { ...view, ...facing(surfaceDirection(turned.moon, SITES[id].lat, SITES[id].lon)) };
      dirty = true;
    }
    siteDialog.open(d, lang, id, showLanding);
  }

  /** The minute of a landing: time stands there, the camera flies to the Moon and the Moon turns the place to it. */
  function showLanding(id: SiteId): void {
    const landed = new Date(SITES[id].landed);
    const time = new Intl.DateTimeFormat(lang, { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }).format(landed);
    const text = fmt(d.sites.moment.shown, { name: missionName(d, id), date: dayUT(lang, SITES[id].landed), time, altitude: num(lang, sunOverSite(id, landed)) });
    clock = jumpTo(clock, Date.now(), landed.getTime());
    retime(text);
    view = { ...view, ...facing(surfaceDirection(turned.moon, SITES[id].lat, SITES[id].lon)) };
    fly('moon', arrivalDistance('moon', radius.moon), text);
  }

  // The card is of the body looked at: a moon of Jupiter has its own, shorter one.
  factsBtn.addEventListener('click', () => (isSatellite(focus) ? satelliteDialog.open(d, lang, focus) : factsDialog.open(d, lang, focus, date, showSite, flyTo)));

  menuBtn.addEventListener('click', () =>
    menu.open(
      d,
      lang,
      (code) => {
        lang = code;
        d = dict(lang);
        keep();
        menu.el.close();
        // A note written in the old language is not left on the screen: the sky's is said again, others go.
        if (!noteBox.hidden) say(screen === 'sky' ? skyNote() : '');
        build();
      },
      {
        figures: layers.figures,
        names: layers.names,
        deep: layers.deep,
        night,
        toggle(choice) {
          if (choice === 'night') night = !night;
          else layers = { ...layers, [choice]: !layers[choice] };
          keep();
          describe();
          skyView.restyle();
          dirty = true;
        },
      },
    ),
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
    const aim = flight?.to ?? focus;
    // Jupiter's moons are named only by Jupiter: from afar their names would only crowd its own.
    const byJupiter = aim === 'jupiter' || isSatellite(aim) || (free !== null && nearNow !== null && (nearNow === 'jupiter' || isSatellite(nearNow)));
    for (const id of SATELLITE_IDS) if (!byJupiter) (labelOf.get(id) as HTMLButtonElement).hidden = true;
    const order: WorldId[] = [aim, ...BODY_IDS.filter((id) => id !== aim && parentOf(id) !== 'earth'), 'moon', ...(byJupiter ? SATELLITE_IDS : [])];
    const seen = new Set<WorldId>();
    for (const id of order) {
      if (seen.has(id)) continue;
      seen.add(id);
      const label = labelOf.get(id);
      if (!label) continue;
      const at = scene.onScreen(id);
      // A name is drawn only with its dot on the screen, and only where it does not run into a name already placed.
      const inside = at && at.x > 6 && at.y > 0 && at.x < canvas.clientWidth && at.y < canvas.clientHeight;
      const box = at ? { left: at.x - 10, right: at.x + (labelWidth.get(id) ?? 0) + 4, y: at.y } : null;
      const room = box && taken.every((t) => Math.abs(t.y - box.y) > SKY.labelRowPx || box.left > t.right || box.right < t.left);
      // A body that fills the view needs no name on its face: the title says what it is.
      // In free flight that is the nearest body, named under the title.
      const shortSide = Math.min(canvas.clientWidth, canvas.clientHeight);
      const large = free
        ? id === nearNow && radiusOnScreenPx(radius[id], length(sub(cameraAt, where[id])), shortSide) > SKY.labelHiddenFromPx
        : id === focus && !flight && focusOnScreenPx() > SKY.labelHiddenFromPx;
      label.hidden = !(at && inside && room) || large;
      if (!at || !box || label.hidden) continue;
      taken.push(box);
      label.style.transform = `translate(${at.x.toFixed(1)}px, ${at.y.toFixed(1)}px)`;
      label.classList.toggle('is-here', id === focus && !flight && !free);
    }
  }

  // ---------- the landing places on the Moon ----------
  function placeSites(): void {
    // Wherever the camera is tied or free: the marks are there once the Moon is seen large enough.
    const moonPx = radiusOnScreenPx(radius.moon, length(sub(cameraAt, where.moon)), Math.min(canvas.clientWidth, canvas.clientHeight));
    const shown = !flight && (free !== null || focus === 'moon') && moonPx >= SKY.sites.showFromPx;
    const at = new Map<SiteId, { x: number; y: number }>();
    if (shown) {
      for (const id of SITE_IDS) {
        const point = scene.surfaceOnScreen('moon', surfaceDirection(turned.moon, SITES[id].lat, SITES[id].lon));
        const apart = [...at.values()].every((other) => Math.hypot(other.x - (point?.x ?? 0), other.y - (point?.y ?? 0)) >= SKY.sites.apartPx);
        if (point && apart && point.facing > SKY.sites.facing && point.x > 0 && point.y > 0 && point.x < canvas.clientWidth && point.y < canvas.clientHeight) at.set(id, point);
      }
    }
    for (const [id, mark] of markOf) {
      const point = at.get(id);
      mark.hidden = !point;
      if (!point) continue;
      // The number stands on the side away from the nearest other mark, so two close places stay readable.
      let nearest: { x: number; y: number } | null = null;
      for (const [other, p] of at) {
        if (other !== id && (!nearest || Math.hypot(p.x - point.x, p.y - point.y) < Math.hypot(nearest.x - point.x, nearest.y - point.y))) nearest = p;
      }
      mark.classList.toggle('site--left', nearest !== null && nearest.x > point.x);
      mark.style.transform = `translate(${point.x.toFixed(1)}px, ${point.y.toFixed(1)}px)`;
    }
  }

  // ---------- the loop: a frame is drawn only when something has changed ----------
  let lastFrame = performance.now();
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
    const elapsed = Math.min(0.1, Math.max(0, (now - lastFrame) / 1000));
    lastFrame = now;
    if (screen === 'sky') {
      if (dirty) {
        dirty = false;
        const moved = turnNow === null;
        turnNow ??= skyTurn(place, date);
        // The moment or the place has changed: the card tells where the star stands now — at most once a second.
        if (moved && picked && pickCard.shown && now - pickShownAt > 1000) showPicked(picked, false);
        skyView.draw({ look, turn: turnNow, layers, lang, d, picked });
      }
      window.requestAnimationFrame(frame);
      return;
    }
    if (free && thrust !== 0) {
      moveFree(thrust * SKY.free.holdSharePerSecond * elapsed);
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
      if (free) {
        // A body that the clock has carried over the camera pushes it out of the way.
        free = { ...free, at: keepOutside(free.at, where, radius) };
        target = lookPoint(free, where, radius).target;
        if (nearest(free.at, where, radius).id !== nearNow) describe();
      }
      cameraAt = free ? free.at : eye(target, view);
      scene.draw({ where, radius, turned, ring: sceneRing(mode), shade, target, eye: cameraAt });
      placeLabels();
      placeSites();
    }
    window.requestAnimationFrame(frame);
  }

  window.addEventListener('resize', () => {
    scene.resize();
    skyView.resize();
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
  if (!graphics) setScreen('sky');
  window.requestAnimationFrame(frame);
}
