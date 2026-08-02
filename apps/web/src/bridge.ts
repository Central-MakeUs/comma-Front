import type { AppBridge, AppPostMessageSchema } from '@comma/bridge';
import { type BridgeStore, linkBridge } from '@webview-bridge/web';

function isReactNativeWebView() {
  return typeof window !== 'undefined' && Boolean(window.ReactNativeWebView);
}

export const appBridge = linkBridge<BridgeStore<AppBridge>, AppPostMessageSchema>({
  timeout: 60000,
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
    async migrateAuthTokens() {
      return { hasTokens: false, accessTokenExpiresAt: null };
    },
    async getAuthState() {
      return { hasTokens: false, accessTokenExpiresAt: null };
    },
    async completeLogin() {
      throw new Error('Native login is only available in the mobile app.');
    },
    async refreshAuthSession() {
      throw new Error('Native auth refresh is only available in the mobile app.');
    },
    async clearAuthTokens() {},
    async authenticatedRequest() {
      throw new Error('Native authenticated requests are only available in the mobile app.');
    },
    async getGalleryPhotos() {
      if (isReactNativeWebView()) {
        throw new Error('Native gallery bridge is not ready yet.');
      }

      return [];
    },
    async prepareGalleryPhoto() {
      throw new Error('Native photo preparation is only available in the mobile app.');
    },
    async retainPreparedGalleryPhoto() {},
    async deletePreparedGalleryPhoto() {},
    async createFeedWithGalleryPhoto() {
      throw new Error('Native gallery upload is only available in the mobile app.');
    }
  }
});
