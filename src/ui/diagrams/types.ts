// A drawing of how an instrument works, made for the program: lines and shapes written by hand, and the
// places of its labels — the words of the labels are the dictionaries' (`instruments.items.<id>.labels`).
// The colours are classes of app.css, so the drawings follow the theme and the night mode.

export interface DiagramLabel {
  /** The key of the word in the dictionary. */
  key: string;
  x: number;
  y: number;
  /** Where the word stands by its point: it starts there, ends there or is centred on it. */
  anchor?: 'start' | 'middle' | 'end';
  /** A second line of a label, quieter. */
  quiet?: boolean;
}

export interface Diagram {
  /** The size of the drawing's own grid. */
  width: number;
  height: number;
  /**
   * The shapes, as SVG written here by hand (never text from outside). Classes: dg-line — the body of the
   * instrument; dg-ray — light; dg-glass — lenses and mirrors; dg-soft — a quiet line; dg-fill — a body.
   */
  shapes: string;
  labels: readonly DiagramLabel[];
}
