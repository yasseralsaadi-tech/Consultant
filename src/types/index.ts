export type Lang = 'ar' | 'en';
export type ThemeMode = 'system' | 'light' | 'dark';
export type TextSize = 'normal' | 'large' | 'xlarge';

export interface User {
  id: string;
  email: string;
  displayName: string;
}

/** A legal source attached to an answer. In this MVP all values are MOCK data. */
export interface LegalSource {
  id: string;
  title: string;
  lawName: string;
  articleNo: string;
  docType: string;
  date: string;
  status: 'inForce' | 'amended' | 'unknown';
  excerpt: string;
  isDemo: true;
}

export type AnswerKind = 'answer' | 'clarify' | 'insufficient' | 'refusal' | 'fallback' | 'error';

export interface ClarifyPayload {
  question: string;
  options: Array<{ id: string; label: string }>;
  step: number;
  total: number;
}

export interface AnswerPayload {
  summary?: string;
  application?: string;
  note?: string;
  sources: LegalSource[];
  clarify?: ClarifyPayload;
}

export type Feedback = { value: 'up' | 'down'; reasons?: string[]; comment?: string };

export interface UserMessage {
  id: string;
  role: 'user';
  text: string;
  createdAt: number;
}

export interface AssistantMessage {
  id: string;
  role: 'assistant';
  kind: AnswerKind;
  status: 'streaming' | 'done' | 'stopped';
  stage?: 'understand' | 'search' | 'draft';
  payload: AnswerPayload;
  createdAt: number;
  feedback?: Feedback;
  reported?: boolean;
  isDemo: true;
}

export type Message = UserMessage | AssistantMessage;

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  isDemoSeed?: boolean;
}

export interface StreamHandlers {
  onStage: (stage: 'understand' | 'search' | 'draft') => void;
  onPartial: (payload: Partial<AnswerPayload>) => void;
  onFinal: (kind: AnswerKind, payload: AnswerPayload) => void;
  signal: AbortSignal;
}
