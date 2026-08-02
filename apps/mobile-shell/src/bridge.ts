import type {
  AppBridge,
  AppPostMessageSchema,
  AuthState,
  AuthTokens,
  FeedCreateRequest,
  FeedResponse,
  NativeApiRequest,
  NativeApiResponse
} from '@comma/bridge';
import { NATIVE_FEED_UPLOAD_UNAUTHORIZED_ERROR, POST_MESSAGE_EVENT } from '@comma/bridge';
import { bridge, createWebView, postMessageSchema } from '@webview-bridge/react-native';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as SecureStore from 'expo-secure-store';
import { Linking, Platform } from 'react-native';
import { z } from 'zod';

const MAX_GALLERY_PHOTOS = 30;
const DEFAULT_IMAGE_MIME_TYPE = 'image/jpeg';
const FEED_UPLOAD_TIMEOUT_MS = 18_000;
const AUTH_REQUEST_TIMEOUT_MS = 10_000;
const ACCESS_TOKEN_KEY = 'comma.accessToken';
const REFRESH_TOKEN_KEY = 'comma.refreshToken';
let refreshPromise: Promise<{ accessToken: string; onboardingCompleted?: boolean }> | null = null;

function getTrustedApiBaseUrl() {
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  const extraUrl = Constants.expoConfig?.extra?.apiBaseUrl;
  const value = envUrl || (typeof extraUrl === 'string' ? extraUrl.trim() : '');

  if (!value) {
    throw new Error('Native API URL is missing.');
  }

  const url = new URL(value);
  if (!__DEV__ && url.protocol !== 'https:') {
    throw new Error('Native API URL must use HTTPS.');
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('Native API URL has an unsupported protocol.');
  }

  return value.replace(/\/$/, '');
}

function decodeJwtExpiryMs(token: string): number | null {
  try {
    const payloadSegment = token.split('.')[1];
    if (!payloadSegment) return null;

    const normalized = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    const payload = JSON.parse(globalThis.atob(padded)) as { exp?: unknown };

    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

async function readAuthTokens(): Promise<AuthTokens | null> {
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
  ]);

  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

async function writeAuthTokens(tokens: AuthTokens) {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken),
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken)
  ]);
}

async function deleteAuthTokens() {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
  ]);
}

async function getAuthState(): Promise<AuthState> {
  const tokens = await readAuthTokens();

  return {
    hasTokens: Boolean(tokens),
    accessTokenExpiresAt: tokens ? decodeJwtExpiryMs(tokens.accessToken) : null
  };
}

async function parseResponseData(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function fetchAuthApi(input: string, init: RequestInit) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AUTH_REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

function isRefreshTokenRejected(response: Response, payload: { success?: boolean } | null) {
  return (
    response.status === 400 ||
    response.status === 401 ||
    response.status === 403 ||
    (response.ok && payload?.success === false)
  );
}

async function refreshNativeAuthSession() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const tokens = await readAuthTokens();
    if (!tokens?.refreshToken) {
      await deleteAuthTokens();
      throw new Error(NATIVE_FEED_UPLOAD_UNAUTHORIZED_ERROR);
    }

    const response = await fetchAuthApi(`${getTrustedApiBaseUrl()}/api/auth/reissue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokens.refreshToken })
    });
    const payload = (await parseResponseData(response)) as {
      success?: boolean;
      data?: {
        accessToken?: string;
        refreshToken?: string;
        onboardingCompleted?: boolean;
      };
    } | null;

    if (isRefreshTokenRejected(response, payload)) {
      await deleteAuthTokens();
      throw new Error(NATIVE_FEED_UPLOAD_UNAUTHORIZED_ERROR);
    }
    if (!response.ok || !payload?.success || !payload.data?.accessToken) {
      throw new Error('Native token refresh failed.');
    }

    const nextTokens = {
      accessToken: payload.data.accessToken,
      refreshToken: payload.data.refreshToken ?? tokens.refreshToken
    };
    await writeAuthTokens(nextTokens);

    return {
      accessToken: nextTokens.accessToken,
      onboardingCompleted: payload.data.onboardingCompleted
    };
  })().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

function createTrustedApiUrl(path: string, params?: NativeApiRequest['params']) {
  if (!path.startsWith('/api/') || path.includes('://')) {
    throw new Error('Only relative /api/ paths are allowed.');
  }

  const url = new URL(path, `${getTrustedApiBaseUrl()}/`);
  if (!url.pathname.startsWith('/api/')) {
    throw new Error('Normalized API path must remain under /api/.');
  }
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

async function fetchAuthenticatedApi(
  request: NativeApiRequest,
  allowRefresh = true
): Promise<NativeApiResponse> {
  const tokens = await readAuthTokens();
  if (!tokens) {
    return { status: 401, data: { success: false, message: '로그인이 필요해요.' } };
  }

  const response = await fetchAuthApi(createTrustedApiUrl(request.path, request.params), {
    method: request.method,
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`,
      ...(request.body === undefined ? {} : { 'Content-Type': 'application/json' })
    },
    body: request.body === undefined ? undefined : JSON.stringify(request.body)
  });

  if (response.status === 401 && allowRefresh) {
    try {
      await refreshNativeAuthSession();
      return fetchAuthenticatedApi(request, false);
    } catch (error) {
      if (error instanceof Error && error.message.includes(NATIVE_FEED_UPLOAD_UNAUTHORIZED_ERROR)) {
        return { status: 401, data: { success: false, message: '로그인이 만료되었어요.' } };
      }
      throw error;
    }
  }

  return { status: response.status, data: await parseResponseData(response) };
}

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
  allowRefresh = true
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
    const tokens = await readAuthTokens();
    if (!tokens) {
      throw new Error(NATIVE_FEED_UPLOAD_UNAUTHORIZED_ERROR);
    }

    const response = await fetch(`${getTrustedApiBaseUrl()}/api/feeds`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
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
      if (allowRefresh) {
        await refreshNativeAuthSession();
        return createFeedWithMultipart(assetId, request, false);
      }
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
    const protocol = new URL(url).protocol;
    if (protocol !== 'https:' && protocol !== 'http:') {
      throw new Error('Unsupported external URL protocol.');
    }
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
  async migrateAuthTokens(tokens) {
    const storedTokens = await readAuthTokens();
    if (!storedTokens && tokens?.accessToken && tokens.refreshToken) {
      await writeAuthTokens(tokens);
    }

    return getAuthState();
  },
  async getAuthState() {
    return getAuthState();
  },
  async completeLogin(request) {
    const response = await fetchAuthApi(
      `${getTrustedApiBaseUrl()}/api/auth/login/${encodeURIComponent(request.field)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: request.code, redirectUri: request.redirectUri })
      }
    );
    const payload = (await parseResponseData(response)) as {
      success?: boolean;
      message?: string;
      data?: {
        accessToken?: string;
        refreshToken?: string;
        onboardingCompleted?: boolean;
        nickname?: string;
      };
    } | null;

    if (
      !response.ok ||
      !payload?.success ||
      !payload.data?.accessToken ||
      !payload.data.refreshToken
    ) {
      return {
        success: false,
        message: payload?.message ?? '로그인을 완료하지 못했습니다.'
      };
    }

    await writeAuthTokens({
      accessToken: payload.data.accessToken,
      refreshToken: payload.data.refreshToken
    });

    return {
      success: true,
      message: payload.message,
      data: {
        onboardingCompleted: payload.data.onboardingCompleted ?? false,
        nickname: payload.data.nickname ?? ''
      }
    };
  },
  async refreshAuthSession() {
    const result = await refreshNativeAuthSession();
    return { onboardingCompleted: result.onboardingCompleted };
  },
  async clearAuthTokens() {
    await deleteAuthTokens();
  },
  async authenticatedRequest(request) {
    return fetchAuthenticatedApi(request);
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
  async createFeedWithGalleryPhoto(assetId, request) {
    return createFeedWithMultipart(assetId, request);
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
