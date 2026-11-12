import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { LoaderCircle } from 'lucide-react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  block?: boolean;
  icon?: ReactNode;
}

export function Button({ variant = 'primary', loading = false, block = false, icon, children, className = '', disabled, type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} ${block ? 'btn--block' : ''} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <LoaderCircle className="spin" size={18} aria-hidden="true" /> : icon}
      <span>{children}</span>
    </button>
  );
}
