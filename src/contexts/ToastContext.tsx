import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import { uid } from '../utils/id';
import { useLocale } from './LocaleContext';

type Tone = 'success' | 'info' | 'error';
interface Toast { id: string; text: string; tone: Tone }
interface ToastValue { notify: (text: string, tone?: Tone) => void }

const Ctx = createContext<ToastValue | null>(null);
const ICON = { success: CircleCheck, info: Info, error: TriangleAlert } as const;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<string, number>());
  const { t } = useLocale();

  const dismiss = useCallback((id: string) => {
    setToasts((x) => x.filter((i) => i.id !== id));
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
  }, []);

  const notify = useCallback((text: string, tone: Tone = 'info') => {
    const id = uid('toast');
    setToasts((x) => [...x.slice(-2), { id, text, tone }]);
    timers.current.set(id, window.setTimeout(() => dismiss(id), 5000));
  }, [dismiss]);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="toasts" role="region" aria-live="polite" aria-label="Notifications">
        {toasts.map((x) => {
          const Icon = ICON[x.tone];
          return (
            <div key={x.id} className={`toast toast--${x.tone}`}>
              <Icon size={18} aria-hidden="true" />
              <span>{x.text}</span>
              <button type="button" className="icon-btn icon-btn--sm" onClick={() => dismiss(x.id)} aria-label={t('common.close')}>
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToastValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useToast must be used inside ToastProvider');
  return v;
}
