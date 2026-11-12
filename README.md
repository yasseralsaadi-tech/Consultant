# مستشار | Mostashar — React Frontend (MVP)

**المستشار القانوني الذكي للقانون السوري** — a frontend-only MVP of an AI-assisted Syrian legal consultation service.

> **Demo only.** There is no backend, no real authentication and no real AI or legal database.
> All answers, legal sources, accounts and account actions are **mock/demonstration data**.
> Nothing in this app is legal information, and no account operation actually happens.

## Technologies

React 18 · TypeScript · Vite · Tailwind CSS 3 (wired to CSS design tokens) · React Router 6 · Lucide React · Context API.
Fonts (self-hosted via npm, no CDN): Noto Sans Arabic (Arabic) and Inter (English).

## Install and run

Requires Node.js 18+ (20 or 22 recommended).

```bash
npm install
npm run dev        # http://localhost:5173
```

Other commands:

```bash
npm run build      # type-check (tsc -b) + production build into dist/
npm run preview    # serve the production build locally (needed to test the service worker)
npm run typecheck  # TypeScript only
```

> The PWA service worker is registered **only in production builds** (`npm run build && npm run preview`).

## Trying the demo

- Log in with any valid email and a password of 8+ characters.
  - Password `invalid123` → login error. Email starting with `unverified` → "account not activated".
- Registration needs the demo invite code `DEMO-2026` (a closed-trial rule from the analysis document).
- Chat scenarios are chosen by a keyword in the question (also listed in the in-app **Help** page):

| Type in the question | Result |
|---|---|
| any normal question | answer + sample legal sources |
| a very short question (< 18 chars) | clarification question (max 2 in a row) |
| `insufficient_demo` / `غير_كاف` | insufficient information |
| `out_of_scope_demo` / `خارج_النطاق` | refusal / out of scope |
| `model_down_demo` / `تعطل_النموذج` | fallback: related texts only |
| `error_demo` / `خطأ_تجريبي` | error state |

## Features

Login, registration, forgot/reset password, email verification states · chat with staged progress, stop, regenerate, feedback, error report ·
conversation history (search, rename, delete, paging) · expandable legal sources · clarification chips · responsible-answer states ·
settings (language, theme, text size, demo account screens, privacy) · Arabic (default, RTL) + English (LTR) · light/dark/system theme ·
responsive from 320px to ultra-wide · offline banner and draft preservation · PWA manifest + app-shell service worker.

## Project layout

```
src/
  assets/brand/     original logo files (never edited)
  components/ui/    Button, Field, Modal, Notice, Segmented, BrandLogo, PreferenceBar
  config/           product limits and flags (app.ts)
  contexts/         Locale, Theme, Toast, Auth, Chat
  features/         auth-adjacent chat, answers, sources, conversations, settings
  hooks/ i18n/ layouts/ pages/ routes/ services/ styles/ types/ utils/
public/             manifest, service worker, icons
```

## Connecting a real backend

All backend access goes through two interfaces in `src/services/api.ts` (`AuthApi`, `ChatApi`).
Implement them with `fetch`/`EventSource` and swap the exports in `src/services/index.ts`.
`ChatApi.ask` is shaped like a streamed response: stage events → partial text → one final event (see the mock in `services/mock/`).
Limits (question length, daily limit, etc.) live in `src/config/app.ts`.

## Documentation

`CLAUDE.md` (rules for contributors/AI tools) · `decisions.md` · `testing.md` (what was and was not verified) · `journal/progress.md`.
