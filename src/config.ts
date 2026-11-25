// Every number of the app's own making lives here (docs/SPEC.md); numbers about the Solar System itself come
// from NASA's fact sheets (src/data/bodies.json) and from astronomy-engine. (C) = Claude's choice within the
// approved plan; change it here, not in the code.

export const SKY = {
  /** The working name until the final one is chosen (docs/DECISIONS.md). */
  name: 'way1ong Sky',
  /** The studio's site for the "Made by way1ong" line; null — no link yet. */
  links: { site: 'https://way1ong.eu' as string | null },
  /** Where the app lives (decision of 24.11); wrangler.jsonc names the same domain — a test keeps them equal. */
  address: 'https://sky.way1ong.eu',

  /** True scale: scene units per kilometre (one unit is a million kilometres) (C). */
  trueUnitsPerKm: 1e-6,
  /**
   * Handy scale (C): everything fits one look. A body `d` astronomical units from the Sun is drawn
   * `distance * d^distancePower` units away; a body `r` Earth radii across is drawn `radius * r^radiusPower`
   * units in radius; a moon keeps its direction and stands `moonGap` radii of its planet from the planet's
   * middle.
   */
  handy: { distance: 16, distancePower: 0.5, radius: 0.5, radiusPower: 0.4, moonGap: 2.2 },

  /** The camera, in radii of the body it looks at (C): how close it may come, where a flight ends. */
  camera: { closest: 1.25, arrive: 4, arriveSun: 9 },
  /** The first look and "the whole system": the Sun, from so far that this body's orbit fits the screen (C). */
  overview: { first: 'mars', whole: 'neptune', pitchDeg: 35 },
  /** A flight from body to body takes this long, ms; with "reduce motion" in the system — no time at all (C). */
  flightMs: 1800,
  /** Field of view of the camera, degrees, measured across the shorter side of the screen (C). */
  fovDeg: 45,
  /** A drag across the whole shorter side of the screen turns the view by this many degrees (C). */
  turnDegPerScreen: 180,
  /** One step of the wheel or of the +/- keys changes the distance by this factor (C). */
  zoomStep: 1.15,
  /** The name of the body looked at is not drawn over it once the body is wider than this on the screen, CSS px (C). */
  labelHiddenFromPx: 18,
  /**
   * Time (C): the speeds the player steps through, seconds of the Solar System per second of the clock —
   * backwards, real time, forwards; the years the calendar may be set to; and the speed above which the
   * bodies are no longer turned (a globe spinning many times a second only flickers).
   */
  time: {
    rates: [-2_592_000, -604_800, -86_400, -3_600, 1, 3_600, 86_400, 604_800, 2_592_000],
    names: ['month', 'week', 'day', 'hour', 'real', 'hour', 'day', 'week', 'month'],
    fromYear: 1900,
    toYear: 2100,
    spinUpToRate: 86_400,
    /** The hour and minute are written up to this speed; faster, only the day — the digits would only flash. */
    clockUpToRate: 3_600,
    /**
     * The sky map runs no faster than this, forwards or backwards (the owner's decision of 25.11: an hour a
     * second is enough, faster the sky only flickers). The flight keeps every speed.
     */
    skyUpToRate: 3_600,
  },
  /**
   * In a shadow (C): what is left of a body's light where another body hides the whole Sun. The Moon in the
   * Earth's shadow keeps a dim copper glow (in life it varies from eclipse to eclipse — this is a picture,
   * not a measurement); the Earth under the Moon's shadow goes dark.
   */
  shade: { moon: [0.2, 0.065, 0.035], earth: [0.03, 0.03, 0.04] },
  /**
   * To watch an eclipse the camera stands on the sunlit side of the body in shadow, this far to the side of
   * the line to the Sun, degrees (C) — far enough that the body casting the shadow, drawn large and near in
   * the handy scale, does not hide the view.
   */
  eclipseViewOffsetDeg: { moon: 50, earth: 35 },
  /** Two names over the picture share a row, and must not overlap, when their dots are closer in height than this, CSS px (C). */
  labelRowPx: 24,
  /**
   * Landing places on the Moon (C): their marks are drawn once the Moon is at least this wide on the screen
   * (its radius, CSS px), and only for places turned towards the camera by more than `facing` — the cosine of
   * the angle between the place and the line to the camera — so no mark sits on the very edge of the disc.
   * Of two places nearer on the screen than `apartPx` only the earlier landing keeps its mark: two marks on
   * one spot cannot be told apart by a finger (the other is in the Moon's card, and appears on coming nearer).
   */
  sites: { showFromPx: 60, facing: 0.15, apartPx: 26 },
  /**
   * Free flight (C): while "forward" or "back" is held, the camera covers this share of the gap to the nearest
   * body's surface every second. One press of a key or one notch of the wheel is a step of `zoomStep`.
   */
  free: { holdSharePerSecond: 1.2 },
  /**
   * The sky from a place (C). `fov` — how wide the view is across the shorter side of the screen, degrees: at
   * first, the narrowest and the widest. `firstLook` — where the view looks at first: the bearing (south) and
   * the height over the horizon. `behind` — how far behind the view's edge things are still worked out, as
   * the cosine of the angle from the middle of the view.
   */
  dome: { fov: { first: 100, least: 25, most: 130 }, firstLook: { azimuth: 180, altitude: 35 }, behind: -0.25 },
  /**
   * How the sky is painted (C) — choices of the picture, not measurements:
   * `star` — the radius of a star's dot, CSS px, from the brightest (`brightMag`) to the faintest in the file;
   * `faintest` — the wider the view, the fewer faint stars are drawn: the limit at the widest and the narrowest view;
   * `named` — stars this bright get their names, at the widest and the narrowest view;
   * `daylight` — the sky turns from night to day colour while the Sun climbs from `from` to `to` degrees over
   *   the horizon, and at full day the stars are drawn `starsLeft` as strong;
   * `discPx` — the radii of the Sun's, the Moon's and a planet's marks; `faintPlanet` — a planet too faint for
   *   the eye (`tonight.eyeMagnitude`) gets a smaller mark, drawn `strength` as strong, so that it is not taken
   *   for a bright one; `labelGapPx` — room kept between names.
   */
  paint: {
    star: { brightMag: -1.5, brightPx: 3.4, faintPx: 0.55 },
    faintest: { wide: 5.2, narrow: 6.5 },
    named: { wide: 1.6, narrow: 3.5 },
    daylight: { from: -12, to: 2, starsLeft: 0.12 },
    discPx: { sun: 9, moon: 8, planet: 3.5 },
    faintPlanet: { px: 2, strength: 0.6 },
    labelGapPx: 4,
  },
  /**
   * "Tonight" (C) — the program's own measures of what can be seen, not definitions of astronomy:
   * `darkSunAltitude` — it counts as dark once the Sun is this far under the horizon, degrees;
   * `leastAltitude` — a planet counts as seen when it is at least this high, clear of roofs and haze;
   * `stepMinutes` — how finely the night is looked through;
   * `eyeMagnitude` — a planet fainter than this is told to be too faint for the eye: the map does draw
   *   fainter stars, but a planet that faint cannot be told from them without a chart and a dark sky.
   */
  tonight: { darkSunAltitude: -6, leastAltitude: 5, stepMinutes: 10, eyeMagnitude: 5 },
  /** Points of an orbit's line (C). */
  orbitPoints: 256,
  /** Where the outer edge of ring A lies across the ring texture, 0…1 — measured on the texture itself. */
  ringTextureAOuterAt: 0.9404,
} as const;
