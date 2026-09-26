import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './lib/AuthContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

// Global error & unhandled rejection guard for sandboxed/restricted iframe environments
if (typeof window !== 'undefined') {
  const isIgnorableLifecycleError = (err: any): boolean => {
    const str = String(err?.message || err?.reason || err || '');
    const name = String(err?.name || '');
    return (
      name === 'SecurityError' ||
      name === 'DatabaseClosedError' ||
      name === 'InvalidStateError' ||
      str.includes('Database is closing/hidden') ||
      str.includes('The database connection is closing') ||
      str.includes('Database is closing') ||
      str.includes('closing/hidden') ||
      str.includes('insecure') ||
      str.includes('SecurityError')
    );
  };

  window.addEventListener('unhandledrejection', (event) => {
    if (isIgnorableLifecycleError(event.reason)) {
      event.preventDefault();
    }
  });

  window.addEventListener('error', (event) => {
    if (isIgnorableLifecycleError(event.error || event.message)) {
      event.preventDefault();
    }
  });
}

// Dynamic Sentry initialization to avoid blocking critical bundle
if (import.meta.env.VITE_SENTRY_DSN) {
  import('@sentry/react').then((Sentry) => {
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
  }).catch(() => {});
}

const rootElement = document.getElementById('root')!;
const appTree = (
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);

createRoot(rootElement).render(appTree);
