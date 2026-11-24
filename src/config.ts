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
  /** Points of an orbit's line (C). */
  orbitPoints: 256,
  /** Where the outer edge of ring A lies across the ring texture, 0…1 — measured on the texture itself. */
  ringTextureAOuterAt: 0.9404,
} as const;
