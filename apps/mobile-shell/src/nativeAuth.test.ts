import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getProviderToken: vi.fn(),
  signOutProvider: vi.fn(),
  secureDelete: vi.fn(),
  secureGet: vi.fn(),
  secureSet: vi.fn()
}));

const secureValues = new Map<string, string>();

vi.mock('expo-constants', () => ({
  default: { expoConfig: { extra: { apiBaseUrl: 'https://api.example.com' } } }
}));

vi.mock('expo-secure-store', () => ({
  getItemAsync: mocks.secureGet,
  setItemAsync: mocks.secureSet,
  deleteItemAsync: mocks.secureDelete
}));

vi.mock('./nativeSocialAuth', () => ({
  getProviderToken: mocks.getProviderToken,
  signOutProvider: mocks.signOutProvider
}));

import { clearAuthTokens, loginWithProvider, readAuthTokens } from './nativeAuth';

const loginResponse = (overrides: Record<string, unknown> = {}) =>
  new Response(
    JSON.stringify({
      success: true,
      message: 'success',
      data: {
        accessToken: 'comma-access-token',
        refreshToken: 'comma-refresh-token',
        onboardingCompleted: false,
        nickname: null,
        ...overrides
      }
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );

beforeEach(() => {
  vi.clearAllMocks();
  secureValues.clear();
  vi.stubGlobal('__DEV__', true);
  mocks.secureGet.mockImplementation(async (key: string) => secureValues.get(key) ?? null);
  mocks.secureSet.mockImplementation(async (key: string, value: string) => {
    secureValues.set(key, value);
  });
  mocks.secureDelete.mockImplementation(async (key: string) => {
    secureValues.delete(key);
  });
  mocks.getProviderToken.mockResolvedValue({ type: 'success', token: 'provider-token' });
  mocks.signOutProvider.mockResolvedValue(undefined);
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => loginResponse())
  );
});

describe('loginWithProvider', () => {
  it('exchanges only the provider token and stores the Comma session', async () => {
    await expect(loginWithProvider('GOOGLE')).resolves.toEqual({
      success: true,
      message: 'success',
      data: { onboardingCompleted: false, nickname: null }
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.example.com/api/auth/login/sdk/GOOGLE',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ token: 'provider-token' })
      })
    );
    await expect(readAuthTokens()).resolves.toEqual({
      accessToken: 'comma-access-token',
      refreshToken: 'comma-refresh-token'
    });
    expect(secureValues.get('comma.authProvider')).toBe('GOOGLE');
    expect(mocks.signOutProvider).not.toHaveBeenCalled();
  });

  it('does not call the backend when the provider login is cancelled', async () => {
    mocks.getProviderToken.mockResolvedValue({ type: 'cancelled' });

    await expect(loginWithProvider('APPLE')).resolves.toEqual({
      success: false,
      cancelled: true
    });
    expect(fetch).not.toHaveBeenCalled();
    expect(mocks.signOutProvider).not.toHaveBeenCalled();
  });

  it('rolls back the provider session when the backend rejects the token', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ success: false, message: 'invalid token' }), { status: 401 })
    );

    await expect(loginWithProvider('KAKAO')).resolves.toEqual({
      success: false,
      message: 'invalid token'
    });
    expect(mocks.signOutProvider).toHaveBeenCalledWith('KAKAO');
    await expect(readAuthTokens()).resolves.toBeNull();
  });

  it('shares an in-flight login instead of starting another SDK request', async () => {
    let resolveCredential: ((value: { type: 'success'; token: string }) => void) | undefined;
    mocks.getProviderToken.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveCredential = resolve;
        })
    );

    const first = loginWithProvider('GOOGLE');
    const second = loginWithProvider('GOOGLE');
    resolveCredential?.({ type: 'success', token: 'provider-token' });

    await Promise.all([first, second]);
    expect(mocks.getProviderToken).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledOnce();
  });
});

describe('clearAuthTokens', () => {
  it('clears local auth even when provider logout fails', async () => {
    secureValues.set('comma.accessToken', 'access');
    secureValues.set('comma.refreshToken', 'refresh');
    secureValues.set('comma.authProvider', 'GOOGLE');
    mocks.signOutProvider.mockRejectedValue(new Error('provider unavailable'));

    await clearAuthTokens();

    expect(mocks.signOutProvider).toHaveBeenCalledWith('GOOGLE');
    expect(secureValues.size).toBe(0);
  });
});
