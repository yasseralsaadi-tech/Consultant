/** Central product limits and flags. Values mirror the system analysis document
 *  where it defines them; others are demo placeholders and are marked as such. */
export const APP_CONFIG = {
  productName: { ar: 'مستشار', en: 'Mostashar' },
  /** Max characters in a question (analysis doc: 2000). */
  maxQuestionLength: 2000,
  /** Max messages per conversation before asking to start a new one (doc: 100). */
  maxMessagesPerConversation: 100,
  /** Max consecutive clarification questions (doc: 2). */
  maxClarifications: 2,
  /** Demo daily limit. The real value is a backend setting. */
  dailyQuestionLimit: 20,
  /** Closed-trial registration requires an invite code (doc 3.1.11). Backend-configurable later. */
  inviteRequired: true,
  /** Demo-only invite code accepted by the mock auth service. */
  demoInviteCode: 'DEMO-2026',
  passwordMin: 8,
  passwordMax: 128,
  conversationPageSize: 15,
  storagePrefix: 'mostashar.',
} as const;
