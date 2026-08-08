import { POST_MESSAGE_EVENT } from '@comma/bridge';
import { themeClass } from '@comma/design-system';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import AuthBootstrap from '../features/auth/components/AuthBootstrap';
import { appBridge } from '../shared/bridge/bridge';
import { AppToastProvider } from '../shared/components/AppToast';
import { QueryProvider } from './providers/QueryProvider';
import { router } from './router';
import './styles/global.css';

appBridge.addEventListener(POST_MESSAGE_EVENT.APP_READY, (message) => {
  console.log('app ready', message);
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element was not found.');
}

rootElement.classList.add(themeClass);

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryProvider>
      <AppToastProvider>
        <AuthBootstrap>
          <RouterProvider router={router} />
        </AuthBootstrap>
      </AppToastProvider>
    </QueryProvider>
  </React.StrictMode>
);
