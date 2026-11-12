import { useEffect, type KeyboardEvent, type RefObject } from 'react';
import { ArrowUp, Square, WifiOff } from 'lucide-react';
import { APP_CONFIG } from '../../config/app';
import { useLocale } from '../../contexts/LocaleContext';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onStop: () => void;
  inputRef: RefObject<HTMLTextAreaElement>;
  generating: boolean;
  online: boolean;
  /** Reason the composer is blocked, if any (shown under the field). */
  blocked: 'daily' | 'full' | null;
  dailyLimit: number;
}

export function Composer({ value, onChange, onSubmit, onStop, inputRef, generating, online, blocked, dailyLimit }: Props) {
  const { t } = useLocale();
  const max = APP_CONFIG.maxQuestionLength;
  const over = value.length > max;
  const canSend = !!value.trim() && !over && online && !blocked && !generating;

  // Auto-grow up to the CSS max-height.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value, inputRef]);

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    const coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && !coarse) {
      e.preventDefault();
      if (canSend) onSubmit();
    }
  }

  return (
    <form className="composer" onSubmit={(e) => { e.preventDefault(); if (canSend) onSubmit(); }}>
      <div className={`composer__box ${over ? 'is-over' : ''}`}>
        <label htmlFor="question" className="sr-only">{t('composer.label')}</label>
        <textarea
          id="question"
          ref={inputRef}
          className="composer__input"
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t('composer.placeholder')}
          aria-describedby="composer-meta"
          aria-invalid={over || undefined}
          disabled={blocked === 'full'}
        />
        {generating ? (
          <button type="button" className="composer__btn composer__btn--stop" onClick={onStop} aria-label={t('composer.stop')}>
            <Square size={16} aria-hidden="true" fill="currentColor" />
          </button>
        ) : (
          <button type="submit" className="composer__btn" disabled={!canSend} aria-label={t('composer.send')}>
            <ArrowUp size={20} aria-hidden="true" />
          </button>
        )}
      </div>
      <div id="composer-meta" className="composer__meta">
        <span className="composer__msg" role={blocked || !online ? 'status' : undefined}>
          {!online ? (<><WifiOff size={14} aria-hidden="true" /> {t('composer.offline')}</>)
            : blocked === 'daily' ? t('composer.dailyLimit', { n: dailyLimit })
            : blocked === 'full' ? t('composer.convFull')
            : <span className="composer__hint">{t('composer.hint')}</span>}
        </span>
        {value.length > max * 0.8 && (
          <span className={`composer__count ${over ? 'is-over' : ''}`} aria-live="polite">{t('composer.counter', { n: value.length, max })}</span>
        )}
      </div>
    </form>
  );
}
