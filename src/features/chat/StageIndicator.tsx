import { useLocale } from '../../contexts/LocaleContext';
import type { Key } from '../../i18n';

const ORDER = ['understand', 'search', 'draft'] as const;

/** Shows which stage the (mock) backend reports: understand -> search -> draft. */
export function StageIndicator({ stage }: { stage: (typeof ORDER)[number] }) {
  const { t } = useLocale();
  const current = ORDER.indexOf(stage);
  return (
    <div className="stages" role="status" aria-live="polite">
      <ol className="stages__dots" aria-hidden="true">
        {ORDER.map((s, i) => <li key={s} className={i < current ? 'is-done' : i === current ? 'is-now' : ''} />)}
      </ol>
      <span className="stages__label">{t(`stage.${stage}` as Key)}</span>
    </div>
  );
}
