import { CircleAlert, Info, ShieldAlert, TriangleAlert, type LucideIcon } from 'lucide-react';
import { SourceList } from '../sources/SourceList';
import { StageIndicator } from '../chat/StageIndicator';
import { useLocale } from '../../contexts/LocaleContext';
import type { Key } from '../../i18n';
import type { AssistantMessage } from '../../types';

interface Props {
  message: AssistantMessage;
  onClarify: (label: string) => void;
  /** Clarification options are only interactive while this is the last message. */
  interactive: boolean;
}

const KIND_ICON: Record<string, LucideIcon> = {
  clarify: Info, insufficient: TriangleAlert, refusal: ShieldAlert, fallback: TriangleAlert, error: CircleAlert,
};

/** Renders one assistant turn according to its state: answer, clarification, insufficient info, refusal, fallback or error. */
export function AnswerBody({ message, onClarify, interactive }: Props) {
  const { t } = useLocale();
  const { kind, payload, status, stage } = message;

  if (status === 'streaming' && !payload.summary && !payload.application) {
    return <StageIndicator stage={stage ?? 'understand'} />;
  }

  if (kind === 'answer') {
    return (
      <div className="answer">
        {payload.summary && (
          <section className="answer__block">
            <h3 className="answer__label">{t('answer.summary')}</h3>
            <p className="answer__text">{payload.summary}</p>
          </section>
        )}
        {payload.application && (
          <section className="answer__block">
            <h3 className="answer__label">{t('answer.application')}</h3>
            <p className="answer__text">{payload.application}</p>
          </section>
        )}
        {status === 'streaming' && stage && <StageIndicator stage={stage} />}
        {status !== 'streaming' && <SourceList sources={payload.sources} />}
        {status === 'stopped' && <p className="answer__stopped">{t('stage.stopped')}</p>}
      </div>
    );
  }

  const Icon = KIND_ICON[kind] ?? Info;
  const title: Record<string, Key> = {
    clarify: 'kind.clarify.title', insufficient: 'kind.insufficient.title', refusal: 'kind.refusal.title',
    fallback: 'kind.fallback.title', error: 'kind.error.title',
  };
  const body: Partial<Record<string, Key>> = {
    insufficient: 'kind.insufficient.body', refusal: 'kind.refusal.body', fallback: 'kind.fallback.body', error: 'kind.error.body',
  };

  return (
    <div className={`answer answer--${kind}`}>
      <div className="callout">
        <Icon size={20} aria-hidden="true" className="callout__icon" />
        <div className="callout__body">
          <h3 className="callout__title">{t(title[kind])}</h3>
          {kind === 'clarify' && payload.clarify ? (
            <>
              <p className="callout__step">{t('clarify.step', { step: payload.clarify.step, total: payload.clarify.total })}</p>
              <p className="callout__text">{payload.clarify.question}</p>
              <div className="chips" role="group" aria-label={payload.clarify.question}>
                {payload.clarify.options.map((o) => (
                  <button key={o.id} type="button" className="chip" disabled={!interactive} onClick={() => onClarify(o.label)}>{o.label}</button>
                ))}
              </div>
              {interactive && <p className="callout__hint">{t('clarify.other')}</p>}
            </>
          ) : (
            body[kind] && <p className="callout__text">{t(body[kind] as Key)}</p>
          )}
        </div>
      </div>
      {kind === 'fallback' && <SourceList sources={payload.sources} />}
      {status === 'stopped' && <p className="answer__stopped">{t('stage.stopped')}</p>}
    </div>
  );
}
