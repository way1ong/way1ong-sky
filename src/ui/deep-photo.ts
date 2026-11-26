// The picture file of each galaxy, nebula and cluster. A file is fetched only when its card is opened.
const files = import.meta.glob<string>('../deep/*.webp', { eager: true, query: '?url', import: 'default' });

/** The address of an object's photograph; undefined — the program has none. */
export function deepPhotoUrl(id: string): string | undefined {
  return files[`../deep/${id}.webp`];
}
