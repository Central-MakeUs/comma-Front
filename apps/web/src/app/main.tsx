import { POST_MESSAGE_EVENT } from '@comma/bridge';
import { themeClass } from '@comma/design-system';
import * as Sentry from '@sentry/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import AuthBootstrap from '../features/auth/components/AuthBootstrap';
import { initializeClarity } from '../shared/analytics/clarity';
import { initializeGoogleAnalytics } from '../shared/analytics/googleAnalytics';
import { appBridge } from '../shared/bridge/bridge';
import { AppToastProvider } from '../shared/components/AppToast';
import { NativeBackProvider } from '../shared/components/NativeBack';
import {
  sanitizeSentryBreadcrumb,
  sanitizeSentryBreadcrumbs,
  stripUrlDetails
} from '../shared/monitoring/sentryPrivacy';
import { QueryProvider } from './providers/QueryProvider';
import { router } from './router';
import './styles/global.css';

Sentry.init({
  beforeBreadcrumb: sanitizeSentryBreadcrumb,
  beforeSend(event) {
    event.user = undefined;
    if (event.request) {
      event.request.cookies = undefined;
      event.request.data = undefined;
      event.request.headers = undefined;
      event.request.query_string = undefined;
      if (event.request.url) event.request.url = stripUrlDetails(event.request.url);
    }
    event.breadcrumbs = sanitizeSentryBreadcrumbs(event.breadcrumbs);
    return event;
  },
  dsn: 'https://8de7ae690fb433eb96402edca6bc8ecd@o4511961421774848.ingest.us.sentry.io/4511961426100224',
  enabled: import.meta.env.VITE_SENTRY_ENVIRONMENT !== 'development',
  environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
  sendDefaultPii: false
});

initializeClarity();
initializeGoogleAnalytics();

appBridge.addEventListener(POST_MESSAGE_EVENT.APP_READY, (message) => {
  console.log('app ready', message);
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element was not found.');
}

rootElement.classList.add(themeClass);

ReactDOM.createRoot(rootElement, {
  onCaughtError: Sentry.reactErrorHandler(),
  onUncaughtError: Sentry.reactErrorHandler(),
  onRecoverableError: Sentry.reactErrorHandler()
}).render(
  <React.StrictMode>
    <QueryProvider>
      <AppToastProvider>
        <NativeBackProvider>
          <AuthBootstrap>
            <RouterProvider router={router} />
          </AuthBootstrap>
        </NativeBackProvider>
      </AppToastProvider>
    </QueryProvider>
  </React.StrictMode>
);
