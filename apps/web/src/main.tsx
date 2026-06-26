import { POST_MESSAGE_EVENT } from '@comma/bridge';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { appBridge } from './bridge';
import './global.css';
import Onboarding from './pages/Onboarding';

appBridge.addEventListener(POST_MESSAGE_EVENT.APP_READY, (message) => {
  console.log('app ready', message);
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element was not found.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Onboarding />
  </React.StrictMode>
);
