import { Link } from 'react-router-dom';
import { Check, MessageSquareText } from 'lucide-react';
import { BrandLogo } from '../../components/ui/BrandLogo';
import { useLocale } from '../../contexts/LocaleContext';
import type { Key } from '../../i18n';

const SCOPE: Key[] = ['welcome.scope1', 'welcome.scope2', 'welcome.scope3'];
const DOMAINS: Key[] = ['welcome.domain1', 'welcome.domain2', 'welcome.domain3'];
const EXAMPLES: Key[] = ['welcome.ex1', 'welcome.ex2', 'welcome.ex3'];

export function Welcome({ onPick }: { onPick: (text: string) => void }) {
  const { t } = useLocale();
  return (
    <div className="welcome">
      <div className="welcome__hero">
        <BrandLogo variant="full" width={320} />
        <h2 className="welcome__title">{t('welcome.title')}</h2>
        <p className="welcome__sub">{t('welcome.sub')}</p>
        <p className="welcome__tagline">{t('app.tagline')}</p>
      </div>

      <div className="welcome__grid">
        <section className="card" aria-labelledby="w-scope">
          <h3 id="w-scope" className="card__title">{t('welcome.scopeTitle')}</h3>
          <ul className="ticks">
            {SCOPE.map((k) => <li key={k}><Check size={16} aria-hidden="true" /><span>{t(k)}</span></li>)}
          </ul>
        </section>

        <section className="card" aria-labelledby="w-ex">
          <h3 id="w-ex" className="card__title">{t('welcome.examples')}</h3>
          <ul className="examples">
            {EXAMPLES.map((k) => (
              <li key={k}>
                <button type="button" className="example" onClick={() => onPick(t(k))}>
                  <MessageSquareText size={16} aria-hidden="true" /><span>{t(k)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="card card--wide" aria-labelledby="w-dom">
          <h3 id="w-dom" className="card__title">{t('welcome.domains')}</h3>
          <div className="chips chips--static">{DOMAINS.map((k) => <span key={k} className="chip chip--static">{t(k)}</span>)}</div>
          <p className="card__note">{t('welcome.domainsNote')}</p>
        </section>
      </div>

      <footer className="welcome__foot">
        <span>{t('welcome.kb')}: <strong>{t('welcome.kbValue')}</strong></span>
        <span className="welcome__links">
          <Link to="/terms" className="link">{t('auth.terms.link')}</Link>
          <Link to="/privacy" className="link">{t('auth.privacy.link')}</Link>
          <Link to="/help" className="link">{t('nav.help')}</Link>
        </span>
      </footer>
    </div>
  );
}
