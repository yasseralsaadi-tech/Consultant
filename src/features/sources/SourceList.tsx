import { useId, useState } from 'react';
import { BookOpen, ChevronDown } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';
import type { Key } from '../../i18n';
import type { LegalSource } from '../../types';

const STATUS_KEY: Record<LegalSource['status'], Key> = {
  inForce: 'source.status.inForce',
  amended: 'source.status.amended',
  unknown: 'source.status.unknown',
};

function SourceItem({ source }: { source: LegalSource }) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <li className={`source ${open ? 'is-open' : ''}`}>
      <button type="button" className="source__head" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((o) => !o)}>
        <BookOpen size={18} aria-hidden="true" className="source__icon" />
        <span className="source__main">
          <span className="source__title">{source.title}</span>
          <span className="source__ref">{source.lawName} · {t('source.article')}: {source.articleNo}</span>
        </span>
        <span className={`badge badge--status-${source.status}`}>{t(STATUS_KEY[source.status])}</span>
        <ChevronDown size={18} aria-hidden="true" className="source__chev" />
        <span className="sr-only">{open ? t('source.collapse') : t('source.expand')}</span>
      </button>
      <div id={panelId} role="region" aria-label={source.title} hidden={!open} className="source__panel">
        <dl className="source__facts">
          <div><dt>{t('source.law')}</dt><dd>{source.lawName}</dd></div>
          <div><dt>{t('source.article')}</dt><dd>{source.articleNo}</dd></div>
          <div><dt>{t('source.type')}</dt><dd>{source.docType}</dd></div>
          <div><dt>{t('source.date')}</dt><dd>{source.date}</dd></div>
          <div><dt>{t('source.status')}</dt><dd>{t(STATUS_KEY[source.status])}</dd></div>
        </dl>
        <figure className="source__quote">
          <figcaption>{t('source.fullText')} <span className="badge badge--demo">{t('source.demo')}</span></figcaption>
          <blockquote>{source.excerpt}</blockquote>
        </figure>
      </div>
    </li>
  );
}

/** Legal references, visually separate from the assistant's own explanation. */
export function SourceList({ sources, heading }: { sources: LegalSource[]; heading?: string }) {
  const { t } = useLocale();
  if (!sources.length) return null;
  return (
    <section className="sources" aria-label={heading ?? t('answer.sources')}>
      <header className="sources__head">
        <h3 className="sources__title">{heading ?? t('answer.sources')}</h3>
        <span className="sources__count">{sources.length === 1 ? t('answer.sourcesCount1') : sources.length === 2 ? t('answer.sourcesCount2') : t('answer.sourcesCount', { n: sources.length })}</span>
      </header>
      <p className="sources__demo">{t('answer.sourcesDemo')}</p>
      <ul className="sources__list">{sources.map((s) => <SourceItem key={s.id} source={s} />)}</ul>
    </section>
  );
}
