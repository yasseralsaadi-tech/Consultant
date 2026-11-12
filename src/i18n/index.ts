import { ar } from './ar';
import { en } from './en';
import type { Lang } from '../types';

export type Key = keyof typeof ar;
export type Dict = Record<Key, string>;

const dicts: Record<Lang, Dict> = { ar: ar as Dict, en };

export const dir = (lang: Lang) => (lang === 'ar' ? 'rtl' : 'ltr');

export function translate(lang: Lang, key: Key, vars?: Record<string, string | number>): string {
  let s = dicts[lang][key] ?? dicts.ar[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
  return s;
}
