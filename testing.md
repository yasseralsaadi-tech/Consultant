# Testing — what was and was NOT verified

## Environment limitation (important)
The authoring environment had **no access to the npm registry**, so `npm install`, `tsc -b` and `vite build` with the real dependencies
(`react-router-dom`, `lucide-react`, `tailwindcss`, `vite`, `@types/react`, `@fontsource-*`) **could not be run**.
**`npm run build` has NOT been executed against this project.** Please run `npm install && npm run build` on a networked machine first.

## What was done instead (a harness, not the shipped toolchain)
- **Bundling:** esbuild 0.28 bundled the app with React 19 from the local machine (the project pins React 18) and with **small stand-ins** for
  `react-router-dom` (hash-based router) and `lucide-react` (placeholder squares for icons). Fonts and Tailwind directives were stubbed out, so the
  tests ran with system fonts (DejaVu Sans for Arabic), **not** Noto Sans Arabic / Inter, and without Tailwind's preflight (the project has its own reset in `base.css`).
- **Type check:** `tsc` 6.0 with `strict` and `noUnusedLocals/Parameters` over all of `src/` against **hand-written shim declarations** for React, Router and Lucide
  (so React-specific typing, e.g. event/ref types, was not checked). Result after fixing shim artefacts: **0 errors**; this does cover the app's own types,
  i18n key checking (`t('...')` keys must exist), services, contexts and config.
- **Browser tests:** Chromium (Playwright) against that bundle.

## Results (harness)
- **Console:** 0 errors / warnings across all runs.
- **Auth:** validation errors (login 2, register 5), wrong password, unverified account, bad/valid invite code, register → verify-email, resend cooldown,
  verification success state, forgot-password uniform message, reset mismatch error, unauthenticated redirect to `/login`. All passed.
- **App:** login → welcome; example question → draft; send; streaming stages; stop; regenerate; sources expand; feedback panel; report error;
  clarification (2 steps); insufficient / refusal / fallback / error states; offline banner + send disabled + draft persisted; rename; delete (+ navigate home);
  sidebar collapse persisted across reload; logout confirmation; settings dialog (tabs, arrow-key navigation, Esc, text size); theme toggle persisted; language switch
  sets `lang`/`dir` and moves the sidebar between right (RTL) and left (LTR); mobile drawer opens from the inline-start edge and closes with Esc. All passed (42 checks).
- **Responsive:** login, register, forgot-password, verify-email, welcome and an answer with an expanded source were checked at 320, 375, 414, 768, 1024, 1440, 1920 and 2560 px,
  in Arabic/light and English/dark. Document `scrollWidth` never exceeded the viewport (no horizontal scroll). The automated element scan reported 16 hits, all of them the
  closed off-canvas drawer (`visibility: hidden`, intentionally off-screen) — a known false positive of the scanner.
- **Screenshots inspected by eye:** login (AR/light desktop, mobile 320/375), welcome, answer with source, clarification, drawer, register (EN/dark mobile), verify-email, settings (EN/dark).
- **Contrast (computed):** text on paper 14.0:1; derived muted text 5.4–6.3:1 (light) and 7.3–8.2:1 (dark); gold-button label 7.59:1; gold-light link on charcoal 9.1:1;
  error text 6.4:1 (light) / 5.0:1 (dark); input border `#777D82` ≥ 3:1. Gold is never used for body text on light backgrounds.

## Not tested / known limitations
- Real `npm install`, `tsc -b`, `vite build`, Tailwind compilation and the real React Router / Lucide / React 18 behaviour (possible mismatches: icon names, router props, React 18 types).
- Real Noto Sans Arabic / Inter rendering and Arabic shaping/line-height with those fonts.
- **Service worker and PWA installability**: written but never executed; must be tested with `npm run build && npm run preview` (HTTPS or localhost).
  No install-prompt button exists.
- Real mobile devices and browsers other than Chromium (Safari/Firefox, iOS safe-area behaviour, on-screen keyboard).
- Screen readers (NVDA / VoiceOver / TalkBack) and automated audits (axe, Lighthouse). WCAG 2.1 AA is a design target, not a certified result.
- Test accounts are mock-only; **no** registration, password change, deletion, email, or session operation really happens.
- `package-lock.json` is not included (could not be generated offline); `npm install` will create it.
- No unit tests (Vitest) are included.
- Supported legal domains, terms/privacy text, retention period and daily limit are placeholders until defined.
