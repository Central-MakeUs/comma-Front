import type { AppBridge, AppPostMessageSchema } from '@comma/bridge';
import { type BridgeStore, linkBridge } from '@webview-bridge/web';

export const appBridge = linkBridge<BridgeStore<AppBridge>, AppPostMessageSchema>({
  timeout: 20000,
  throwOnError: true,
  initialBridge: {
    async openExternalBrowser(url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    },
    async getAppInfo() {
      return {
        platform: 'web',
        version: 'dev'
      };
    },
    async setStatusBar() {}
  }
});
