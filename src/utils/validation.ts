import { APP_CONFIG } from '../config/app';

export type ErrKey =
  | 'err.required' | 'err.emailInvalid' | 'err.passwordShort' | 'err.passwordLong' | 'err.passwordWeak'
  | 'err.passwordMismatch' | 'err.termsRequired' | 'err.inviteRequired';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const COMMON = ['12345678', 'password', 'password1', 'qwertyui', '123456789', '11111111', 'iloveyou', 'abc12345'];

export const validateEmail = (v: string): ErrKey | null => {
  if (!v.trim()) return 'err.required';
  return EMAIL_RE.test(v.trim()) ? null : 'err.emailInvalid';
};

export const validatePassword = (v: string): ErrKey | null => {
  if (!v) return 'err.required';
  if (v.length < APP_CONFIG.passwordMin) return 'err.passwordShort';
  if (v.length > APP_CONFIG.passwordMax) return 'err.passwordLong';
  if (COMMON.includes(v.toLowerCase())) return 'err.passwordWeak';
  return null;
};

export const validateConfirm = (pw: string, confirm: string): ErrKey | null => {
  if (!confirm) return 'err.required';
  return pw === confirm ? null : 'err.passwordMismatch';
};

/** 0..3 rough strength meter for UI feedback only. */
export function passwordStrength(v: string): 0 | 1 | 2 | 3 {
  if (!v) return 0;
  if (COMMON.includes(v.toLowerCase()) || v.length < APP_CONFIG.passwordMin) return 1;
  let s = 1;
  if (v.length >= 12) s++;
  if (/[a-z\u0600-\u06FF]/i.test(v) && /\d/.test(v) && /[^a-z0-9]/i.test(v)) s++;
  return Math.min(3, s) as 1 | 2 | 3;
}
