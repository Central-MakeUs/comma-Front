import { appBridge } from '../bridge/bridge';

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

const ACCESS_TOKEN_KEY = 'comma.accessToken';
const REFRESH_TOKEN_KEY = 'comma.refreshToken';
const ONBOARDING_COMPLETED_KEY = 'comma.onboardingCompleted';
const NICKNAME_KEY = 'comma.nickname';
const TOKEN_EXPIRY_BUFFER_MS = 60 * 1000;
const NATIVE_AUTH_BRIDGE_TIMEOUT_MS = 3000;

type NativeAuthBridgeStatus = 'unknown' | 'available' | 'unavailable';

let nativeAuthBridgeStatus: NativeAuthBridgeStatus = 'unknown';

const canUseLocalStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

export const isNativeApp = () =>
  typeof window !== 'undefined' && window.ReactNativeWebView !== undefined;

export const shouldUseNativeAuthBridge = () =>
  isNativeApp() && nativeAuthBridgeStatus === 'available';

const isAuthState = (
  value: unknown
): value is { hasTokens: boolean; accessTokenExpiresAt: number | null } =>
  typeof value === 'object' &&
  value !== null &&
  'hasTokens' in value &&
  typeof value.hasTokens === 'boolean';

const withNativeBridgeTimeout = <T>(promise: Promise<T>) =>
  new Promise<T>((resolve, reject) => {
    const timeoutId = globalThis.setTimeout(
      () => reject(new Error('Native auth bridge timed out.')),
      NATIVE_AUTH_BRIDGE_TIMEOUT_MS
    );
    promise.then(
      (value) => {
        globalThis.clearTimeout(timeoutId);
        resolve(value);
      },
      (error) => {
        globalThis.clearTimeout(timeoutId);
        reject(error);
      }
    );
  });

const persistTokensLocally = ({ accessToken, refreshToken }: StoredTokens) => {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

const removeLocalTokens = () => {
  if (!canUseLocalStorage()) return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const migrateTokensToNative = async (tokens: StoredTokens | null) => {
  const state = await withNativeBridgeTimeout(appBridge.migrateAuthTokens(tokens));
  if (!isAuthState(state) || (tokens !== null && !state.hasTokens)) {
    throw new Error('Native auth bridge returned an invalid state.');
  }
  nativeAuthBridgeStatus = 'available';
  return state;
};

export const getTokens = (): StoredTokens | null => {
  if (!canUseLocalStorage()) return null;

  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!accessToken || !refreshToken) return null;

  return { accessToken, refreshToken };
};

export const setTokens = async ({ accessToken, refreshToken }: StoredTokens) => {
  if (isNativeApp()) {
    try {
      await migrateTokensToNative({ accessToken, refreshToken });
      removeLocalTokens();
      return;
    } catch {
      nativeAuthBridgeStatus = 'unavailable';
    }
  }
  persistTokensLocally({ accessToken, refreshToken });
};

export const clearTokens = async () => {
  let nativeError: unknown;
  if (shouldUseNativeAuthBridge()) {
    try {
      await appBridge.clearAuthTokens();
    } catch (error) {
      nativeError = error;
    }
  }
  if (canUseLocalStorage()) {
    removeLocalTokens();
    window.localStorage.removeItem(ONBOARDING_COMPLETED_KEY);
    window.localStorage.removeItem(NICKNAME_KEY);
  }
  if (nativeError) throw nativeError;
};

export const initializeAuthStorage = async () => {
  if (!isNativeApp()) return;

  const legacyTokens = getTokens();
  try {
    await migrateTokensToNative(legacyTokens);
    removeLocalTokens();
  } catch {
    nativeAuthBridgeStatus = 'unavailable';
  }
};

export const getAuthState = async () => {
  if (shouldUseNativeAuthBridge()) {
    return appBridge.getAuthState();
  }

  const tokens = getTokens();
  return {
    hasTokens: Boolean(tokens),
    accessTokenExpiresAt: tokens ? getJwtExpiryMs(tokens.accessToken) : null
  };
};

export const getOnboardingCompleted = () => {
  if (!canUseLocalStorage()) return null;

  const value = window.localStorage.getItem(ONBOARDING_COMPLETED_KEY);

  if (value === null) return null;

  return value === 'true';
};

export const setOnboardingCompleted = (onboardingCompleted: boolean) => {
  if (!canUseLocalStorage()) return;

  window.localStorage.setItem(ONBOARDING_COMPLETED_KEY, String(onboardingCompleted));
};

export const getStoredNickname = () => {
  if (!canUseLocalStorage()) return null;

  return window.localStorage.getItem(NICKNAME_KEY);
};

export const setStoredNickname = (nickname: string | null) => {
  if (!canUseLocalStorage()) return;

  if (nickname === null) {
    window.localStorage.removeItem(NICKNAME_KEY);
    return;
  }

  window.localStorage.setItem(NICKNAME_KEY, nickname);
};

const decodeBase64Url = (value: string) => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

  return window.atob(padded);
};

export const getJwtExpiryMs = (token: string): number | null => {
  if (typeof window === 'undefined') return null;

  try {
    const payload = JSON.parse(decodeBase64Url(token.split('.')[1] ?? '')) as { exp?: unknown };

    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
};

export const isAccessTokenValid = (token: string) => {
  const expiryMs = getJwtExpiryMs(token);

  if (!expiryMs) return false;

  return expiryMs - TOKEN_EXPIRY_BUFFER_MS > Date.now();
};

export const isAccessTokenExpiryValid = (expiryMs: number | null) =>
  Boolean(expiryMs && expiryMs - TOKEN_EXPIRY_BUFFER_MS > Date.now());

export const resetNativeAuthBridgeStatusForTests = () => {
  nativeAuthBridgeStatus = 'unknown';
};
