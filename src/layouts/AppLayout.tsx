import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, WifiOff } from 'lucide-react';
import { BrandLogo } from '../components/ui/BrandLogo';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { PreferenceBar } from '../components/ui/PreferenceBar';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { useLocale } from '../contexts/LocaleContext';
import { Sidebar } from '../features/conversations/Sidebar';
import { SettingsDialog } from '../features/settings/SettingsDialog';
import { useActiveConversationId } from '../hooks/useActiveConversationId';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useOnline } from '../hooks/useOnline';
import { storage } from '../utils/storage';

/** Authenticated shell: sidebar (persistent rail/expanded on desktop, drawer below 1024px) + top bar + page. */
export function AppLayout() {
  const { t } = useLocale();
  const { logout } = useAuth();
  const { conversations } = useChat();
  const navigate = useNavigate();
  const location = useLocation();
  const id = useActiveConversationId();
  const online = useOnline();
  const drawer = useMediaQuery('(max-width: 1023.98px)');
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(() => storage.get('sidebarCollapsed', false));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  // Leaving the drawer breakpoint or navigating closes the drawer.
  useEffect(() => { if (!drawer) setOpen(false); }, [drawer]);
  useEffect(() => { setOpen(false); }, [location.pathname]);

  const toggleCollapse = () => setCollapsed((c) => { storage.set('sidebarCollapsed', !c); return !c; });
  const activeTitle = conversations.find((c) => c.id === id)?.title;

  return (
    <div className={`app ${collapsed && !drawer ? 'app--rail' : ''}`}>
      <a className="skip-link" href="#main">{t('common.skipToContent')}</a>
      <Sidebar
        drawer={drawer} open={open} collapsed={collapsed}
        onClose={() => setOpen(false)} onToggleCollapse={toggleCollapse}
        onOpenSettings={() => { setSettingsOpen(true); setOpen(false); }}
        onLogout={() => { setLogoutOpen(true); setOpen(false); }}
      />
      <div className="app__main">
        <header className="topbar">
          {drawer && (
            <button type="button" className="icon-btn" onClick={() => setOpen(true)} aria-label={t('nav.openMenu')} aria-expanded={open} aria-controls="app-sidebar">
              <Menu size={22} aria-hidden="true" />
            </button>
          )}
          {drawer && <BrandLogo variant="symbol" width={34} decorative className="topbar__symbol" />}
          <h1 className="topbar__title">{activeTitle || t('app.name')}</h1>
          <PreferenceBar />
        </header>
        {!online && (
          <div className="offline-banner" role="status"><WifiOff size={16} aria-hidden="true" /><span>{t('offline.banner')}</span></div>
        )}
        <main id="main" className="app__page" tabIndex={-1}><Outlet /></main>
      </div>

      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <Modal
        open={logoutOpen}
        title={t('logout.title')}
        onClose={() => setLogoutOpen(false)}
        footer={<>
          <Button variant="ghost" onClick={() => setLogoutOpen(false)}>{t('common.cancel')}</Button>
          <Button data-autofocus onClick={() => { setLogoutOpen(false); logout(); navigate('/login', { replace: true }); }}>{t('nav.logout')}</Button>
        </>}
      >
        <p>{t('logout.body')}</p>
      </Modal>
    </div>
  );
}
