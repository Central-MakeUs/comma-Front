import type { AppBridge, AppPostMessageSchema } from '@comma/bridge';
import { type BridgeStore, linkBridge } from '@webview-bridge/web';

function isReactNativeWebView() {
  return typeof window !== 'undefined' && Boolean(window.ReactNativeWebView);
}

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
    async setStatusBar() {},
    async getGalleryPhotos() {
      if (isReactNativeWebView()) {
        throw new Error('Native gallery bridge is not ready yet.');
      }

      return [];
    },
    async createFeedWithGalleryPhoto() {
      throw new Error('Native gallery upload is only available in the mobile app.');
    }
  }
});
