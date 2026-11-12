import { useEffect, useRef } from 'react';
import { useLocale } from '../../contexts/LocaleContext';
import type { Conversation } from '../../types';
import { AssistantMessageView } from './AssistantMessageView';

/** Scrollable thread. Keeps pinned to the bottom while new content streams in, unless the reader scrolled up. */
export function MessageList({ conversation, onClarify }: { conversation: Conversation; onClarify: (label: string) => void }) {
  const { t } = useLocale();
  const scroller = useRef<HTMLDivElement>(null);
  const pinned = useRef(true);
  const last = conversation.messages[conversation.messages.length - 1];

  useEffect(() => { pinned.current = true; }, [conversation.id]);
  useEffect(() => {
    const el = scroller.current;
    if (el && pinned.current) el.scrollTop = el.scrollHeight;
  }, [conversation.id, conversation.messages.length, last && last.role === 'assistant' ? last.payload.summary?.length : 0, last && last.role === 'assistant' ? last.payload.application?.length : 0, last && last.role === 'assistant' ? last.stage : '']);

  return (
    <div
      ref={scroller}
      className="thread"
      onScroll={(e) => { const el = e.currentTarget; pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80; }}
    >
      <div className="thread__inner" role="log" aria-label={t('chat.thread')} aria-live="off">
        {conversation.messages.map((m, i) =>
          m.role === 'user' ? (
            <article key={m.id} className="msg msg--user" aria-label={t('chat.you')}>
              <span className="msg__who msg__who--user">{t('chat.you')}</span>
              <p className="msg__text">{m.text}</p>
            </article>
          ) : (
            <AssistantMessageView key={m.id} conversationId={conversation.id} message={m} isLast={i === conversation.messages.length - 1} onClarify={onClarify} />
          ),
        )}
      </div>
    </div>
  );
}
