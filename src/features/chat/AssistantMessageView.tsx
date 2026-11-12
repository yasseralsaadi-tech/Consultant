import { useState } from 'react';
import { Copy, Flag, RefreshCw, ThumbsDown, ThumbsUp } from 'lucide-react';
import { AnswerBody } from '../answers/AnswerBody';
import { BrandLogo } from '../../components/ui/BrandLogo';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useChat } from '../../contexts/ChatContext';
import { useLocale } from '../../contexts/LocaleContext';
import { useToast } from '../../contexts/ToastContext';
import type { Key } from '../../i18n';
import type { AssistantMessage } from '../../types';

const REASONS: Key[] = ['fb.r1', 'fb.r2', 'fb.r3', 'fb.r4'];

interface Props {
  conversationId: string;
  message: AssistantMessage;
  isLast: boolean;
  onClarify: (label: string) => void;
}

export function AssistantMessageView({ conversationId, message, isLast, onClarify }: Props) {
  const { t } = useLocale();
  const { notify } = useToast();
  const { setFeedback, markReported, regenerate, generating } = useChat();
  const [reasonsOpen, setReasonsOpen] = useState(false);
  const [reasons, setReasons] = useState<Key[]>([]);
  const [comment, setComment] = useState('');
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState('');
  const done = message.status !== 'streaming';
  const isError = message.kind === 'error';

  async function copy() {
    const p = message.payload;
    const text = [p.summary, p.application, p.clarify?.question].filter(Boolean).join('\n\n');
    try { await navigator.clipboard.writeText(text); notify(t('action.copied'), 'success'); } catch { /* clipboard unavailable */ }
  }

  function up() {
    setReasonsOpen(false);
    setFeedback(conversationId, message.id, { value: 'up' });
    notify(t('fb.thanks'), 'success');
  }

  function submitDown() {
    setFeedback(conversationId, message.id, { value: 'down', reasons: reasons.map((r) => t(r)), comment: comment.trim() || undefined });
    setReasonsOpen(false);
    notify(t('fb.thanks'), 'success');
  }

  return (
    <article className="msg msg--assistant" aria-label={t('chat.assistant')}>
      <header className="msg__head">
        <BrandLogo variant="symbol" width={28} decorative />
        <span className="msg__who">{t('chat.assistant')}</span>
        <span className="badge badge--demo" title={t('answer.demoNote')}>{t('answer.demoBadge')}</span>
      </header>
      <AnswerBody message={message} onClarify={onClarify} interactive={isLast && !generating} />
      {done && message.kind !== 'clarify' && (
        <>
          <p className="msg__demo-note">{t('answer.demoNote')}</p>
          <div className="msg__actions" role="group">
            {!isError && (
              <>
                <button type="button" className="act" aria-pressed={message.feedback?.value === 'up'} onClick={up}><ThumbsUp size={16} aria-hidden="true" /><span>{t('action.helpful')}</span></button>
                <button type="button" className="act" aria-pressed={message.feedback?.value === 'down'} onClick={() => setReasonsOpen((o) => !o)} aria-expanded={reasonsOpen}><ThumbsDown size={16} aria-hidden="true" /><span>{t('action.notHelpful')}</span></button>
                <button type="button" className="act" onClick={copy}><Copy size={16} aria-hidden="true" /><span>{t('action.copy')}</span></button>
                <button type="button" className="act" onClick={() => setReportOpen(true)} disabled={message.reported}><Flag size={16} aria-hidden="true" /><span>{t('action.report')}</span></button>
              </>
            )}
            {isLast && !generating && (
              <button type="button" className="act" onClick={() => regenerate(conversationId)}><RefreshCw size={16} aria-hidden="true" /><span>{isError ? t('kind.retry') : t('action.regenerate')}</span></button>
            )}
          </div>
        </>
      )}
      {reasonsOpen && (
        <div className="feedback-panel">
          <p className="feedback-panel__title">{t('fb.title')}</p>
          <div className="chips" role="group" aria-label={t('fb.title')}>
            {REASONS.map((r) => (
              <button key={r} type="button" className="chip" aria-pressed={reasons.includes(r)} onClick={() => setReasons((x) => (x.includes(r) ? x.filter((i) => i !== r) : [...x, r]))}>{t(r)}</button>
            ))}
          </div>
          <label className="field__label" htmlFor={`fb-${message.id}`}>{t('fb.comment')}</label>
          <textarea id={`fb-${message.id}`} className="input textarea" rows={2} maxLength={500} value={comment} onChange={(e) => setComment(e.target.value)} />
          <Button onClick={submitDown}>{t('fb.submit')}</Button>
        </div>
      )}
      <Modal
        open={reportOpen}
        title={t('report.title')}
        onClose={() => setReportOpen(false)}
        footer={<>
          <Button variant="ghost" onClick={() => setReportOpen(false)}>{t('common.cancel')}</Button>
          <Button disabled={!reportText.trim()} onClick={() => { markReported(conversationId, message.id); setReportOpen(false); setReportText(''); notify(t('report.done'), 'success'); }}>{t('report.submit')}</Button>
        </>}
      >
        <p className="modal__lead">{t('report.body')}</p>
        <textarea data-autofocus className="input textarea" rows={4} maxLength={1000} value={reportText} onChange={(e) => setReportText(e.target.value)} aria-label={t('report.title')} />
      </Modal>
    </article>
  );
}
