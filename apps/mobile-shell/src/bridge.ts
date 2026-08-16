import type { AppBridge, AppPostMessageSchema } from '@comma/bridge';
import { POST_MESSAGE_EVENT } from '@comma/bridge';
import { bridge, createWebView, postMessageSchema } from '@webview-bridge/react-native';
import { Linking, Platform } from 'react-native';
import { z } from 'zod';
import {
  clearAuthTokens,
  fetchAuthenticatedApi,
  getAuthState,
  loginWithProvider,
  migrateAuthTokens,
  refreshNativeAuthSession
} from './nativeAuth';
import {
  createFeedWithMultipart,
  deletePreparedPhoto,
  getGalleryPhotos,
  prepareGalleryPhoto,
  retainPreparedPhoto,
  takeGalleryPhoto
} from './nativePhotos';

export const appBridge = bridge<AppBridge>({
  async openExternalBrowser(url: string) {
    const protocol = new URL(url).protocol;
    if (protocol !== 'https:' && protocol !== 'http:') {
      throw new Error('Unsupported external URL protocol.');
    }
    await Linking.openURL(url);
  },
  async getAppInfo() {
    return { platform: Platform.OS, version: '1.0.0' };
  },
  async setStatusBar(_style) {
    // Expo StatusBar is rendered declaratively in App.tsx.
  },
  migrateAuthTokens,
  getAuthState,
  loginWithProvider,
  async refreshAuthSession() {
    const result = await refreshNativeAuthSession();
    return { onboardingCompleted: result.onboardingCompleted };
  },
  clearAuthTokens,
  authenticatedRequest: fetchAuthenticatedApi,
  getGalleryPhotos,
  takeGalleryPhoto,
  prepareGalleryPhoto,
  async retainPreparedGalleryPhoto(handle) {
    retainPreparedPhoto(handle);
  },
  deletePreparedGalleryPhoto: deletePreparedPhoto,
  async createFeedWithGalleryPhoto(photo, request) {
    return createFeedWithMultipart(photo.uri, request);
  }
});

export const appPostMessageSchema = postMessageSchema<AppPostMessageSchema>({
  [POST_MESSAGE_EVENT.APP_READY]: {
    validate: (data) =>
      z
        .object({
          platform: z.string()
        })
        .parse(data)
  }
});

export const { WebView, postMessage } = createWebView({
  bridge: appBridge,
  postMessageSchema: appPostMessageSchema,
  debug: true,
  fallback: (method) => {
    console.warn(`Native bridge method "${String(method)}" is not registered.`);
  }
});
