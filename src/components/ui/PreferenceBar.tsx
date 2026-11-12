import { Moon, Sun } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';
import { useTheme } from '../../contexts/ThemeContext';

/** Compact language + theme switches used on public pages and in the app top bar. */
export function PreferenceBar() {
  const { t, toggleLang, lang } = useLocale();
  const { resolved, toggle } = useTheme();
  return (
    <div className="pref-bar">
      <button type="button" className="btn btn--ghost btn--sm" onClick={toggleLang} aria-label={t('pref.language')} lang={lang === 'ar' ? 'en' : 'ar'}>
        {t('pref.switchTo')}
      </button>
      <button type="button" className="icon-btn" onClick={toggle} aria-label={t('pref.theme')} aria-pressed={resolved === 'dark'}>
        {resolved === 'dark' ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
      </button>
    </div>
  );
}
