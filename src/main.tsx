import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './lib/AuthContext';

// Global error & unhandled rejection guard for sandboxed/restricted iframe environments
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reasonStr = String(event.reason || '');
    const reasonMsg = event.reason?.message || '';
    const reasonName = event.reason?.name || '';
    
    if (
      reasonName === 'SecurityError' ||
      reasonMsg.includes('insecure') ||
      reasonStr.includes('insecure') ||
      reasonStr.includes('SecurityError')
    ) {
      console.warn('Caught and prevented unhandled SecurityError / iframe restriction:', event.reason);
      event.preventDefault();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = String(event.message || '');
    if (msg.includes('insecure') || msg.includes('SecurityError')) {
      console.warn('Caught and prevented global SecurityError:', event.message);
      event.preventDefault();
    }
  });
}

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
