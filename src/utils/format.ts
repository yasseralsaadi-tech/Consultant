import type { Lang } from '../types';

const locale = (lang: Lang) => (lang === 'ar' ? 'ar-SY-u-nu-latn' : 'en-GB');

export function formatRelative(ts: number, lang: Lang, now = Date.now()): string {
  const diff = Math.round((ts - now) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale(lang), { numeric: 'auto' });
  const abs = Math.abs(diff);
  if (abs < 60) return rtf.format(0, 'second');
  if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
  if (abs < 86400 * 30) return rtf.format(Math.round(diff / 86400), 'day');
  return new Intl.DateTimeFormat(locale(lang), { dateStyle: 'medium' }).format(ts);
}

export const formatTime = (ts: number, lang: Lang) =>
  new Intl.DateTimeFormat(locale(lang), { hour: '2-digit', minute: '2-digit' }).format(ts);

export const todayKey = () => new Date().toISOString().slice(0, 10);
