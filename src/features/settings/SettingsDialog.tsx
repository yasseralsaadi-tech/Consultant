import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Modal } from '../../components/ui/Modal';
import { useLocale } from '../../contexts/LocaleContext';
import type { Key } from '../../i18n';
import { AccountSection } from './AccountSection';
import { GeneralSection } from './GeneralSection';
import { PrivacySection } from './PrivacySection';

const TABS = [
  { id: 'general', label: 'set.general' },
  { id: 'account', label: 'set.account' },
  { id: 'privacy', label: 'set.privacy' },
] as const satisfies ReadonlyArray<{ id: string; label: Key }>;
type TabId = (typeof TABS)[number]['id'];

export function SettingsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLocale();
  const [tab, setTab] = useState<TabId>('general');
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Always reopen on the first tab.
  useEffect(() => { if (open) setTab('general'); }, [open]);

  // Arrow keys move between tabs (WAI-ARIA tabs pattern); direction follows the document.
  function onKeyDown(e: KeyboardEvent) {
    const i = TABS.findIndex((x) => x.id === tab);
    const rtl = document.documentElement.dir === 'rtl';
    const step = e.key === 'ArrowRight' ? (rtl ? -1 : 1) : e.key === 'ArrowLeft' ? (rtl ? 1 : -1) : 0;
    if (!step) return;
    e.preventDefault();
    const next = TABS[(i + step + TABS.length) % TABS.length].id;
    setTab(next);
    refs.current[next]?.focus();
  }

  return (
    <Modal open={open} title={t('set.title')} onClose={onClose} size="lg">
      <div className="tabs" role="tablist" aria-label={t('set.title')} onKeyDown={onKeyDown}>
        {TABS.map((x) => (
          <button key={x.id} ref={(el: HTMLButtonElement | null) => { refs.current[x.id] = el; }} id={`tab-${x.id}`} role="tab" type="button" className="tab"
            aria-selected={tab === x.id} aria-controls={`panel-${x.id}`} tabIndex={tab === x.id ? 0 : -1} onClick={() => setTab(x.id)}>
            {t(x.label)}
          </button>
        ))}
      </div>
      <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} className="tabpanel">
        {tab === 'general' && <GeneralSection />}
        {tab === 'account' && <AccountSection />}
        {tab === 'privacy' && <PrivacySection onNavigate={onClose} />}
      </div>
    </Modal>
  );
}
