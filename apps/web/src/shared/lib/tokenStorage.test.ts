import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getStoredNickname,
  getTokens,
  initializeAuthStorage,
  resetNativeAuthBridgeStatusForTests,
  setStoredNickname,
  setTokens,
  shouldUseNativeAuthBridge
} from './tokenStorage';

const bridgeMocks = vi.hoisted(() => ({
  migrateAuthTokens: vi.fn(),
  clearAuthTokens: vi.fn(),
  getAuthState: vi.fn(),
  isNativeMethodAvailable: vi.fn()
}));

vi.mock('../bridge/bridge', () => ({ appBridge: bridgeMocks }));

const createStorage = (): Storage => {
  const values = new Map<string, string>();
  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => Array.from(values.keys())[index] ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value)
  };
};

beforeEach(() => {
  vi.clearAllMocks();
  resetNativeAuthBridgeStatusForTests();
  bridgeMocks.isNativeMethodAvailable.mockReturnValue(true);
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { localStorage: createStorage() }
  });
});

describe('stored nickname', () => {
  it('removes a previous nickname when the login response contains null', () => {
    setStoredNickname('comma-user');
    expect(getStoredNickname()).toBe('comma-user');

    setStoredNickname(null);
    expect(getStoredNickname()).toBeNull();
  });
});

describe('native auth storage compatibility', () => {
  it('migrates web OAuth tokens into the native bridge when supported', async () => {
    Object.assign(window, { ReactNativeWebView: {} });
    bridgeMocks.migrateAuthTokens.mockResolvedValue({
      hasTokens: true,
      accessTokenExpiresAt: null
    });

    await setTokens({ accessToken: 'access', refreshToken: 'refresh' });

    expect(bridgeMocks.migrateAuthTokens).toHaveBeenCalledWith({
      accessToken: 'access',
      refreshToken: 'refresh'
    });
    expect(shouldUseNativeAuthBridge()).toBe(true);
    expect(getTokens()).toBeNull();
  });

  it('keeps tokens in localStorage when the legacy bridge is unavailable', async () => {
    Object.assign(window, { ReactNativeWebView: {} });
    bridgeMocks.isNativeMethodAvailable.mockReturnValue(false);

    await setTokens({ accessToken: 'legacy-access', refreshToken: 'legacy-refresh' });

    expect(bridgeMocks.migrateAuthTokens).not.toHaveBeenCalled();
    expect(shouldUseNativeAuthBridge()).toBe(false);
    expect(getTokens()).toEqual({
      accessToken: 'legacy-access',
      refreshToken: 'legacy-refresh'
    });
  });

  it('rejects startup migration failures without treating the native bridge as unavailable', async () => {
    Object.assign(window, { ReactNativeWebView: {} });
    window.localStorage.setItem('comma.accessToken', 'legacy-access');
    window.localStorage.setItem('comma.refreshToken', 'legacy-refresh');
    bridgeMocks.migrateAuthTokens.mockResolvedValue(undefined);

    await expect(initializeAuthStorage()).rejects.toThrow(
      'Native auth bridge returned an invalid state.'
    );

    expect(shouldUseNativeAuthBridge()).toBe(false);
    expect(getTokens()).toEqual({
      accessToken: 'legacy-access',
      refreshToken: 'legacy-refresh'
    });
  });

  it('does not persist tokens locally when a supported native bridge fails', async () => {
    Object.assign(window, { ReactNativeWebView: {} });
    bridgeMocks.migrateAuthTokens.mockRejectedValue(new Error('SecureStore write failed.'));

    await expect(setTokens({ accessToken: 'access', refreshToken: 'refresh' })).rejects.toThrow(
      'SecureStore write failed.'
    );

    expect(shouldUseNativeAuthBridge()).toBe(false);
    expect(getTokens()).toBeNull();
  });
});
