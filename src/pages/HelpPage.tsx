import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import { Notice } from '../components/ui/Notice';
import type { Key } from '../i18n';

const DEMO: Key[] = ['help.demo.answer', 'help.demo.clarify', 'help.demo.insufficient', 'help.demo.refusal', 'help.demo.fallback', 'help.demo.error'];

export default function HelpPage() {
  const { t } = useLocale();
  return (
    <div className="doc">
      <h2 className="doc__title">{t('help.title')}</h2>
      <section className="doc__section">
        <h3>{t('help.about')}</h3>
        <p>{t('help.aboutBody')}</p>
      </section>
      <section className="doc__section">
        <h3>{t('help.limits')}</h3>
        <ul><li>{t('help.limit1')}</li><li>{t('help.limit2')}</li><li>{t('help.limit3')}</li></ul>
      </section>
      <section className="doc__section">
        <h3>{t('welcome.domains')}</h3>
        <p>{t('welcome.domainsNote')}</p>
      </section>
      <section className="doc__section">
        <h3>{t('help.demoTitle')}</h3>
        <Notice tone="demo">{t('help.demoBody')}</Notice>
        <ul className="doc__list">{DEMO.map((k) => <li key={k}>{t(k)}</li>)}</ul>
      </section>
      <p><Link to="/" className="link link--icon"><ArrowRight size={16} aria-hidden="true" className="flip-rtl-reverse" />{t('help.back')}</Link></p>
    </div>
  );
}
