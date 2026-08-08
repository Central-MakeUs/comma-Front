import type {
  AppBridge,
  AuthState,
  AuthTokens,
  NativeApiRequest,
  NativeApiResponse
} from '@comma/bridge';
import { NATIVE_FEED_UPLOAD_UNAUTHORIZED_ERROR } from '@comma/bridge';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const AUTH_REQUEST_TIMEOUT_MS = 10_000;
const ACCESS_TOKEN_KEY = 'comma.accessToken';
const REFRESH_TOKEN_KEY = 'comma.refreshToken';

let refreshPromise: Promise<{ accessToken: string; onboardingCompleted?: boolean }> | null = null;

export function getTrustedApiBaseUrl() {
  const environmentUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  const extraUrl = Constants.expoConfig?.extra?.apiBaseUrl;
  const value = environmentUrl || (typeof extraUrl === 'string' ? extraUrl.trim() : '');

  if (!value) throw new Error('Native API URL is missing.');

  const url = new URL(value);
  if (!__DEV__ && url.protocol !== 'https:') {
    throw new Error('Native API URL must use HTTPS.');
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('Native API URL has an unsupported protocol.');
  }

  return value.replace(/\/$/, '');
}

const decodeJwtExpiryMs = (token: string): number | null => {
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
};

export async function readAuthTokens(): Promise<AuthTokens | null> {
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
  ]);

  return accessToken && refreshToken ? { accessToken, refreshToken } : null;
}

const writeAuthTokens = async (tokens: AuthTokens) => {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken),
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken)
  ]);
};

export const clearAuthTokens = async () => {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
  ]);
};

export async function getAuthState(): Promise<AuthState> {
  const tokens = await readAuthTokens();
  return {
    hasTokens: Boolean(tokens),
    accessTokenExpiresAt: tokens ? decodeJwtExpiryMs(tokens.accessToken) : null
  };
}

const parseResponseData = async (response: Response) => {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
};

const fetchAuthApi = async (input: string, init: RequestInit) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AUTH_REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
};

const isRefreshTokenRejected = (response: Response, payload: { success?: boolean } | null) =>
  response.status === 400 ||
  response.status === 401 ||
  response.status === 403 ||
  (response.ok && payload?.success === false);

export async function refreshNativeAuthSession() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const tokens = await readAuthTokens();
    if (!tokens?.refreshToken) {
      await clearAuthTokens();
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
      await clearAuthTokens();
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

const createTrustedApiUrl = (path: string, params?: NativeApiRequest['params']) => {
  if (!path.startsWith('/api/') || path.includes('://')) {
    throw new Error('Only relative /api/ paths are allowed.');
  }

  const url = new URL(path, `${getTrustedApiBaseUrl()}/`);
  if (!url.pathname.startsWith('/api/')) {
    throw new Error('Normalized API path must remain under /api/.');
  }
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
  }
  return url.toString();
};

export async function fetchAuthenticatedApi(
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

export async function migrateAuthTokens(tokens: Parameters<AppBridge['migrateAuthTokens']>[0]) {
  const storedTokens = await readAuthTokens();
  if (!storedTokens && tokens?.accessToken && tokens.refreshToken) await writeAuthTokens(tokens);
  return getAuthState();
}

export async function completeLogin(request: Parameters<AppBridge['completeLogin']>[0]) {
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
    return { success: false, message: payload?.message ?? '로그인을 완료하지 못했습니다.' };
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
}
