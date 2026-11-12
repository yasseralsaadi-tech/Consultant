import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { AnswerKind, AnswerPayload, AssistantMessage, Conversation, Feedback, Message } from '../types';
import { APP_CONFIG } from '../config/app';
import { chatApi } from '../services';
import { seedConversations } from '../features/chat/seed';
import { storage } from '../utils/storage';
import { uid } from '../utils/id';
import { todayKey } from '../utils/format';
import { useLocale } from './LocaleContext';

export type SendResult =
  | { ok: true; conversationId: string }
  | { ok: false; reason: 'empty' | 'tooLong' | 'busy' | 'daily' | 'full' };

interface ChatValue {
  conversations: Conversation[];
  generating: { conversationId: string; messageId: string } | null;
  dailyUsed: number;
  createConversation: () => string;
  send: (conversationId: string | null, text: string) => SendResult;
  stop: () => void;
  regenerate: (conversationId: string) => void;
  rename: (id: string, title: string) => void;
  remove: (id: string) => void;
  removeAll: () => void;
  setFeedback: (conversationId: string, messageId: string, feedback: Feedback) => void;
  markReported: (conversationId: string, messageId: string) => void;
}

const Ctx = createContext<ChatValue | null>(null);
const STORE = 'conversations.v1';

function load(lang: 'ar' | 'en'): Conversation[] {
  const saved = storage.get<Conversation[] | null>(STORE, null);
  if (!saved) return seedConversations(lang);
  // A reload while streaming leaves a stale 'streaming' flag: normalise it to 'stopped'.
  return saved.map((c) => ({
    ...c,
    messages: c.messages.map((m) => (m.role === 'assistant' && m.status === 'streaming' ? { ...m, status: 'stopped' as const } : m)),
  }));
}

const readDaily = () => {
  const d = storage.get<{ date: string; count: number }>('daily', { date: todayKey(), count: 0 });
  return d.date === todayKey() ? d.count : 0;
};

export function ChatProvider({ children }: { children: ReactNode }) {
  const { lang } = useLocale();
  const [conversations, setConversations] = useState<Conversation[]>(() => load(lang));
  const [generating, setGenerating] = useState<ChatValue['generating']>(null);
  const [dailyUsed, setDailyUsed] = useState<number>(readDaily);
  const abortRef = useRef<AbortController | null>(null);
  const convRef = useRef(conversations);
  convRef.current = conversations;
  const langRef = useRef(lang);
  langRef.current = lang;

  // Persist (debounced) so a refresh keeps the history.
  useEffect(() => {
    const id = window.setTimeout(() => storage.set(STORE, conversations), 250);
    return () => window.clearTimeout(id);
  }, [conversations]);

  const patchConversation = useCallback((id: string, fn: (c: Conversation) => Conversation) => {
    setConversations((list) => list.map((c) => (c.id === id ? fn(c) : c)));
  }, []);

  const patchAssistant = useCallback((convId: string, msgId: string, fn: (m: AssistantMessage) => AssistantMessage) => {
    patchConversation(convId, (c) => ({
      ...c,
      messages: c.messages.map((m) => (m.id === msgId && m.role === 'assistant' ? fn(m) : m)),
    }));
  }, [patchConversation]);

  const bumpDaily = useCallback(() => {
    const next = readDaily() + 1;
    storage.set('daily', { date: todayKey(), count: next });
    setDailyUsed(next);
  }, []);

  /** Runs one assistant turn against the (mock) API and streams it into state. */
  const runTurn = useCallback(async (convId: string, userText: string) => {
    const conv = convRef.current.find((c) => c.id === convId);
    if (!conv) return;
    const controller = new AbortController();
    abortRef.current = controller;
    const msgId = uid('msg');
    const assistant: AssistantMessage = {
      id: msgId, role: 'assistant', kind: 'answer', status: 'streaming', stage: 'understand',
      payload: { sources: [] }, createdAt: Date.now(), isDemo: true,
    };
    patchConversation(convId, (c) => ({ ...c, messages: [...c.messages, assistant], updatedAt: Date.now() }));
    setGenerating({ conversationId: convId, messageId: msgId });

    try {
      await chatApi.ask(
        { conversation: conv, text: userText, lang: langRef.current },
        {
          signal: controller.signal,
          onStage: (stage) => patchAssistant(convId, msgId, (m) => ({ ...m, stage })),
          onPartial: (partial: Partial<AnswerPayload>) => patchAssistant(convId, msgId, (m) => ({ ...m, payload: { ...m.payload, ...partial } })),
          onFinal: (kind: AnswerKind, payload: AnswerPayload) => {
            patchAssistant(convId, msgId, (m) => ({ ...m, kind, payload, status: 'done', stage: undefined }));
            if (kind !== 'error' && kind !== 'fallback') bumpDaily(); // failed questions are not counted
          },
        },
      );
    } catch (err) {
      const aborted = err instanceof DOMException && err.name === 'AbortError';
      patchAssistant(convId, msgId, (m) => (aborted
        ? { ...m, status: 'stopped', stage: undefined }
        : { ...m, kind: 'error', status: 'done', stage: undefined }));
    } finally {
      abortRef.current = null;
      setGenerating(null);
    }
  }, [bumpDaily, patchAssistant, patchConversation]);

  const createConversation = useCallback(() => {
    const now = Date.now();
    const conv: Conversation = { id: uid('c'), title: '', createdAt: now, updatedAt: now, messages: [] };
    setConversations((l) => [conv, ...l]);
    return conv.id;
  }, []);

  const send = useCallback((conversationId: string | null, raw: string): SendResult => {
    const text = raw.trim();
    if (!text) return { ok: false, reason: 'empty' };
    if (text.length > APP_CONFIG.maxQuestionLength) return { ok: false, reason: 'tooLong' };
    if (abortRef.current) return { ok: false, reason: 'busy' };
    if (readDaily() >= APP_CONFIG.dailyQuestionLimit) return { ok: false, reason: 'daily' };

    let id = conversationId;
    const existing = id ? convRef.current.find((c) => c.id === id) : undefined;
    if (existing && existing.messages.length >= APP_CONFIG.maxMessagesPerConversation) return { ok: false, reason: 'full' };

    const userMsg: Message = { id: uid('msg'), role: 'user', text, createdAt: Date.now() };
    if (!existing) {
      const now = Date.now();
      id = id ?? uid('c');
      const title = text.length > 40 ? `${text.slice(0, 40)}…` : text;
      const conv: Conversation = { id, title, createdAt: now, updatedAt: now, messages: [userMsg] };
      // Keep the ref in sync immediately so runTurn can find the new conversation.
      convRef.current = [conv, ...convRef.current.filter((c) => c.id !== id)];
      setConversations(convRef.current);
    } else {
      const title = existing.title || (text.length > 40 ? `${text.slice(0, 40)}…` : text);
      const updated = { ...existing, title, messages: [...existing.messages, userMsg], updatedAt: Date.now() };
      convRef.current = convRef.current.map((c) => (c.id === updated.id ? updated : c));
      setConversations(convRef.current);
    }
    void runTurn(id as string, text);
    return { ok: true, conversationId: id as string };
  }, [runTurn]);

  const stop = useCallback(() => abortRef.current?.abort(), []);

  const regenerate = useCallback((conversationId: string) => {
    if (abortRef.current) return;
    const conv = convRef.current.find((c) => c.id === conversationId);
    if (!conv) return;
    const lastIdx = conv.messages.length - 1;
    if (lastIdx < 1 || conv.messages[lastIdx].role !== 'assistant') return;
    const userMsg = conv.messages[lastIdx - 1];
    if (userMsg.role !== 'user') return;
    const trimmed = { ...conv, messages: conv.messages.slice(0, lastIdx) };
    convRef.current = convRef.current.map((c) => (c.id === conversationId ? trimmed : c));
    setConversations(convRef.current);
    void runTurn(conversationId, userMsg.text);
  }, [runTurn]);

  const rename = useCallback((id: string, title: string) => {
    const clean = title.trim();
    if (clean) patchConversation(id, (c) => ({ ...c, title: clean.slice(0, 80) }));
  }, [patchConversation]);

  const remove = useCallback((id: string) => setConversations((l) => l.filter((c) => c.id !== id)), []);
  const removeAll = useCallback(() => setConversations([]), []);

  const setFeedback = useCallback((cid: string, mid: string, feedback: Feedback) => patchAssistant(cid, mid, (m) => ({ ...m, feedback })), [patchAssistant]);
  const markReported = useCallback((cid: string, mid: string) => patchAssistant(cid, mid, (m) => ({ ...m, reported: true })), [patchAssistant]);

  const value = useMemo<ChatValue>(() => ({
    conversations, generating, dailyUsed, createConversation, send, stop, regenerate, rename, remove, removeAll, setFeedback, markReported,
  }), [conversations, generating, dailyUsed, createConversation, send, stop, regenerate, rename, remove, removeAll, setFeedback, markReported]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useChat(): ChatValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useChat must be used inside ChatProvider');
  return v;
}
