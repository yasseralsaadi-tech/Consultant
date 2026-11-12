import { Scale } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';

/** Fixed, always-visible notice under the composer (required on every answer state by the analysis doc). */
export function Disclaimer() {
  const { t } = useLocale();
  return (
    <p className="disclaimer">
      <Scale size={14} aria-hidden="true" />
      <span>{t('disclaimer.text')} {t('disclaimer.privacy')}</span>
    </p>
  );
}
