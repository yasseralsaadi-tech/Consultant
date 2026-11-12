import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CircleHelp, LogOut, MessageSquarePlus, PanelLeftClose, PanelLeftOpen, Settings, X } from 'lucide-react';
import { BrandLogo } from '../../components/ui/BrandLogo';
import { useAuth } from '../../contexts/AuthContext';
import { useLocale } from '../../contexts/LocaleContext';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { ConversationList } from './ConversationList';

interface Props {
  /** Mobile/tablet drawer mode. */
  drawer: boolean;
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export function Sidebar({ drawer, open, collapsed, onClose, onToggleCollapse, onOpenSettings, onLogout }: Props) {
  const { t } = useLocale();
  const { user } = useAuth();
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  const rail = collapsed && !drawer;
  useFocusTrap(ref, drawer && open, onClose);

  const go = (path: string) => { navigate(path); if (drawer) onClose(); };

  return (
    <>
      {drawer && open && <div className="scrim" onClick={onClose} aria-hidden="true" />}
      <aside
        ref={ref}
        id="app-sidebar"
        className={`sidebar ${rail ? 'sidebar--rail' : ''} ${drawer ? 'sidebar--drawer' : ''} ${drawer && open ? 'is-open' : ''}`}
        aria-label={t('nav.main')}
        role={drawer ? 'dialog' : undefined}
        aria-modal={drawer && open ? true : undefined}
      >
        <div className="sidebar__head">
          <Link to="/" className="sidebar__brand" onClick={() => drawer && onClose()} aria-label={t('app.nameFull')}>
            {rail ? <BrandLogo variant="symbol" width={40} decorative /> : <BrandLogo variant="full" width={drawer ? 220 : 210} decorative />}
          </Link>
          {drawer ? (
            <button type="button" className="icon-btn sidebar__close" onClick={onClose} aria-label={t('nav.closeMenu')}><X size={20} aria-hidden="true" /></button>
          ) : (
            <button type="button" className="icon-btn sidebar__collapse" onClick={onToggleCollapse} aria-label={rail ? t('nav.expand') : t('nav.collapse')} aria-expanded={!rail}>
              {rail ? <PanelLeftOpen size={20} aria-hidden="true" className="flip-rtl" /> : <PanelLeftClose size={20} aria-hidden="true" className="flip-rtl" />}
            </button>
          )}
        </div>

        <button type="button" className="btn btn--primary btn--block sidebar__new" onClick={() => go('/')} aria-label={t('nav.newChat')}>
          <MessageSquarePlus size={18} aria-hidden="true" />
          {!rail && <span>{t('nav.newChat')}</span>}
        </button>

        {!rail && <div className="sidebar__scroll"><ConversationList onNavigate={drawer ? onClose : undefined} /></div>}
        {rail && <div className="sidebar__scroll" />}

        <div className="sidebar__foot">
          {!rail && user && (
            <div className="user-chip" title={user.email}>
              <span className="user-chip__avatar" aria-hidden="true">{(user.displayName || user.email).charAt(0).toUpperCase()}</span>
              <span className="user-chip__text">
                <span className="user-chip__name">{user.displayName || user.email}</span>
                <span className="user-chip__mail" dir="ltr">{user.email}</span>
              </span>
            </div>
          )}
          <button type="button" className="side-btn" onClick={() => go('/help')} aria-label={t('nav.help')}><CircleHelp size={18} aria-hidden="true" />{!rail && <span>{t('nav.help')}</span>}</button>
          <button type="button" className="side-btn" onClick={() => { onOpenSettings(); }} aria-label={t('nav.settings')}><Settings size={18} aria-hidden="true" />{!rail && <span>{t('nav.settings')}</span>}</button>
          <button type="button" className="side-btn" onClick={onLogout} aria-label={t('nav.logout')}><LogOut size={18} aria-hidden="true" className="flip-rtl" />{!rail && <span>{t('nav.logout')}</span>}</button>
        </div>
      </aside>
    </>
  );
}
