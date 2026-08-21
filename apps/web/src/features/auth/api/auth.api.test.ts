import { beforeEach, describe, expect, it, vi } from 'vitest';
import { login, loginWithNativeProvider, NativeLoginUnavailableError } from './auth.api';

const mocks = vi.hoisted(() => ({
  publicPost: vi.fn(),
  apiPost: vi.fn(),
  setTokens: vi.fn(),
  setOnboardingCompleted: vi.fn(),
  setStoredNickname: vi.fn(),
  resetSessionExpiredState: vi.fn(),
  loginWithProvider: vi.fn()
}));

vi.mock('../../../shared/api/client', () => ({
  apiClient: { post: mocks.apiPost },
  publicApiClient: { post: mocks.publicPost },
  refreshStoredTokens: vi.fn(),
  resetSessionExpiredState: mocks.resetSessionExpiredState
}));

vi.mock('../../../shared/lib/tokenStorage', () => ({
  setTokens: mocks.setTokens,
  setOnboardingCompleted: mocks.setOnboardingCompleted,
  setStoredNickname: mocks.setStoredNickname
}));

vi.mock('../../../shared/bridge/bridge', () => ({
  appBridge: { loginWithProvider: mocks.loginWithProvider }
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('OAuth login', () => {
  it('exchanges a web OAuth code and delegates token persistence', async () => {
    mocks.publicPost.mockResolvedValue({
      data: {
        success: true,
        message: 'ok',
        data: {
          accessToken: 'access',
          refreshToken: 'refresh',
          onboardingCompleted: true,
          nickname: 'comma'
        }
      }
    });

    await expect(
      login({
        field: 'APPLE',
        code: 'authorization-code',
        redirectUri: 'https://comma-front-web.vercel.app/oauth/apple/callback'
      })
    ).resolves.toMatchObject({ success: true, data: { onboardingCompleted: true } });

    expect(mocks.setTokens).toHaveBeenCalledWith({
      accessToken: 'access',
      refreshToken: 'refresh'
    });
  });
});

describe('native login compatibility', () => {
  it('classifies a missing legacy bridge as unavailable', async () => {
    mocks.loginWithProvider.mockResolvedValue(undefined);

    await expect(loginWithNativeProvider('APPLE')).rejects.toBeInstanceOf(
      NativeLoginUnavailableError
    );
  });

  it('keeps provider failures distinct from bridge availability', async () => {
    mocks.loginWithProvider.mockResolvedValue({
      success: false,
      message: 'provider failed'
    });

    await expect(loginWithNativeProvider('APPLE')).resolves.toEqual({
      success: false,
      message: 'provider failed'
    });
  });
});
