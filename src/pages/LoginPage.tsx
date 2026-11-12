import { useRef, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { Notice } from '../components/ui/Notice';
import { useAuth } from '../contexts/AuthContext';
import { useLocale } from '../contexts/LocaleContext';
import { ApiError } from '../services';
import { focusFirstInvalid } from '../utils/forms';
import { validateEmail } from '../utils/validation';
import type { Key } from '../i18n';

export default function LoginPage() {
  const { t } = useLocale();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: Key; password?: Key }>({});
  const [formError, setFormError] = useState<Key | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = {
      email: validateEmail(email) ?? undefined,
      password: password ? undefined : ('err.required' as Key),
    };
    setErrors(next);
    setFormError(null);
    if (next.email || next.password) { focusFirstInvalid(formRef.current); return; }
    setLoading(true);
    try {
      await login(email, password, remember);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from && from !== '/login' ? from : '/', { replace: true });
    } catch (err) {
      const code = err instanceof ApiError ? err.code : 'generic';
      setFormError(code === 'unverified' ? 'auth.error.unverified' : code === 'locked' ? 'auth.error.locked' : code === 'invalid' ? 'auth.error.invalid' : 'auth.error.generic');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="auth__title">{t('auth.login.title')}</h1>
      <p className="auth__sub">{t('auth.login.sub')}</p>
      {formError && <Notice tone="error" role="alert">{t(formError)}</Notice>}
      <form ref={formRef} onSubmit={onSubmit} noValidate className="form">
        <Field label={t('auth.email')} type="email" name="email" autoComplete="email" inputMode="email" dir="ltr" value={email}
          onChange={(e) => setEmail(e.target.value)} error={errors.email ? t(errors.email) : null} />
        <Field label={t('auth.password')} password name="password" autoComplete="current-password" dir="ltr" value={password}
          onChange={(e) => setPassword(e.target.value)} error={errors.password ? t(errors.password) : null} />
        <div className="form__row">
          <label className="check">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <span>{t('auth.remember')}</span>
          </label>
          <Link to="/forgot-password" className="link">{t('auth.forgot')}</Link>
        </div>
        <Button type="submit" block loading={loading}>{t('auth.login.submit')}</Button>
      </form>
      <p className="auth__hint">{t('demo.credsHint')}</p>
      <p className="auth__switch">{t('auth.login.noAccount')} <Link to="/register" className="link">{t('auth.login.createLink')}</Link></p>
    </>
  );
}
