import type { AppBridge, AppPostMessageSchema } from '@comma/bridge';
import { POST_MESSAGE_EVENT } from '@comma/bridge';
import { bridge, createWebView, postMessageSchema } from '@webview-bridge/react-native';
import { Linking, Platform } from 'react-native';
import { z } from 'zod';

export const appBridge = bridge<AppBridge>({
  async openExternalBrowser(url: string) {
    await Linking.openURL(url);
  },
  async getAppInfo() {
    return {
      platform: Platform.OS,
      version: '1.0.0'
    };
  },
  async setStatusBar(_style) {
    // Expo StatusBar is rendered declaratively in App.tsx.
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
