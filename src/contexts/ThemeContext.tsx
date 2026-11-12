import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { TextSize, ThemeMode } from '../types';
import { storage } from '../utils/storage';

interface ThemeValue {
  mode: ThemeMode;
  resolved: 'light' | 'dark';
  textSize: TextSize;
  setMode: (m: ThemeMode) => void;
  toggle: () => void;
  setTextSize: (s: TextSize) => void;
}

const Ctx = createContext<ThemeValue | null>(null);

const MQ = '(prefers-color-scheme: dark)';
const prefersDark = () => typeof matchMedia === 'function' && matchMedia(MQ).matches;
const asMode = (v: string | null): ThemeMode => (v === 'light' || v === 'dark' ? v : 'system');
const asSize = (v: string | null): TextSize => (v === 'large' || v === 'xlarge' ? v : 'normal');

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => asMode(storage.getString('theme')));
  const [textSize, setSizeState] = useState<TextSize>(() => asSize(storage.getString('textSize')));
  const [systemDark, setSystemDark] = useState<boolean>(prefersDark);

  useEffect(() => {
    if (typeof matchMedia !== 'function') return;
    const mq = matchMedia(MQ);
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const resolved: 'light' | 'dark' = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;

  useEffect(() => {
    const d = document.documentElement;
    d.setAttribute('data-theme', resolved);
    d.style.colorScheme = resolved;
    d.setAttribute('data-textsize', textSize);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'dark' ? '#171B1E' : '#F7F5EF');
  }, [resolved, textSize]);

  const setMode = useCallback((m: ThemeMode) => { storage.setString('theme', m); setModeState(m); }, []);
  const setTextSize = useCallback((s: TextSize) => { storage.setString('textSize', s); setSizeState(s); }, []);

  const value = useMemo<ThemeValue>(
    () => ({ mode, resolved, textSize, setMode, setTextSize, toggle: () => setMode(resolved === 'dark' ? 'light' : 'dark') }),
    [mode, resolved, textSize, setMode, setTextSize],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useTheme must be used inside ThemeProvider');
  return v;
}
