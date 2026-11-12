import { useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { Notice } from '../components/ui/Notice';
import { useLocale } from '../contexts/LocaleContext';
import { authApi } from '../services';
import { focusFirstInvalid } from '../utils/forms';
import { validateConfirm, validatePassword } from '../utils/validation';

export default function ResetPasswordPage() {
  const { t } = useLocale();
  const formRef = useRef<HTMLFormElement>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const p = validatePassword(password);
    const c = validateConfirm(password, confirm);
    setErrors({ password: p ? t(p) : undefined, confirm: c ? t(c) : undefined });
    if (p || c) { focusFirstInvalid(formRef.current); return; }
    setLoading(true);
    await authApi.resetPassword('demo-token', password);
    setLoading(false);
    setDone(true);
  }

  return (
    <>
      <h1 className="auth__title">{t('auth.reset.title')}</h1>
      <p className="auth__sub">{t('auth.reset.sub')}</p>
      {done ? (
        <Notice tone="success" role="status">{t('auth.reset.done')}</Notice>
      ) : (
        <form ref={formRef} onSubmit={onSubmit} noValidate className="form">
          <Field label={t('auth.reset.newPassword')} password autoComplete="new-password" dir="ltr" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} hint={t('auth.password.rules')} />
          <Field label={t('auth.confirmPassword')} password autoComplete="new-password" dir="ltr" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} />
          <Button type="submit" block loading={loading}>{t('auth.reset.submit')}</Button>
        </form>
      )}
      <p className="auth__switch"><Link to="/login" className="link">{t('auth.backToLogin')}</Link></p>
    </>
  );
}
