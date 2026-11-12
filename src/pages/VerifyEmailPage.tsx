import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { CircleCheck, Mail, TriangleAlert } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useLocale } from '../contexts/LocaleContext';
import { useToast } from '../contexts/ToastContext';
import { authApi } from '../services';

const COOLDOWN = 30;

/** Three demo states: waiting for the link (default), activated (?status=success), link expired (?status=expired). */
export default function VerifyEmailPage() {
  const { t } = useLocale();
  const { notify } = useToast();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const status = params.get('status');
  const email = (location.state as { email?: string } | null)?.email ?? 'name@example.com';
  const [wait, setWait] = useState(COOLDOWN);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (wait <= 0) return;
    const id = window.setTimeout(() => setWait((w) => w - 1), 1000);
    return () => window.clearTimeout(id);
  }, [wait]);

  async function resend() {
    setSending(true);
    await authApi.resendVerification(email);
    setSending(false);
    setWait(COOLDOWN);
    notify(t('demo.authNotice'), 'info');
  }

  if (status === 'success') {
    return (
      <div className="state-block">
        <CircleCheck className="state-block__icon state-block__icon--ok" size={40} aria-hidden="true" />
        <h1 className="auth__title">{t('auth.verify.success.title')}</h1>
        <p className="auth__sub">{t('auth.verify.success.body')}</p>
        <Link to="/login" className="btn btn--primary btn--block"><span>{t('auth.login.submit')}</span></Link>
      </div>
    );
  }
  if (status === 'expired') {
    return (
      <div className="state-block">
        <TriangleAlert className="state-block__icon state-block__icon--warn" size={40} aria-hidden="true" />
        <h1 className="auth__title">{t('auth.verify.expired.title')}</h1>
        <p className="auth__sub">{t('auth.verify.expired.body')}</p>
        <Link to="/login" className="btn btn--primary btn--block"><span>{t('auth.backToLogin')}</span></Link>
      </div>
    );
  }
  return (
    <div className="state-block">
      <Mail className="state-block__icon" size={40} aria-hidden="true" />
      <h1 className="auth__title">{t('auth.verify.sent.title')}</h1>
      <p className="auth__sub">{t('auth.verify.sent.body', { email })}</p>
      <Button variant="secondary" block onClick={resend} loading={sending} disabled={wait > 0}>
        {wait > 0 ? t('auth.verify.resendWait', { s: wait }) : t('auth.verify.resend')}
      </Button>
      <div className="state-block__demo">
        <Button variant="ghost" block onClick={() => setParams({ status: 'success' })}>{t('auth.verify.simulate')}</Button>
        <Button variant="ghost" block onClick={() => setParams({ status: 'expired' })}>{t('auth.verify.simulateExpired')}</Button>
      </div>
      <p className="auth__switch"><Link to="/login" className="link">{t('auth.backToLogin')}</Link></p>
    </div>
  );
}
