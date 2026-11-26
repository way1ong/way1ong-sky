// The picture file of each old engraving of an instrument. A file is fetched only when its card is opened.
const files = import.meta.glob<string>('../instruments/*.webp', { eager: true, query: '?url', import: 'default' });

/** The address of an instrument's engraving; undefined — the program has none. */
export function instrumentPictureUrl(id: string): string | undefined {
  return files[`../instruments/${id}.webp`];
}
