import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/noto-sans-arabic';
import '@fontsource-variable/inter';
import './styles/tailwind.css';
import './styles/index.css';
import App from './App';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// PWA: register the app-shell service worker in production builds only.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => { /* offline shell is optional */ });
  });
}
