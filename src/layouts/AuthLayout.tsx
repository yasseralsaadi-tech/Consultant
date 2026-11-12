import { Outlet } from 'react-router-dom';
import { BrandLogo } from '../components/ui/BrandLogo';
import { Notice } from '../components/ui/Notice';
import { PreferenceBar } from '../components/ui/PreferenceBar';
import { useLocale } from '../contexts/LocaleContext';

/** Shell for login / registration / recovery: charcoal brand panel + warm form panel. */
export function AuthLayout() {
  const { t } = useLocale();
  return (
    <div className="auth">
      <a className="skip-link" href="#main">{t('common.skipToContent')}</a>
      <aside className="auth__brand">
        <BrandLogo variant="full" width={340} />
        <p className="auth__tagline">{t('app.tagline')}</p>
        <p className="auth__brand-note">{t('disclaimer.text')}</p>
      </aside>
      <div className="auth__side">
        <header className="auth__top"><PreferenceBar /></header>
        <main id="main" className="auth__main">
          <div className="auth__card">
            <Notice tone="demo">{t('demo.authNotice')}</Notice>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
