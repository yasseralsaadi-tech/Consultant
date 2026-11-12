import { useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, title, onClose, children, footer, size = 'sm' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const { t } = useLocale();
  useFocusTrap(ref, open, onClose);
  if (!open) return null;
  return (
    <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={ref} className={`modal modal--${size}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="modal__head">
          <h2 id={titleId} className="modal__title">{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t('common.close')}>
            <X size={20} aria-hidden="true" />
          </button>
        </header>
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__foot">{footer}</footer>}
      </div>
    </div>
  );
}
