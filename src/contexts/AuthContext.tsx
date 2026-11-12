import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { User } from '../types';
import { authApi } from '../services';
import { storage } from '../utils/storage';

interface AuthValue {
  user: User | null;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => void;
  updateDisplayName: (name: string) => void;
}

const Ctx = createContext<AuthValue | null>(null);
const KEY = 'session';

function readSession(): User | null {
  const local = storage.get<User | null>(KEY, null);
  if (local) return local;
  try {
    const raw = sessionStorage.getItem(storage_key());
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}
const storage_key = () => `mostashar.${KEY}`;

/** DEMO session only: the "session" is a JSON blob in browser storage, not a server session. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readSession);

  const persist = useCallback((u: User | null, remember: boolean) => {
    storage.remove(KEY);
    try { sessionStorage.removeItem(storage_key()); } catch { /* ignore */ }
    if (!u) return;
    if (remember) storage.set(KEY, u);
    else { try { sessionStorage.setItem(storage_key(), JSON.stringify(u)); } catch { /* ignore */ } }
  }, []);

  const login = useCallback(async (email: string, password: string, remember: boolean) => {
    const u = await authApi.login(email, password);
    persist(u, remember);
    setUser(u);
  }, [persist]);

  const logout = useCallback(() => { persist(null, false); setUser(null); }, [persist]);

  const updateDisplayName = useCallback((name: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, displayName: name };
      persist(next, storage.get<User | null>(KEY, null) !== null);
      return next;
    });
  }, [persist]);

  const value = useMemo(() => ({ user, login, logout, updateDisplayName }), [user, login, logout, updateDisplayName]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used inside AuthProvider');
  return v;
}
