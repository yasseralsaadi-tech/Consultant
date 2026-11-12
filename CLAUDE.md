# CLAUDE.md — project rules

## What this is
Frontend-only MVP of **مستشار | Mostashar** (المستشار القانوني الذكي للقانون السوري). No backend. All data is mock.
Source of truth order: (1) system analysis document (scope/requirements), (2) brand identity guide (colour/type/identity),
(3) original logo images, (4) the HTML prototype (visual/interaction reference only).

## Architecture
- Feature-based: `src/features/<feature>`, shared UI in `src/components/ui`, app-wide state in `src/contexts`.
- Pages in `src/pages` are thin; route guards in `src/routes/guards.tsx`; layouts in `src/layouts`.
- **Backend seam:** UI code imports only from `src/services` (`authApi`, `chatApi`). Interfaces are in `services/api.ts`; mocks in `services/mock/`.
- Limits/flags: `src/config/app.ts` (do not hard-code numbers in components).
- Persistence: `src/utils/storage.ts` (prefix `mostashar.`). Never touch `localStorage` directly.

## Coding conventions
- TypeScript strict; no `any` unless unavoidable. Function components + hooks only.
- All user-facing text goes through `t('key')` (`src/i18n`). Add every key to **both** `ar.ts` and `en.ts` (the `Dict` type enforces this).
- Use CSS **logical properties** (`margin-inline`, `inset-inline-start`, `text-align:start`, `border-inline-*`). Never `left/right` for layout.
  Icons that imply direction get `flip-rtl` / `flip-rtl-reverse`.
- Colours only via CSS variables from `styles/tokens.css`. No raw hex in components. Do not add unrelated colours.
- Icons: Lucide only. No emoji icons.
- Accessibility target WCAG 2.1 AA: labelled controls, visible focus, focus trap in dialogs, `aria-live` for status, touch targets ≥ 44px.

## Brand identity rules
- Palette (guide): charcoal `#171B1E/#242B30/#2D3439`, gold `#C8A85A`, light gold `#E6CC82`, paper `#F7F5EF`, white, text `#20262B`, border `#DAD8D0/#394147`.
- Gold is an accent (primary action, active state, accents). **Not** for body text on light backgrounds.
- `#777D82` is **not** used for small text; use the derived `#596168` (light) / `#C0C5C8` (dark).
- Fonts: Noto Sans Arabic (Arabic), Inter (English). No artificial letter-spacing.

## Logo usage rules (non-negotiable)
- Files in `src/assets/brand/` are the originals. **Never** edit, redraw, vectorise, recolour, remove the background, stretch, or retype them.
- The decorative wordmark «مستشار» exists **only** as the original image. Never recreate it with a font.
- Use `<BrandLogo variant="full" />` (symbol + wordmark) for login/registration, sidebar, welcome and other prominent places.
- Use `<BrandLogo variant="symbol" />` for compact places (favicon, rail, top bar, message avatar). It uses a square crop of the original
  symbol image (`mostashar-symbol.png`); the untouched original is kept as `mostashar-symbol-original.jpg`.
- Keep the dark logo panel as-is on light backgrounds. Keep ~10% clear space (handled in `.logo-clear`). Never place text over the logo.
- The tagline «المستشار القانوني الذكي للقانون السوري» is separate live text, never merged into the image.

## Important implementation rules
- Never present mock content as real legal information. Mock sources are labelled «بيانات تجريبية / Demo data»; do not add real article numbers, laws or dates.
- Account actions (change password, delete account, log out everywhere, resend email, etc.) are UI demonstrations. Do not claim they work.
- Every answer state keeps the fixed disclaimer (it is a UI component, not model text). Never imply Mostashar replaces a lawyer/judge.
- Do not add features outside the analysis document (no payments, no admin dashboard, no social/phone login).

## Project limitations
No backend, auth, AI, legal search or payments. Supported legal domains are still undefined in the analysis document (placeholders shown).
English is an extra interface language beyond the analysis document (which specifies Arabic only).
