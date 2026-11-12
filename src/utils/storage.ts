import { APP_CONFIG } from '../config/app';

const k = (key: string) => APP_CONFIG.storagePrefix + key;

/** localStorage wrapper that never throws (private mode, quota, SSR). */
export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(k(key));
      return raw === null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  },
  getString(key: string): string | null {
    try { return localStorage.getItem(k(key)); } catch { return null; }
  },
  set(key: string, value: unknown) {
    try { localStorage.setItem(k(key), JSON.stringify(value)); } catch { /* ignore */ }
  },
  setString(key: string, value: string) {
    try { localStorage.setItem(k(key), value); } catch { /* ignore */ }
  },
  remove(key: string) {
    try { localStorage.removeItem(k(key)); } catch { /* ignore */ }
  },
};
