// The picture file of each body's photo. A file is fetched only when its card is opened.
import type { BodyId } from '../core/bodies.ts';

const files = import.meta.glob<string>('../photos/*.webp', { eager: true, query: '?url', import: 'default' });

export function photoUrl(id: BodyId): string {
  const url = files[`../photos/${id}.webp`];
  if (!url) throw new Error(`No photo of ${id}`);
  return url;
}
