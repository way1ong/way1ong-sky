// "What if you were here?" in a body's card: an age and a weight typed in, the age counted in the planet's
// years and what a scale would show there. What is typed lives only while the app is open: never saved,
// never sent.
import { GIANT_IDS, type BodyId, type PlanetId } from '../core/bodies.ts';
import { YOU_LIMITS, scaleThere, typedNumber, yearsThere } from '../core/you.ts';
import { h } from './dom.ts';
import { fmt, num, plural, type Dict } from './i18n.ts';

// The same person looks at one card after another: what was typed is kept for the next card, in memory only.
const typed = { age: '', weight: '' };

/** Null — the body has nothing to say about a visitor (the Earth, the Sun). */
export function youSection(d: Dict, lang: string, id: BodyId): HTMLElement | null {
  if (yearsThere(id, 1) === null && scaleThere(id, 1) === null) return null;
  const t = d.card.you;
  const field = (key: 'age' | 'weight', label: string) => {
    const input = h('input', { id: `you-${key}`, type: 'text', inputmode: 'decimal', autocomplete: 'off', maxlength: 6, value: typed[key] });
    return { input, el: h('div', { class: 'field' }, h('label', { for: `you-${key}` }, label), input) };
  };
  const age = field('age', t.age);
  const weight = field('weight', t.weight);
  const out = h('p', { class: 'you__out', role: 'status' });
  const tell = () => {
    typed.age = age.input.value;
    typed.weight = weight.input.value;
    const years = typedNumber(typed.age, YOU_LIMITS.ageMost);
    const kg = typedNumber(typed.weight, YOU_LIMITS.weightMostKg);
    const there = years === null ? null : yearsThere(id, years);
    const scale = kg === null ? null : scaleThere(id, kg);
    const lines: string[] = [];
    if (there !== null) {
      // A whole number where it reads as an age; a tenth where the age is small (a year on Neptune is long).
      const shown = there >= 10 ? Math.round(there) : Number(there.toFixed(1));
      lines.push(plural(lang, shown, t.years, num(lang, shown, 1)));
    }
    if (scale !== null) {
      lines.push(fmt(t.scale, { n: num(lang, scale, scale < 10 ? 1 : 0) }));
      if (GIANT_IDS.includes(id as PlanetId)) lines.push(t.giant);
    }
    out.textContent = lines.join(' ');
    out.hidden = lines.length === 0;
  };
  age.input.addEventListener('input', tell);
  weight.input.addEventListener('input', tell);
  tell();
  // The Moon has no year of its own to count an age in: only the weight is asked for.
  const fields = h('div', { class: 'you__fields' }, yearsThere(id, 1) === null ? null : age.el, weight.el);
  return h('section', { class: 'site-section you', 'aria-labelledby': 'you-title' }, h('h3', { id: 'you-title' }, t.title), h('p', { class: 'fact__source' }, t.intro), fields, out);
}
