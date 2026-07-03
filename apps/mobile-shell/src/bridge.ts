import type { AppBridge, AppPostMessageSchema } from '@comma/bridge';
import { POST_MESSAGE_EVENT } from '@comma/bridge';
import { bridge, createWebView, postMessageSchema } from '@webview-bridge/react-native';
import * as MediaLibrary from 'expo-media-library';
import { Linking, Platform } from 'react-native';
import { z } from 'zod';

const MAX_GALLERY_PHOTOS = 30;

function clampGalleryLimit(limit: number) {
  if (!Number.isFinite(limit)) {
    return MAX_GALLERY_PHOTOS;
  }

  return Math.min(Math.max(Math.trunc(limit), 1), MAX_GALLERY_PHOTOS);
}

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
  },
  async getGalleryPhotos(limit = 30) {
    const safeLimit = clampGalleryLimit(limit);
    const permission = await MediaLibrary.requestPermissionsAsync(false, ['photo']);

    if (!permission.granted) {
      return [];
    }

    const assets = await MediaLibrary.getAssetsAsync({
      first: safeLimit,
      mediaType: MediaLibrary.MediaType.photo,
      sortBy: [[MediaLibrary.SortBy.creationTime, false]]
    });

    return await Promise.all(
      assets.assets.map(async (asset) => {
        const assetInfo = await MediaLibrary.getAssetInfoAsync(asset, {
          shouldDownloadFromNetwork: true
        });

        return {
          id: asset.id,
          uri: assetInfo.localUri ?? assetInfo.uri,
          width: asset.width,
          height: asset.height
        };
      })
    );
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
