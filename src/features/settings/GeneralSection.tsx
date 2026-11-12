import { Monitor, Moon, Sun } from 'lucide-react';
import { Segmented } from '../../components/ui/Segmented';
import { useLocale } from '../../contexts/LocaleContext';
import { useTheme } from '../../contexts/ThemeContext';
import type { Lang, TextSize, ThemeMode } from '../../types';

export function GeneralSection() {
  const { t, lang, setLang } = useLocale();
  const { mode, setMode, textSize, setTextSize } = useTheme();
  return (
    <div className="settings-section">
      <div>
        <Segmented<Lang>
          legend={t('set.language')}
          value={lang}
          onChange={setLang}
          options={[{ value: 'ar', label: 'العربية' }, { value: 'en', label: 'English' }]}
        />
        <p className="field__hint">{t('set.languageHint')}</p>
      </div>
      <Segmented<ThemeMode>
        legend={t('set.theme')}
        value={mode}
        onChange={setMode}
        options={[
          { value: 'system', label: t('theme.system'), icon: <Monitor size={16} aria-hidden="true" /> },
          { value: 'light', label: t('theme.light'), icon: <Sun size={16} aria-hidden="true" /> },
          { value: 'dark', label: t('theme.dark'), icon: <Moon size={16} aria-hidden="true" /> },
        ]}
      />
      <Segmented<TextSize>
        legend={t('set.textSize')}
        value={textSize}
        onChange={setTextSize}
        options={[
          { value: 'normal', label: t('size.normal') },
          { value: 'large', label: t('size.large') },
          { value: 'xlarge', label: t('size.xlarge') },
        ]}
      />
    </div>
  );
}
