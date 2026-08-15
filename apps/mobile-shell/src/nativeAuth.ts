import type {
  AppBridge,
  AuthProvider,
  AuthState,
  AuthTokens,
  NativeApiRequest,
  NativeApiResponse,
  NativeLoginResult
} from '@comma/bridge';
import { NATIVE_FEED_UPLOAD_UNAUTHORIZED_ERROR } from '@comma/bridge';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { getProviderToken, signOutProvider } from './nativeSocialAuth';

const AUTH_REQUEST_TIMEOUT_MS = 10_000;
const ACCESS_TOKEN_KEY = 'comma.accessToken';
const REFRESH_TOKEN_KEY = 'comma.refreshToken';
const AUTH_PROVIDER_KEY = 'comma.authProvider';

let refreshPromise: Promise<{ accessToken: string; onboardingCompleted?: boolean }> | null = null;
let loginPromise: Promise<NativeLoginResult> | null = null;

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

const writeAuthTokens = async (tokens: AuthTokens, provider?: AuthProvider) => {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken),
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken),
    ...(provider ? [SecureStore.setItemAsync(AUTH_PROVIDER_KEY, provider)] : [])
  ]);
};

const readAuthProvider = async (): Promise<AuthProvider | null> => {
  const provider = await SecureStore.getItemAsync(AUTH_PROVIDER_KEY);
  return provider === 'KAKAO' || provider === 'GOOGLE' || provider === 'APPLE' ? provider : null;
};

const clearStoredAuth = async () => {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    SecureStore.deleteItemAsync(AUTH_PROVIDER_KEY)
  ]);
};

export const clearAuthTokens = async () => {
  let provider: AuthProvider | null = null;
  try {
    provider = await readAuthProvider();
  } catch (error) {
    console.warn('Failed to read the social login provider.', {
      message: error instanceof Error ? error.message : 'Unknown secure storage error.'
    });
  }
  if (provider) {
    try {
      await signOutProvider(provider);
    } catch (error) {
      console.warn('Failed to clear the social login session.', {
        provider,
        message: error instanceof Error ? error.message : 'Unknown provider logout error.'
      });
    }
  }
  await clearStoredAuth();
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

async function performProviderLogin(provider: AuthProvider): Promise<NativeLoginResult> {
  let hasProviderSession = false;

  try {
    const credential = await getProviderToken(provider);
    if (credential.type === 'cancelled') return { success: false, cancelled: true };
    hasProviderSession = true;

    const response = await fetchAuthApi(
      `${getTrustedApiBaseUrl()}/api/auth/login/sdk/${encodeURIComponent(provider)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credential.token })
      }
    );
    const payload = (await parseResponseData(response)) as {
      success?: boolean;
      message?: string;
      data?: {
        accessToken?: string;
        refreshToken?: string;
        onboardingCompleted?: boolean;
        nickname?: string | null;
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

    await writeAuthTokens(
      {
        accessToken: payload.data.accessToken,
        refreshToken: payload.data.refreshToken
      },
      provider
    );
    hasProviderSession = false;

    return {
      success: true,
      message: payload.message,
      data: {
        onboardingCompleted: payload.data.onboardingCompleted ?? false,
        nickname: payload.data.nickname ?? null
      }
    };
  } catch (error) {
    console.warn('Native social login failed.', {
      provider,
      message: error instanceof Error ? error.message : 'Unknown login error.'
    });
    return { success: false, message: '로그인을 완료하지 못했습니다.' };
  } finally {
    if (hasProviderSession) {
      try {
        await signOutProvider(provider);
      } catch (error) {
        console.warn('Failed to roll back the social login session.', {
          provider,
          message: error instanceof Error ? error.message : 'Unknown provider logout error.'
        });
      }
      try {
        await clearStoredAuth();
      } catch (error) {
        console.warn('Failed to clear a partial native auth session.', {
          message: error instanceof Error ? error.message : 'Unknown secure storage error.'
        });
      }
    }
  }
}

export function loginWithProvider(provider: AuthProvider) {
  if (!loginPromise) {
    loginPromise = performProviderLogin(provider).finally(() => {
      loginPromise = null;
    });
  }
  return loginPromise;
}
