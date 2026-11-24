// The picture file of each landing place's photo. A file is fetched only when its window is opened.
import type { SiteId } from '../core/sites.ts';

const files = import.meta.glob<string>('../photos/sites/*.webp', { eager: true, query: '?url', import: 'default' });

export function sitePhotoUrl(id: SiteId): string {
  const url = files[`../photos/sites/${id}.webp`];
  if (!url) throw new Error(`No photo of ${id}`);
  return url;
}
