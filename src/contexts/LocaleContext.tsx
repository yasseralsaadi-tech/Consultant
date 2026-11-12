import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Lang } from '../types';
import { dir, translate, type Key } from '../i18n';
import { storage } from '../utils/storage';

interface LocaleValue {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (key: Key, vars?: Record<string, string | number>) => string;
}

const Ctx = createContext<LocaleValue | null>(null);

const initialLang = (): Lang => (storage.getString('lang') === 'en' ? 'en' : 'ar');

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  // Language switch updates the whole document: lang, dir and title.
  useEffect(() => {
    const d = document.documentElement;
    d.lang = lang;
    d.dir = dir(lang);
    document.title = translate(lang, 'app.nameFull');
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    storage.setString('lang', l);
    setLangState(l);
  }, []);

  const value = useMemo<LocaleValue>(
    () => ({
      lang,
      dir: dir(lang),
      setLang,
      toggleLang: () => setLang(lang === 'ar' ? 'en' : 'ar'),
      t: (key, vars) => translate(lang, key, vars),
    }),
    [lang, setLang],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLocale(): LocaleValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useLocale must be used inside LocaleProvider');
  return v;
}
