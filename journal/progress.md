# Progress journal

## Completed
- Analysis of the DOCX, HTML prototype, brand PDF and both logos; contradictions listed in `decisions.md`.
- Project scaffold (Vite/React/TS/Tailwind config), design tokens for light and dark, Arabic/English dictionaries.
- Auth: login, register (invite code, terms, strength meter), forgot password, reset password, email-verification states, route guards.
- Chat: welcome, composer (limit, drafts, offline, daily limit, 100-message cap), staged progress, stop, regenerate, feedback, error report, copy.
- Answer states: answer, with sources, clarification (max 2), insufficient, refusal, fallback, error.
- Sources: expandable cards with status badges and a clear demo label.
- Conversations: search, rename, delete (confirm), paging, collapsible rail (desktop), drawer (< 1024px).
- Settings: language, theme (system/light/dark), text size, account (demo), sessions (demo), privacy and local data deletion.
- Help / scope page, terms and privacy (sample drafts), 404.
- PWA: manifest, icons, app-shell service worker (production builds).
- Verification with an esbuild-based harness (see `testing.md`).

## Remaining / not done
- **Run `npm install && npm run build` on a networked machine** — never run in the authoring environment (no npm access).
- Test the service worker and installability in a real browser against `npm run preview`.
- Real Noto Sans Arabic / Inter rendering check (fonts install via npm).
- Manual screen-reader pass (NVDA/VoiceOver) and an automated audit (axe/Lighthouse).
- Final supported legal domains, terms and privacy text, retention period, daily limit (open items in the analysis document).
- Backend integration through `src/services`.
- Optional: install prompt button, code splitting with `lazy()`, unit tests (Vitest), CI.
