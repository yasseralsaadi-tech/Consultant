# Decisions

## Contradictions and gaps found in the inputs
| Topic | Finding | Decision |
|---|---|---|
| Product name | An older working title appeared in the analysis document. | Official name is **مستشار \| Mostashar**; the old title appears nowhere in the app or docs. |
| English | The analysis document specifies an Arabic-only RTL interface. | Arabic is default and primary; English is an extra interface language (flagged as beyond the document). |
| Theme | Document: follows device setting. Brief: manual theme. | Segmented control System / Light / Dark; default System; choice persisted. |
| Subscription tab | Prototype had a "Subscription (soon)" tab; payments are out of scope. | Removed. |
| Secondary text colour | Brief lists `#777D82`; the guide says it fails for small text. | Use the guide's derived `#596168` (light) / `#C0C5C8` (dark) for small text. |
| Minimum width | Document: 360px. Brief: 320px. | Designed and tested to 320px. |
| Logo tagline | The guide's full-logo example has a tagline baked in; the supplied full logo has none. | Use the supplied full logo; the tagline is separate live text. |
| Supported legal domains | Undefined in the document. | Clearly labelled placeholders on the welcome screen and Help page. |

## Technical decisions
- **Backend seam:** `AuthApi` / `ChatApi` interfaces + mocks in `services/mock`; one file (`services/index.ts`) selects the implementation.
- **Streaming shape:** `ChatApi.ask` emits stage → partial → final events, matching the analysis document's streamed-response design, with abort support (stop button).
- **State:** React Context (Locale, Theme, Toast, Auth, Chat) — no extra libraries.
- **Persistence:** `localStorage` with a `mostashar.` prefix: language, theme, text size, sidebar state, demo session, conversations, drafts, daily counter.
  The "session" is a JSON blob, **not** a real session.
- **Routing:** `BrowserRouter`; conversation id is read from the pathname (`/c/:id`) so layout components do not depend on nested-param behaviour.
- **Styling:** Tailwind is installed and mapped to CSS variables (`tailwind.config.js`), but component styling is hand-written CSS in `src/styles`
  using logical properties. Reason: RTL/LTR correctness and a small, readable design system for a university team. Tailwind utilities may be added freely.
- **RTL/LTR:** `<html lang dir>` updated on language change (and set before first paint in `index.html`); logical CSS properties; icons flipped where directional.
- **Logo handling:** original raster files only; one `BrandLogo` component; 10% clear space; dark panel preserved. A square crop of the symbol image
  is used for compact placements/icons (crop only, no redraw).
- **Accessibility choices:** focus trap + Esc in dialogs and the mobile drawer; tabs with arrow keys; `aria-live` for stage/status; input borders use `#777D82` (≥ 3:1);
  focus ring is charcoal on light and light gold on dark (gold alone is only 2.09:1 on paper).
- **Mock content rule:** all sources/answers are labelled demo; no real article numbers, laws or dates.
- **Account screens:** UI only; every action shows a "demo, nothing changed" notice. Exception: deleting local conversations really clears browser storage and says so.
- **Failed questions:** `error` and `fallback` responses do not count toward the daily limit (document: failed questions are not counted).
- **PWA:** manifest + hand-written app-shell service worker (no plugin) registered in production only; API traffic is never cached (there is none).
- **Pinned majors:** React 18, Router 6, Tailwind 3, Vite 5, TypeScript 5.6 (stable, widely documented).
