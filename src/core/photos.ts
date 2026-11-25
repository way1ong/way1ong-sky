// One photo of every body, from NASA's image library: which record it is and who is to be named under it.
// The picture files live in src/photos/; what each caption rests on is in docs/PHOTOS.md.
import data from '../data/photos.json';
import type { BodyId } from './bodies.ts';

export type Photo = { nasaId: string; title: string; credit: string; page: string };

export const PHOTOS: Record<BodyId, Photo> = data.photos;
export const PHOTO_RULES = data.rules;
export const PHOTO_LIBRARY = data.library;
