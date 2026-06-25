import { POST_MESSAGE_EVENT } from '@comma/bridge';
import {
  actionButton,
  brand,
  description,
  eyebrow,
  panel,
  screen,
  themeClass,
  title
} from '@comma/design-system';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { appBridge } from './bridge';
import './global.css';

async function sendOpenExternalUrl() {
  await appBridge.openExternalBrowser('https://example.com');
}

async function logAppInfo() {
  const appInfo = await appBridge.getAppInfo();

  console.log('app info', appInfo);
}

appBridge.addEventListener(POST_MESSAGE_EVENT.APP_READY, (message) => {
  console.log('app ready', message);
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element was not found.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <main className={`${themeClass} ${screen}`}>
      <section className={panel}>
        <p className={eyebrow}>Web running inside native shell</p>
        <h1 className={title}>{brand.name}</h1>
        <p className={description}>
          React 웹앱을 그대로 개발하고, Expo shell은 WebView와 네이티브 기능만 담당합니다.
        </p>
        <button className={actionButton()} type="button" onClick={sendOpenExternalUrl}>
          Open external URL
        </button>
        <button className={actionButton({ tone: 'secondary' })} type="button" onClick={logAppInfo}>
          Get app info
        </button>
      </section>
    </main>
  </React.StrictMode>
);
