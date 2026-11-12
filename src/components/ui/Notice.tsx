import type { ReactNode } from 'react';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';

type Tone = 'info' | 'warning' | 'error' | 'success' | 'demo';
const ICON = { info: Info, warning: TriangleAlert, error: CircleAlert, success: CircleCheck, demo: Info } as const;

/** Inline status message. `demo` is the standard "this is demonstration only" banner. */
export function Notice({ tone = 'info', children, role }: { tone?: Tone; children: ReactNode; role?: 'alert' | 'status' }) {
  const Icon = ICON[tone];
  return (
    <div className={`notice notice--${tone}`} role={role}>
      <Icon size={18} aria-hidden="true" className="notice__icon" />
      <div className="notice__text">{children}</div>
    </div>
  );
}
