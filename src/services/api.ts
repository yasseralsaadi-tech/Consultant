/**
 * API contracts for the future backend.
 *
 * The UI only talks to these interfaces (see services/index.ts). To integrate a real backend,
 * implement `AuthApi` and `ChatApi` with fetch / EventSource and swap them in `services/index.ts`.
 * Nothing else in the app needs to change.
 */
import type { Conversation, Lang, StreamHandlers, User } from '../types';

export type ApiErrorCode = 'invalid' | 'unverified' | 'locked' | 'invite' | 'generic';

export class ApiError extends Error {
  code: ApiErrorCode;
  constructor(code: ApiErrorCode) {
    super(code);
    this.code = code;
    this.name = 'ApiError';
  }
}

export interface RegisterInput {
  email: string;
  password: string;
  displayName?: string;
  inviteCode?: string;
  acceptedTerms: boolean;
}

export interface AuthApi {
  login(email: string, password: string): Promise<User>;
  register(input: RegisterInput): Promise<{ email: string }>;
  resendVerification(email: string): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
}

export interface AskInput {
  conversation: Conversation;
  text: string;
  lang: Lang;
}

/** `ask` mirrors a streamed backend response: stage events, partial text, then one final event.
 *  It must reject with an AbortError when `handlers.signal` is aborted. */
export interface ChatApi {
  ask(input: AskInput, handlers: StreamHandlers): Promise<void>;
}
