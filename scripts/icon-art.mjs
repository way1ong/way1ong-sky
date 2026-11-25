// The app's icon: a ringed planet among three stars. Our own picture; the colours are the app's tokens.
export const TOKENS = { ground: '--bg', planet: '--accent', ring: '--text', star: '--star' };

/** The picture on a square of `size`; `full` — the ground fills the square (maskable, Apple), else rounded. */
export function picture(size, { full, share }, C) {
  const c = size / 2;
  const r = (size * share) / 2;
  const planet = r * 0.56;
  const tilt = -24;
  const ringW = r * 0.085;
  // The ring: an ellipse around the planet; its far half is drawn first, so the planet hides it.
  const ring = (half) =>
    `<path d="M ${c - r} ${c} A ${r} ${r * 0.3} 0 0 ${half === 'far' ? 1 : 0} ${c + r} ${c}" fill="none" stroke="${C.ring}" stroke-width="${ringW}" stroke-linecap="round" transform="rotate(${tilt} ${c} ${c})"/>`;
  const star = (x, y, s) => `<circle cx="${c + x * r}" cy="${c + y * r}" r="${r * s}" fill="${C.star}"/>`;
  const ground = full ? `<rect width="${size}" height="${size}" fill="${C.ground}"/>` : `<rect width="${size}" height="${size}" rx="${size * 0.22}" fill="${C.ground}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${ground}${star(-0.92, -0.86, 0.07)}${star(0.86, -0.98, 0.05)}${star(0.7, 0.98, 0.06)}${ring('far')}<circle cx="${c}" cy="${c}" r="${planet}" fill="${C.planet}"/>${ring('near')}</svg>`;
}

/** How much of the square the picture takes: browser tab and launcher, maskable (the middle 80 % stays), Apple. */
export const SHARE = { plain: 0.62, maskable: 0.5, apple: 0.58 };
