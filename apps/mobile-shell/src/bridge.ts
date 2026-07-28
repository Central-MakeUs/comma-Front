import type {
  AppBridge,
  AppPostMessageSchema,
  FeedCreateRequest,
  FeedResponse,
  NativeFeedUploadAuth
} from '@comma/bridge';
import { NATIVE_FEED_UPLOAD_UNAUTHORIZED_ERROR, POST_MESSAGE_EVENT } from '@comma/bridge';
import { bridge, createWebView, postMessageSchema } from '@webview-bridge/react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import { Linking, Platform } from 'react-native';
import { z } from 'zod';

const MAX_GALLERY_PHOTOS = 30;
const DEFAULT_IMAGE_MIME_TYPE = 'image/jpeg';
const FEED_UPLOAD_TIMEOUT_MS = 18_000;

function clampGalleryLimit(limit: number) {
  if (!Number.isFinite(limit)) {
    return MAX_GALLERY_PHOTOS;
  }

  return Math.min(Math.max(Math.trunc(limit), 1), MAX_GALLERY_PHOTOS);
}

function getFilenameFromUri(uri: string, fallback: string) {
  const filename = uri.split('/').pop()?.split('?')[0];

  return filename?.includes('.') ? filename : fallback;
}

function getMimeType(filename: string) {
  const extension = filename.split('.').pop()?.toLowerCase();

  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  if (extension === 'heic') return 'image/heic';
  if (extension === 'heif') return 'image/heif';

  return DEFAULT_IMAGE_MIME_TYPE;
}

async function getUploadableAsset(assetId: string) {
  const assetInfo = await MediaLibrary.getAssetInfoAsync(assetId, {
    shouldDownloadFromNetwork: true
  });
  const uri = assetInfo.localUri ?? assetInfo.uri;

  if (!uri || uri.startsWith('ph://')) {
    throw new Error('선택한 사진을 업로드 가능한 파일로 불러오지 못했어요.');
  }

  const fallbackFilename = `${assetInfo.id}.jpg`;
  const name = assetInfo.filename ?? getFilenameFromUri(uri, fallbackFilename);

  return {
    uri,
    name,
    type: getMimeType(name)
  };
}

async function createFeedWithMultipart(
  assetId: string,
  request: FeedCreateRequest,
  auth: NativeFeedUploadAuth
) {
  const image = await getUploadableAsset(assetId);
  const formData = new FormData();

  if (!FileSystem.cacheDirectory) {
    throw new Error('임시 파일 저장소를 사용할 수 없어요.');
  }

  const requestFileUri = `${FileSystem.cacheDirectory}feed-request-${Date.now()}.json`;

  await FileSystem.writeAsStringAsync(requestFileUri, JSON.stringify(request));

  formData.append('image', image as unknown as Blob);
  formData.append('request', {
    uri: requestFileUri,
    name: 'request.json',
    type: 'application/json'
  } as unknown as Blob);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FEED_UPLOAD_TIMEOUT_MS);

  try {
    const response = await fetch(`${auth.baseUrl.replace(/\/$/, '')}/api/feeds`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.accessToken}`
      },
      body: formData,
      signal: controller.signal
    });
    const payload = (await response.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
      data?: FeedResponse;
    };

    if (response.status === 401) {
      throw new Error(NATIVE_FEED_UPLOAD_UNAUTHORIZED_ERROR);
    }

    if (!response.ok || !payload.success || !payload.data) {
      throw new Error(payload.message ?? '피드 업로드에 실패했어요.');
    }

    return payload.data;
  } finally {
    clearTimeout(timeoutId);
    await FileSystem.deleteAsync(requestFileUri, { idempotent: true }).catch(() => {});
  }
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

    const photoResults = await Promise.allSettled(
      assets.assets.map(async (asset) => {
        const assetInfo = await MediaLibrary.getAssetInfoAsync(asset, {
          shouldDownloadFromNetwork: true
        });

        return {
          id: asset.id,
          uri: assetInfo.localUri ?? assetInfo.uri,
          filename: asset.filename,
          width: asset.width,
          height: asset.height
        };
      })
    );

    return photoResults.flatMap((result) => {
      if (result.status === 'fulfilled') {
        return [result.value];
      }

      console.warn('Failed to load a gallery photo.', result.reason);
      return [];
    });
  },
  async createFeedWithGalleryPhoto(assetId, request, auth) {
    return createFeedWithMultipart(assetId, request, auth);
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
