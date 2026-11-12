import { APP_CONFIG } from '../../config/app';
import { ApiError, type AuthApi } from '../api';
import { sleep } from './delay';

let failedAttempts = 0;

/** DEMO ONLY. No account exists anywhere; rules below only exist to exercise the UI states. */
export const mockAuthService: AuthApi = {
  async login(email, password) {
    await sleep(700);
    const e = email.trim().toLowerCase();
    if (failedAttempts >= 5) throw new ApiError('locked');
    if (password === 'invalid123') {
      failedAttempts += 1;
      throw new ApiError('invalid');
    }
    if (e.startsWith('unverified')) throw new ApiError('unverified');
    failedAttempts = 0;
    const name = e.split('@')[0].replace(/[._-]+/g, ' ');
    return { id: 'demo-user', email: e, displayName: name };
  },

  async register(input) {
    await sleep(800);
    if (APP_CONFIG.inviteRequired && (input.inviteCode ?? '').trim().toUpperCase() !== APP_CONFIG.demoInviteCode) {
      throw new ApiError('invite');
    }
    return { email: input.email.trim().toLowerCase() };
  },

  async resendVerification() {
    await sleep(500);
  },

  async requestPasswordReset() {
    await sleep(700); // Uniform result whether or not the email exists.
  },

  async resetPassword() {
    await sleep(700);
  },
};
