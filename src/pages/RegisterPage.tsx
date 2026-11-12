import { useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { Notice } from '../components/ui/Notice';
import { APP_CONFIG } from '../config/app';
import { useLocale } from '../contexts/LocaleContext';
import { ApiError, authApi } from '../services';
import { focusFirstInvalid } from '../utils/forms';
import { passwordStrength, validateConfirm, validateEmail, validatePassword } from '../utils/validation';
import type { Key } from '../i18n';

type Errors = Partial<Record<'email' | 'password' | 'confirm' | 'invite' | 'terms', Key>>;

export default function RegisterPage() {
  const { t } = useLocale();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [invite, setInvite] = useState('');
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<Key | null>(null);
  const [loading, setLoading] = useState(false);
  const strength = passwordStrength(password);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Errors = {
      email: validateEmail(email) ?? undefined,
      password: validatePassword(password) ?? undefined,
      confirm: validateConfirm(password, confirm) ?? undefined,
      invite: APP_CONFIG.inviteRequired && !invite.trim() ? 'err.inviteRequired' : undefined,
      terms: terms ? undefined : 'err.termsRequired',
    };
    setErrors(next);
    setFormError(null);
    if (Object.values(next).some(Boolean)) { focusFirstInvalid(formRef.current); return; }
    setLoading(true);
    try {
      const res = await authApi.register({ email, password, displayName: displayName.trim() || undefined, inviteCode: invite, acceptedTerms: terms });
      navigate('/verify-email', { replace: true, state: { email: res.email } });
    } catch (err) {
      setFormError(err instanceof ApiError && err.code === 'invite' ? 'auth.error.invite' : 'auth.error.generic');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="auth__title">{t('auth.register.title')}</h1>
      <p className="auth__sub">{t('auth.register.sub')}</p>
      {formError && <Notice tone="error" role="alert">{t(formError)}</Notice>}
      <form ref={formRef} onSubmit={onSubmit} noValidate className="form">
        <Field label={t('auth.displayName')} optional name="name" autoComplete="nickname" value={displayName} maxLength={60} onChange={(e) => setDisplayName(e.target.value)} />
        <Field label={t('auth.email')} type="email" name="email" autoComplete="email" inputMode="email" dir="ltr" value={email}
          onChange={(e) => setEmail(e.target.value)} error={errors.email ? t(errors.email) : null} />
        <div>
          <Field label={t('auth.password')} password name="new-password" autoComplete="new-password" dir="ltr" value={password}
            onChange={(e) => setPassword(e.target.value)} error={errors.password ? t(errors.password) : null} hint={t('auth.password.rules')} />
          {password && (
            <div className="strength" aria-live="polite">
              <div className={`strength__bar strength__bar--${strength}`} aria-hidden="true"><i /><i /><i /></div>
              <span className="strength__label">{t('auth.strength.label')}: {t(`auth.strength.${strength === 0 ? 1 : strength}` as Key)}</span>
            </div>
          )}
        </div>
        <Field label={t('auth.confirmPassword')} password name="confirm-password" autoComplete="new-password" dir="ltr" value={confirm}
          onChange={(e) => setConfirm(e.target.value)} error={errors.confirm ? t(errors.confirm) : null} />
        {APP_CONFIG.inviteRequired && (
          <Field label={t('auth.invite')} name="invite" autoComplete="off" dir="ltr" value={invite} onChange={(e) => setInvite(e.target.value)}
            error={errors.invite ? t(errors.invite) : null} hint={t('demo.inviteHint')} />
        )}
        <div>
          <label className="check">
            <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} aria-invalid={errors.terms ? true : undefined} />
            <span>
              {t('auth.terms.prefix')} <Link to="/terms" className="link" target="_blank">{t('auth.terms.link')}</Link> {t('auth.terms.and')}{' '}
              <Link to="/privacy" className="link" target="_blank">{t('auth.privacy.link')}</Link>
            </span>
          </label>
          {errors.terms && <p className="field__error" role="alert">{t(errors.terms)}</p>}
        </div>
        <Button type="submit" block loading={loading}>{t('auth.register.submit')}</Button>
      </form>
      <p className="auth__switch">{t('auth.register.haveAccount')} <Link to="/login" className="link">{t('auth.register.loginLink')}</Link></p>
    </>
  );
}
