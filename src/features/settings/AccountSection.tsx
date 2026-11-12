import { useState, type FormEvent } from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Field } from '../../components/ui/Field';
import { Modal } from '../../components/ui/Modal';
import { Notice } from '../../components/ui/Notice';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import { useToast } from '../../contexts/ToastContext';
import { validateConfirm, validatePassword } from '../../utils/validation';

/** Every action in this section is a UI demonstration: nothing is sent anywhere or changed. */
export function AccountSection() {
  const { t } = useLocale();
  const { user } = useAuth();
  const { notify } = useToast();
  const [name, setName] = useState(user?.displayName ?? '');
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ current?: string; next?: string; confirm?: string }>({});
  const [confirmAll, setConfirmAll] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePw, setDeletePw] = useState('');
  const demo = () => notify(t('acc.demoDone'), 'info');

  function changePassword(e: FormEvent) {
    e.preventDefault();
    const n = validatePassword(next);
    const c = validateConfirm(next, confirm);
    const cur = current ? undefined : t('err.required');
    setErrors({ current: cur, next: n ? t(n) : undefined, confirm: c ? t(c) : undefined });
    if (cur || n || c) return;
    setCurrent(''); setNext(''); setConfirm('');
    demo();
  }

  return (
    <div className="settings-section">
      <Notice tone="demo">{t('acc.demoNotice')}</Notice>

      <section className="settings-block" aria-labelledby="acc-profile">
        <h3 id="acc-profile">{t('acc.profile')}</h3>
        <form className="form" onSubmit={(e) => { e.preventDefault(); demo(); }}>
          <Field label={t('auth.displayName')} value={name} maxLength={60} onChange={(e) => setName(e.target.value)} />
          <Field label={t('auth.email')} value={user?.email ?? ''} readOnly dir="ltr" hint={t('acc.emailNote')} />
          <div><Button type="submit" variant="secondary">{t('acc.saveProfile')}</Button></div>
        </form>
      </section>

      <section className="settings-block" aria-labelledby="acc-pw">
        <h3 id="acc-pw">{t('acc.changePassword')}</h3>
        <form className="form" onSubmit={changePassword} noValidate>
          <Field label={t('acc.currentPassword')} password autoComplete="current-password" dir="ltr" value={current} onChange={(e) => setCurrent(e.target.value)} error={errors.current} />
          <Field label={t('acc.newPassword')} password autoComplete="new-password" dir="ltr" value={next} onChange={(e) => setNext(e.target.value)} error={errors.next} hint={t('auth.password.rules')} />
          <Field label={t('auth.confirmPassword')} password autoComplete="new-password" dir="ltr" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} />
          <div><Button type="submit" variant="secondary">{t('acc.updatePassword')}</Button></div>
        </form>
      </section>

      <section className="settings-block" aria-labelledby="acc-sess">
        <h3 id="acc-sess">{t('acc.sessions')}</h3>
        <ul className="sessions">
          <li><Monitor size={18} aria-hidden="true" /><span>{t('acc.currentSession')}</span></li>
          <li><Smartphone size={18} aria-hidden="true" /><span>{t('acc.otherSession')}</span><Button variant="ghost" onClick={demo}>{t('acc.endSession')}</Button></li>
        </ul>
        <Button variant="secondary" onClick={() => setConfirmAll(true)}>{t('acc.logoutAll')}</Button>
      </section>

      <section className="settings-block settings-block--danger" aria-labelledby="acc-del">
        <h3 id="acc-del">{t('acc.delete')}</h3>
        <p>{t('acc.deleteBody')}</p>
        <Button variant="danger" onClick={() => setDeleteOpen(true)}>{t('acc.delete')}</Button>
      </section>

      <Modal open={confirmAll} title={t('acc.logoutAll')} onClose={() => setConfirmAll(false)}
        footer={<><Button variant="ghost" onClick={() => setConfirmAll(false)}>{t('common.cancel')}</Button><Button data-autofocus onClick={() => { setConfirmAll(false); demo(); }}>{t('common.confirm')}</Button></>}>
        <p>{t('acc.logoutAllBody')}</p>
        <Notice tone="demo">{t('acc.demoDone')}</Notice>
      </Modal>

      <Modal open={deleteOpen} title={t('acc.delete')} onClose={() => setDeleteOpen(false)}
        footer={<><Button variant="ghost" onClick={() => setDeleteOpen(false)}>{t('common.cancel')}</Button><Button variant="danger" disabled={!deletePw} onClick={() => { setDeleteOpen(false); setDeletePw(''); demo(); }}>{t('acc.deleteSubmit')}</Button></>}>
        <p>{t('acc.deleteBody')}</p>
        <Field label={t('auth.password')} password data-autofocus autoComplete="current-password" dir="ltr" value={deletePw} onChange={(e) => setDeletePw(e.target.value)} />
        <Notice tone="demo">{t('acc.demoDone')}</Notice>
      </Modal>
    </div>
  );
}
