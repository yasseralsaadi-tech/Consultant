import { useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Pencil, Search, Trash2 } from 'lucide-react';
import { APP_CONFIG } from '../../config/app';
import { useChat } from '../../contexts/ChatContext';
import { useLocale } from '../../contexts/LocaleContext';
import { useActiveConversationId } from '../../hooks/useActiveConversationId';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { normalizeArabic } from '../../utils/arabic';
import { formatRelative } from '../../utils/format';
import type { Conversation } from '../../types';

/** Searchable, paged list of conversations with rename / delete (both confirmed in a dialog). */
export function ConversationList({ onNavigate }: { onNavigate?: () => void }) {
  const { t, lang } = useLocale();
  const { conversations, rename, remove } = useChat();
  const activeId = useActiveConversationId();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState<number>(APP_CONFIG.conversationPageSize);
  const [renaming, setRenaming] = useState<Conversation | null>(null);
  const [title, setTitle] = useState('');
  const [deleting, setDeleting] = useState<Conversation | null>(null);

  const list = useMemo(() => {
    const q = normalizeArabic(query);
    return conversations
      .filter((c) => c.messages.length > 0)
      .filter((c) => !q || normalizeArabic(c.title).includes(q))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [conversations, query]);

  const shown = list.slice(0, visible);

  return (
    <>
      <div className="side-search">
        <Search size={16} aria-hidden="true" className="side-search__icon" />
        <input
          className="input input--search"
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setVisible(APP_CONFIG.conversationPageSize); }}
          placeholder={t('nav.search')}
          aria-label={t('nav.search')}
        />
      </div>

      <nav className="conv-nav" aria-label={t('nav.conversations')}>
        <h2 className="side-heading">{t('nav.conversations')}</h2>
        {list.length === 0 ? (
          <p className="side-empty">{query ? t('nav.noResults') : t('nav.empty')}</p>
        ) : (
          <ul className="conv-list">
            {shown.map((c) => (
              <li key={c.id} className={`conv ${c.id === activeId ? 'is-active' : ''}`}>
                <NavLink to={`/c/${c.id}`} className="conv__link" onClick={onNavigate} aria-current={c.id === activeId ? 'page' : undefined}>
                  <span className="conv__title">{c.title || t('conv.untitled')}</span>
                  <span className="conv__meta">
                    {formatRelative(c.updatedAt, lang)}
                    {c.isDemoSeed && <span className="badge badge--demo">{t('conv.demoSeed')}</span>}
                  </span>
                </NavLink>
                <div className="conv__actions">
                  <button type="button" className="icon-btn icon-btn--sm" aria-label={`${t('conv.rename')}: ${c.title}`}
                    onClick={() => { setRenaming(c); setTitle(c.title); }}><Pencil size={15} aria-hidden="true" /></button>
                  <button type="button" className="icon-btn icon-btn--sm" aria-label={`${t('conv.delete')}: ${c.title}`}
                    onClick={() => setDeleting(c)}><Trash2 size={15} aria-hidden="true" /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {list.length > visible && (
          <Button variant="ghost" block onClick={() => setVisible((v) => v + APP_CONFIG.conversationPageSize)}>{t('nav.loadMore')}</Button>
        )}
      </nav>

      <Modal
        open={!!renaming}
        title={t('conv.renameTitle')}
        onClose={() => setRenaming(null)}
        footer={<>
          <Button variant="ghost" onClick={() => setRenaming(null)}>{t('common.cancel')}</Button>
          <Button onClick={() => { if (renaming) rename(renaming.id, title); setRenaming(null); }} disabled={!title.trim()}>{t('common.save')}</Button>
        </>}
      >
        <form onSubmit={(e) => { e.preventDefault(); if (renaming && title.trim()) { rename(renaming.id, title); setRenaming(null); } }}>
          <label className="field__label" htmlFor="rename-input">{t('conv.renameLabel')}</label>
          <input id="rename-input" data-autofocus className="input" value={title} maxLength={80} onChange={(e) => setTitle(e.target.value)} />
        </form>
      </Modal>

      <Modal
        open={!!deleting}
        title={t('conv.deleteTitle')}
        onClose={() => setDeleting(null)}
        footer={<>
          <Button variant="ghost" data-autofocus onClick={() => setDeleting(null)}>{t('common.cancel')}</Button>
          <Button variant="danger" onClick={() => { if (deleting) { remove(deleting.id); if (deleting.id === activeId) navigate('/'); } setDeleting(null); }}>{t('conv.delete')}</Button>
        </>}
      >
        <p>{t('conv.deleteBody')}</p>
      </Modal>
    </>
  );
}
