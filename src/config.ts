// Every number of the app's own making lives here (docs/SPEC.md); numbers about the Solar System itself come
// from NASA's fact sheets (src/data/bodies.json) and from astronomy-engine. (C) = Claude's choice within the
// approved plan; change it here, not in the code.

export const SKY = {
  /** The working name until the final one is chosen (docs/DECISIONS.md). */
  name: 'way1ong Sky',
  /** The studio's site for the "Made by way1ong" line; null — no link yet. */
  links: { site: 'https://way1ong.eu' as string | null },

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
   */
  sites: { showFromPx: 60, facing: 0.15 },
  /**
   * Free flight (C): while "forward" or "back" is held, the camera covers this share of the gap to the nearest
   * body's surface every second. One press of a key or one notch of the wheel is a step of `zoomStep`.
   */
  free: { holdSharePerSecond: 1.2 },
  /** Points of an orbit's line (C). */
  orbitPoints: 256,
  /** Where the outer edge of ring A lies across the ring texture, 0…1 — measured on the texture itself. */
  ringTextureAOuterAt: 0.9404,
} as const;
