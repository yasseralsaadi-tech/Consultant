import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  hint?: ReactNode;
  optional?: boolean;
  /** When set the input renders as a password field with a show/hide toggle. */
  password?: boolean;
}

/** Labelled input with inline error, hint and (optionally) a password visibility toggle. */
export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, hint, optional, password, id, className = '', ...rest }, ref,
) {
  const uid = useId();
  const inputId = id ?? uid;
  const { t } = useLocale();
  const [shown, setShown] = useState(false);
  const describedBy = [error ? `${inputId}-err` : null, hint ? `${inputId}-hint` : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`field ${error ? 'field--invalid' : ''} ${className}`}>
      <label htmlFor={inputId} className="field__label">
        {label}
        {optional && <span className="field__optional"> ({t('common.optional')})</span>}
      </label>
      <div className="field__control">
        <input
          ref={ref}
          id={inputId}
          className="input"
          type={password ? (shown ? 'text' : 'password') : rest.type}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {password && (
          <button
            type="button"
            className="field__toggle icon-btn icon-btn--sm"
            onClick={() => setShown((s) => !s)}
            aria-label={shown ? t('auth.hidePassword') : t('auth.showPassword')}
            aria-pressed={shown}
          >
            {shown ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        )}
      </div>
      {hint && !error && <p id={`${inputId}-hint`} className="field__hint">{hint}</p>}
      {error && <p id={`${inputId}-err`} className="field__error" role="alert">{error}</p>}
    </div>
  );
});
