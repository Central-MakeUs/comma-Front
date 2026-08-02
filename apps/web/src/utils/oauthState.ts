type WebOAuthProvider = 'KAKAO' | 'GOOGLE' | 'APPLE';

const WEB_OAUTH_STATE_PREFIX = 'comma.oauth.state';
const WEB_OAUTH_STATE_TTL_MS = 10 * 60 * 1000;
const NATIVE_GOOGLE_STATE_KEY = 'comma.oauth.nativeGoogleState';
const NATIVE_GOOGLE_STATE_TTL_MS = 10 * 60 * 1000;

interface StoredOAuthState {
  state: string;
  createdAt: number;
}

const createRandomState = () => {
  const bytes = new Uint8Array(32);
  window.crypto.getRandomValues(bytes);

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const getWebOAuthStateKey = (provider: WebOAuthProvider) =>
  `${WEB_OAUTH_STATE_PREFIX}.${provider.toLowerCase()}`;

const getFreshState = (storedValue: string | null, ttlMs: number) => {
  if (!storedValue) return undefined;

  try {
    const parsed = JSON.parse(storedValue) as Partial<StoredOAuthState>;
    if (
      typeof parsed.state === 'string' &&
      typeof parsed.createdAt === 'number' &&
      Date.now() >= parsed.createdAt &&
      Date.now() - parsed.createdAt <= ttlMs
    ) {
      return parsed.state;
    }
  } catch {
    return undefined;
  }

  return undefined;
};

export const createWebOAuthState = (provider: WebOAuthProvider) => {
  const pendingState: StoredOAuthState = {
    state: createRandomState(),
    createdAt: Date.now()
  };
  const key = getWebOAuthStateKey(provider);
  const storedState = JSON.stringify(pendingState);
  window.sessionStorage.setItem(key, storedState);
  window.localStorage.setItem(key, storedState);

  return pendingState.state;
};

export const consumeWebOAuthState = (provider: WebOAuthProvider, returnedState: string | null) => {
  const key = getWebOAuthStateKey(provider);
  const sessionValue = window.sessionStorage.getItem(key);
  const persistedValue = window.localStorage.getItem(key);
  window.sessionStorage.removeItem(key);
  window.localStorage.removeItem(key);

  const sessionState = getFreshState(sessionValue, WEB_OAUTH_STATE_TTL_MS);
  const persistedState = getFreshState(persistedValue, WEB_OAUTH_STATE_TTL_MS);
  const expectedState = sessionState ?? persistedState;
  return Boolean(expectedState && returnedState && expectedState === returnedState);
};

export const createNativeGoogleOAuthState = () => {
  const pendingState: StoredOAuthState = {
    state: createRandomState(),
    createdAt: Date.now()
  };
  window.localStorage.setItem(NATIVE_GOOGLE_STATE_KEY, JSON.stringify(pendingState));

  return pendingState.state;
};

export const consumeNativeGoogleOAuthState = (returnedState: string | undefined) => {
  const storedValue = window.localStorage.getItem(NATIVE_GOOGLE_STATE_KEY);
  if (!storedValue) return false;

  try {
    const pendingState = JSON.parse(storedValue) as Partial<StoredOAuthState>;
    const isFresh =
      typeof pendingState.createdAt === 'number' &&
      Date.now() >= pendingState.createdAt &&
      Date.now() - pendingState.createdAt <= NATIVE_GOOGLE_STATE_TTL_MS;
    const isMatch =
      typeof pendingState.state === 'string' &&
      typeof returnedState === 'string' &&
      pendingState.state === returnedState;

    if (isFresh && isMatch) {
      window.localStorage.removeItem(NATIVE_GOOGLE_STATE_KEY);
      return true;
    }

    if (!isFresh) window.localStorage.removeItem(NATIVE_GOOGLE_STATE_KEY);
    return false;
  } catch {
    window.localStorage.removeItem(NATIVE_GOOGLE_STATE_KEY);
    return false;
  }
};

export const hasPendingNativeGoogleOAuthState = () => {
  const storedValue = window.localStorage.getItem(NATIVE_GOOGLE_STATE_KEY);
  if (!storedValue) return false;

  try {
    const pendingState = JSON.parse(storedValue) as Partial<StoredOAuthState>;
    const age =
      typeof pendingState.createdAt === 'number' ? Date.now() - pendingState.createdAt : -1;
    const isFresh =
      typeof pendingState.state === 'string' &&
      pendingState.state.length > 0 &&
      age >= 0 &&
      age <= NATIVE_GOOGLE_STATE_TTL_MS;

    if (!isFresh) window.localStorage.removeItem(NATIVE_GOOGLE_STATE_KEY);
    return isFresh;
  } catch {
    window.localStorage.removeItem(NATIVE_GOOGLE_STATE_KEY);
    return false;
  }
};

export const clearNativeGoogleOAuthState = () => {
  window.localStorage.removeItem(NATIVE_GOOGLE_STATE_KEY);
};
