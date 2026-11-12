import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { APP_CONFIG } from '../config/app';
import { useChat } from '../contexts/ChatContext';
import { useLocale } from '../contexts/LocaleContext';
import { useToast } from '../contexts/ToastContext';
import { Composer } from '../features/chat/Composer';
import { Disclaimer } from '../features/chat/Disclaimer';
import { MessageList } from '../features/chat/MessageList';
import { Welcome } from '../features/chat/Welcome';
import { useOnline } from '../hooks/useOnline';
import { storage } from '../utils/storage';

/** Route `/` (welcome / new conversation) and `/c/:id` (existing conversation). */
export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLocale();
  const { notify } = useToast();
  const { conversations, send, stop, generating, dailyUsed } = useChat();
  const online = useOnline();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const conv = id ? conversations.find((c) => c.id === id) : undefined;

  // Drafts are kept per conversation so an unsent question survives navigation, offline periods and reloads.
  const draftKey = `draft.${id ?? 'new'}`;
  const [draft, setDraft] = useState<string>(() => storage.getString(draftKey) ?? '');
  useEffect(() => { setDraft(storage.getString(draftKey) ?? ''); }, [draftKey]);
  const updateDraft = (v: string) => { setDraft(v); if (v) storage.setString(draftKey, v); else storage.remove(draftKey); };

  if (id && !conv) return <Navigate to="/" replace />;

  const full = !!conv && conv.messages.length >= APP_CONFIG.maxMessagesPerConversation;
  const blocked = full ? 'full' : dailyUsed >= APP_CONFIG.dailyQuestionLimit ? 'daily' : null;

  function submit(text: string) {
    const res = send(conv?.id ?? null, text);
    if (res.ok) {
      updateDraft('');
      if (!conv) { storage.remove('draft.new'); navigate(`/c/${res.conversationId}`); }
    } else if (res.reason === 'tooLong') {
      notify(t('composer.counter', { n: text.length, max: APP_CONFIG.maxQuestionLength }), 'error');
    }
  }

  const hasMessages = !!conv && conv.messages.length > 0;

  return (
    <div className="chat">
      <div className="chat__body">
        {hasMessages && conv ? (
          <MessageList conversation={conv} onClarify={(label) => { if (!generating) submit(label); }} />
        ) : (
          <div className="chat__scroll">
            <Welcome onPick={(text) => { updateDraft(text); inputRef.current?.focus(); }} />
          </div>
        )}
      </div>
      <div className="chat__composer">
        <div className="chat__composer-inner">
          <Composer
            value={draft}
            onChange={updateDraft}
            onSubmit={() => submit(draft)}
            onStop={stop}
            inputRef={inputRef}
            generating={!!generating}
            online={online}
            blocked={blocked}
            dailyLimit={APP_CONFIG.dailyQuestionLimit}
          />
          <Disclaimer />
        </div>
      </div>
    </div>
  );
}
