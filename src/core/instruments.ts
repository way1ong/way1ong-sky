// The instruments of astronomers, from the gnomon to the space telescopes: which there are, in what order,
// and which pages each card is written after. The cards themselves are texts of the dictionaries
// (`instruments.items`) and drawings made for the program (ui/diagrams); the sentences of the sources are
// in docs/INSTRUMENTS.md.
import file from '../data/instruments.json';

/** An article of Wikipedia a card is written after: its address and the revision that was read. */
export interface InstrumentPage {
  title: string;
  url: string;
  revision: number;
}

export interface Instrument {
  /** The key of its texts and of its drawing. */
  id: InstrumentId;
  /** Wikipedia's articles by language (en, uk, hu); none — the card follows the agencies' pages alone. */
  pages: Readonly<Partial<Record<string, readonly InstrumentPage[]>>>;
  /** Pages of NASA and ESA the card is written after. */
  agency: readonly string[];
  /** An old engraving of the instrument (Wikimedia Commons, public domain): the page of its file and the size of the copy in the program. */
  picture?: { page: string; width: number; height: number };
}

export const INSTRUMENT_IDS = ['gnomon', 'armillary', 'astrolabe', 'quadrant', 'refractor', 'reflector', 'spectroscope', 'plate', 'radio', 'hubble', 'webb'] as const;
export type InstrumentId = (typeof INSTRUMENT_IDS)[number];

/** In the order of the section: from the oldest to the newest. */
export const INSTRUMENTS: readonly Instrument[] = file.instruments as unknown as Instrument[];

export const INSTRUMENT_SOURCE = file.source;

export function instrumentById(id: string): Instrument | undefined {
  return INSTRUMENTS.find((one) => one.id === id);
}

/** The one before and the one after in the section; undefined at its ends. */
export function neighbours(id: InstrumentId): { before: Instrument | undefined; after: Instrument | undefined } {
  const at = INSTRUMENTS.findIndex((one) => one.id === id);
  return { before: at > 0 ? INSTRUMENTS[at - 1] : undefined, after: at >= 0 ? INSTRUMENTS[at + 1] : undefined };
}

/**
 * The articles to name under a card read in a language: the language's own and the English ones (most of
 * the sentences come from them), each once. Empty — the card owes nothing to Wikipedia.
 */
export function instrumentCredit(one: Instrument, lang: string): { lang: string; page: InstrumentPage }[] {
  const out: { lang: string; page: InstrumentPage }[] = [];
  for (const key of lang === 'en' ? ['en'] : [lang, 'en']) for (const page of one.pages[key] ?? []) out.push({ lang: key, page });
  return out;
}

/** Whose page an agency's address is: the key of its name in the dictionaries. */
export function agencyOf(url: string): 'nasa' | 'esa' {
  return new URL(url).hostname.endsWith('nasa.gov') ? 'nasa' : 'esa';
}
