import { Link, Outlet } from 'react-router-dom';
import { BrandLogo } from '../components/ui/BrandLogo';
import { PreferenceBar } from '../components/ui/PreferenceBar';
import { useLocale } from '../contexts/LocaleContext';

/** Simple page shell for static content (terms, privacy, 404). */
export function PlainLayout() {
  const { t } = useLocale();
  return (
    <div className="plain">
      <a className="skip-link" href="#main">{t('common.skipToContent')}</a>
      <header className="plain__top">
        <Link to="/" className="plain__brand" aria-label={t('app.nameFull')}>
          <BrandLogo variant="symbol" width={40} decorative />
          <span className="plain__name">{t('app.name')}</span>
        </Link>
        <PreferenceBar />
      </header>
      <main id="main" className="plain__main"><Outlet /></main>
    </div>
  );
}
