// A small flag beside the name of a language, drawn here (no picture files, no emoji: some systems have no
// flag emoji at all). A language is not a country — the flag only helps to find one's own line at a glance;
// English, spoken in many countries, has the flag of the United Kingdom. Colours: the "Colours" tables of
// en.wikipedia.org/wiki/Flag_of_Ukraine, Flag_of_Hungary, Flag_of_the_United_Kingdom (read on 24.11.2026).
const WIDTH = 28;
const HEIGHT = 20;

const stripes = (colours: string[]) => colours.map((fill, i) => `<rect y="${(i * HEIGHT) / colours.length}" width="${WIDTH}" height="${HEIGHT / colours.length}" fill="${fill}"/>`).join('');

/** The Union Flag on a field of the given size: the crosses of Saint George, Saint Andrew and Saint Patrick. */
function unionFlag(id: string): string {
  const blue = '#012169';
  const red = '#C8102E';
  const diagonals = `M0,0 L${WIDTH},${HEIGHT} M${WIDTH},0 L0,${HEIGHT}`;
  const cross = `M${WIDTH / 2},0 V${HEIGHT} M0,${HEIGHT / 2} H${WIDTH}`;
  // Saint Patrick's red diagonals are shifted to one side of the white ones: each quarter shows half of them.
  const halves = `M${WIDTH / 2},${HEIGHT / 2} H${WIDTH} V${HEIGHT} Z M${WIDTH / 2},${HEIGHT / 2} V${HEIGHT} H0 Z M${WIDTH / 2},${HEIGHT / 2} H0 V0 Z M${WIDTH / 2},${HEIGHT / 2} V0 H${WIDTH} Z`;
  return (
    `<clipPath id="${id}"><path d="${halves}"/></clipPath>` +
    `<rect width="${WIDTH}" height="${HEIGHT}" fill="${blue}"/>` +
    `<path d="${diagonals}" stroke="#FFFFFF" stroke-width="4"/>` +
    `<path d="${diagonals}" stroke="${red}" stroke-width="2.6" clip-path="url(#${id})"/>` +
    `<path d="${cross}" stroke="#FFFFFF" stroke-width="6.6"/>` +
    `<path d="${cross}" stroke="${red}" stroke-width="4"/>`
  );
}

const DRAW: Record<string, (id: string) => string> = {
  uk: () => stripes(['#0057B7', '#FFD700']),
  hu: () => stripes(['#CE2939', '#FFFFFF', '#477050']),
  en: unionFlag,
};

let count = 0;

/** The flag of a language as a picture; null — no flag is drawn for this language. */
export function flagOf(lang: string): SVGSVGElement | null {
  const draw = DRAW[lang];
  if (!draw) return null;
  const holder = document.createElement('div');
  holder.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="flag" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" aria-hidden="true" focusable="false">${draw(`flag-clip-${count++}`)}</svg>`;
  return holder.querySelector('svg');
}

/** The languages a flag is drawn for — for the test that every language of the app has one. */
export const FLAG_LANGS = Object.keys(DRAW);
