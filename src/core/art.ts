// Old drawings of the constellations for their cards: plates of the star atlas "Urania's Mirror" (1825),
// public domain, from Wikimedia Commons. Which file each drawing is, what else is on its plate and who is
// to be named under it — src/data/constellation-art.json; what the file pages say — docs/ART.md.
import data from '../data/constellation-art.json';

export interface Plate {
  /** The page of the file on Wikimedia Commons. */
  page: string;
  /** The size of the picture in the program, px. */
  width: number;
  height: number;
  /** A part of a plate that shows several constellations, cut out round this one. */
  part: boolean;
  /** Whose scan it is: a key of the dictionary (`sky.story.art.holders`). */
  holder: 'loc' | 'nms' | 'dolby';
  /** The scan was restored by the person the set names, who asks to be named. */
  restored: boolean;
}

export const PLATES = data.plates as unknown as Readonly<Record<string, Plate>>;
export const ART_SET = data.set;
