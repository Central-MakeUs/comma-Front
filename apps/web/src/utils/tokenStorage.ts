export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

const ACCESS_TOKEN_KEY = 'comma.accessToken';
const REFRESH_TOKEN_KEY = 'comma.refreshToken';
const ONBOARDING_COMPLETED_KEY = 'comma.onboardingCompleted';
const NICKNAME_KEY = 'comma.nickname';
const TOKEN_EXPIRY_BUFFER_MS = 60 * 1000;

const canUseLocalStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

export const getTokens = (): StoredTokens | null => {
  if (!canUseLocalStorage()) return null;

  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!accessToken || !refreshToken) return null;

  return { accessToken, refreshToken };
};

export const setTokens = ({ accessToken, refreshToken }: StoredTokens) => {
  if (!canUseLocalStorage()) return;

  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = () => {
  if (!canUseLocalStorage()) return;

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(ONBOARDING_COMPLETED_KEY);
  window.localStorage.removeItem(NICKNAME_KEY);
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

export const setStoredNickname = (nickname: string) => {
  if (!canUseLocalStorage()) return;

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
