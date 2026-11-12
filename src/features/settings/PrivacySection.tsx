import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useChat } from '../../contexts/ChatContext';
import { useLocale } from '../../contexts/LocaleContext';
import { useToast } from '../../contexts/ToastContext';

export function PrivacySection({ onNavigate }: { onNavigate: () => void }) {
  const { t } = useLocale();
  const { removeAll } = useChat();
  const { notify } = useToast();
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="settings-section">
      <section className="settings-block">
        <h3>{t('pr.retention')}</h3>
        <p>{t('pr.retentionBody')}</p>
      </section>
      <section className="settings-block">
        <h3>{t('pr.deleteLocal')}</h3>
        <p>{t('pr.deleteLocalBody')}</p>
        <Button variant="danger" onClick={() => setConfirm(true)}>{t('pr.deleteLocal')}</Button>
      </section>
      <section className="settings-block">
        <h3>{t('pr.docs')}</h3>
        <p className="settings-links">
          <Link to="/terms" className="link" onClick={onNavigate}>{t('auth.terms.link')}</Link>
          <Link to="/privacy" className="link" onClick={onNavigate}>{t('auth.privacy.link')}</Link>
        </p>
      </section>
      <Modal open={confirm} title={t('pr.deleteLocal')} onClose={() => setConfirm(false)}
        footer={<><Button variant="ghost" data-autofocus onClick={() => setConfirm(false)}>{t('common.cancel')}</Button>
          <Button variant="danger" onClick={() => { removeAll(); setConfirm(false); notify(t('pr.deleteLocalDone'), 'success'); }}>{t('conv.delete')}</Button></>}>
        <p>{t('pr.deleteLocalBody')}</p>
      </Modal>
    </div>
  );
}
