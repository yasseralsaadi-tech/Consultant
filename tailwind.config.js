/** Tailwind is wired to the CSS variables in src/styles/tokens.css so that
 *  light/dark themes switch by changing variables only. */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--c-bg)',
        surface: 'var(--c-surface)',
        'surface-2': 'var(--c-surface-2)',
        fg: 'var(--c-fg)',
        'fg-muted': 'var(--c-fg-muted)',
        line: 'var(--c-border)',
        gold: 'var(--c-gold)',
        'gold-light': 'var(--c-gold-light)',
        ok: 'var(--c-ok)',
        warn: 'var(--c-warn)',
        err: 'var(--c-err)',
        info: 'var(--c-info)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
    },
  },
  plugins: [],
};
