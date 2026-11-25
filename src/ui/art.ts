// The picture file of each old drawing of a constellation. A file is fetched only when its card is opened.
const files = import.meta.glob<string>('../art/*.webp', { eager: true, query: '?url', import: 'default' });

/** The address of a constellation's drawing; undefined — the program has none. */
export function artUrl(id: string): string | undefined {
  return files[`../art/${id}.webp`];
}
