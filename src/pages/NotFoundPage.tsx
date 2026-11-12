import { Link } from 'react-router-dom';
import { useLocale } from '../contexts/LocaleContext';

export default function NotFoundPage() {
  const { t } = useLocale();
  return (
    <div className="doc doc--standalone">
      <h1 className="doc__title">{t('notfound.title')}</h1>
      <p>{t('notfound.body')}</p>
      <p><Link to="/" className="btn btn--primary"><span>{t('notfound.home')}</span></Link></p>
    </div>
  );
}
