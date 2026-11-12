import { useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { Notice } from '../components/ui/Notice';
import { useLocale } from '../contexts/LocaleContext';
import { authApi } from '../services';
import { focusFirstInvalid } from '../utils/forms';
import { validateEmail } from '../utils/validation';

export default function ForgotPasswordPage() {
  const { t } = useLocale();
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const err = validateEmail(email);
    setError(err ? t(err) : null);
    if (err) { focusFirstInvalid(formRef.current); return; }
    setLoading(true);
    await authApi.requestPasswordReset(email);
    setLoading(false);
    setDone(true); // Same message whether or not the email exists (no account enumeration).
  }

  return (
    <>
      <h1 className="auth__title">{t('auth.forgot.title')}</h1>
      <p className="auth__sub">{t('auth.forgot.sub')}</p>
      {done ? (
        <>
          <Notice tone="success" role="status">{t('auth.forgot.done')}</Notice>
          <p className="auth__switch"><Link to="/reset-password" className="link">{t('auth.reset.title')} ({t('common.demo')})</Link></p>
        </>
      ) : (
        <form ref={formRef} onSubmit={onSubmit} noValidate className="form">
          <Field label={t('auth.email')} type="email" autoComplete="email" inputMode="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
          <Button type="submit" block loading={loading}>{t('auth.forgot.submit')}</Button>
        </form>
      )}
      <p className="auth__switch">
        <Link to="/login" className="link link--icon"><ArrowRight size={16} aria-hidden="true" className="flip-rtl-reverse" />{t('auth.backToLogin')}</Link>
      </p>
    </>
  );
}
