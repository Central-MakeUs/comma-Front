import { POST_MESSAGE_EVENT } from '@comma/bridge';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { appBridge } from './bridge';
import './global.css';
import { themeClass } from '@comma/design-system';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import AuthBootstrap from './components/AuthBootstrap';
import { router } from './router/index';

appBridge.addEventListener(POST_MESSAGE_EVENT.APP_READY, (message) => {
  console.log('app ready', message);
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element was not found.');
}

rootElement.classList.add(themeClass);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    },
    mutations: {
      retry: false
    }
  }
});

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap>
        <RouterProvider router={router} />
      </AuthBootstrap>
    </QueryClientProvider>
  </React.StrictMode>
);
