// Texts of the screen: one dictionary per language (src/i18n/<lang>.json), same keys.
import type en from '../i18n/en.json';

export type Dict = typeof en;

const modules = import.meta.glob<Dict>('../i18n/*.json', { eager: true, import: 'default' });
const dictionaries = new Map<string, Dict>(Object.entries(modules).map(([path, d]) => [path.replace(/^.*\/([a-z]+)\.json$/, '$1'), d]));

/** Languages in the order of the dictionaries' file names. */
export const LANGS = [...dictionaries.keys()];
export const FALLBACK = 'en';

export function dict(lang: string): Dict {
  return dictionaries.get(lang) ?? (dictionaries.get(FALLBACK) as Dict);
}

/** The saved choice, else the first browser language we have, else English. */
export function pickLang(saved: string | null, browser: readonly string[]): string {
  if (saved && dictionaries.has(saved)) return saved;
  for (const tag of browser) {
    const code = tag.toLowerCase().split('-')[0] ?? '';
    if (dictionaries.has(code)) return code;
  }
  return FALLBACK;
}

/** "{name}" in a text → its value. */
export function fmt(text: string, params: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (whole, key: string) => (key in params ? String(params[key]) : whole));
}

export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>>;

/** The form of a text for a number ("1 day", "5 days"), with the number written the language's way. */
export function plural(lang: string, n: number, forms: PluralForms, shown: string): string {
  const form = forms[new Intl.PluralRules(lang).select(n)] ?? forms.other ?? '';
  return fmt(form, { n: shown });
}

/** A number the language's way: at most `digits` after the point, or `significant` digits in all. */
export function num(lang: string, n: number, digits = 0, significant?: number): string {
  const text = new Intl.NumberFormat(lang, significant ? { maximumSignificantDigits: significant } : { maximumFractionDigits: digits }).format(n);
  // a true minus sign, as wide as a digit — not a hyphen
  return text.replace(/^-/, '−');
}

/** The name of a language in that language: "українська". */
export function langName(code: string): string {
  const name = new Intl.DisplayNames([code], { type: 'language' }).of(code) ?? code;
  return name.charAt(0).toLocaleUpperCase(code) + name.slice(1);
}
