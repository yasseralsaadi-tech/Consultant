import { Link } from 'react-router-dom';
import { Notice } from '../components/ui/Notice';
import { useLocale } from '../contexts/LocaleContext';

export default function LegalPage({ kind }: { kind: 'terms' | 'privacy' }) {
  const { t } = useLocale();
  const title = kind === 'terms' ? t('legal.terms.title') : t('legal.privacy.title');
  return (
    <div className="doc doc--standalone">
      <h1 className="doc__title">{title}</h1>
      <Notice tone="demo">{t('legal.draftNote')}</Notice>
      <p>{kind === 'terms' ? t('legal.terms.body1') : t('legal.privacy.body1')}</p>
      <p>{kind === 'terms' ? t('legal.terms.body2') : t('legal.privacy.body2')}</p>
      <p><Link to="/" className="link">{t('notfound.home')}</Link></p>
    </div>
  );
}
