import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  appleAvailable: vi.fn(),
  appleSignIn: vi.fn(),
  googleConfigure: vi.fn(),
  googleHasPlayServices: vi.fn(),
  googleSignIn: vi.fn(),
  googleSignOut: vi.fn(),
  kakaoLogin: vi.fn(),
  kakaoLogout: vi.fn()
}));

vi.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: mocks.googleConfigure,
    hasPlayServices: mocks.googleHasPlayServices,
    signIn: mocks.googleSignIn,
    signOut: mocks.googleSignOut
  },
  isCancelledResponse: (response: { type: string }) => response.type === 'cancelled'
}));

vi.mock('@react-native-seoul/kakao-login', () => ({
  login: mocks.kakaoLogin,
  logout: mocks.kakaoLogout
}));

vi.mock('expo-apple-authentication', () => ({
  AppleAuthenticationScope: { FULL_NAME: 0, EMAIL: 1 },
  isAvailableAsync: mocks.appleAvailable,
  signInAsync: mocks.appleSignIn
}));

import {
  getProviderToken,
  resetGoogleConfigurationForTests,
  signOutProvider
} from './nativeSocialAuth';

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID', 'google-web-client-id');
  vi.stubEnv('EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID', 'google-ios-client-id');
  mocks.appleAvailable.mockResolvedValue(true);
  mocks.googleHasPlayServices.mockResolvedValue(true);
  resetGoogleConfigurationForTests();
});

describe('getProviderToken', () => {
  it('returns the Kakao access token', async () => {
    mocks.kakaoLogin.mockResolvedValue({ accessToken: 'kakao-access-token' });

    await expect(getProviderToken('KAKAO')).resolves.toEqual({
      type: 'success',
      token: 'kakao-access-token'
    });
  });

  it('returns the Google ID token and configures the web client ID once', async () => {
    mocks.googleSignIn.mockResolvedValue({
      type: 'success',
      data: { idToken: 'google-id-token' }
    });

    await expect(getProviderToken('GOOGLE')).resolves.toEqual({
      type: 'success',
      token: 'google-id-token'
    });
    expect(mocks.googleConfigure).toHaveBeenCalledWith({
      webClientId: 'google-web-client-id',
      iosClientId: 'google-ios-client-id'
    });
  });

  it('does not accept a Google response without an ID token', async () => {
    mocks.googleSignIn.mockResolvedValue({ type: 'success', data: { idToken: null } });

    await expect(getProviderToken('GOOGLE')).rejects.toThrow(
      'Google login did not return an ID token.'
    );
  });

  it('returns the Apple identity token', async () => {
    mocks.appleSignIn.mockResolvedValue({ identityToken: 'apple-identity-token' });

    await expect(getProviderToken('APPLE')).resolves.toEqual({
      type: 'success',
      token: 'apple-identity-token'
    });
  });

  it.each([
    ['KAKAO', () => mocks.kakaoLogin.mockRejectedValue(new Error('Cancelled'))],
    ['GOOGLE', () => mocks.googleSignIn.mockResolvedValue({ type: 'cancelled' })],
    ['APPLE', () => mocks.appleSignIn.mockRejectedValue({ code: 'ERR_REQUEST_CANCELED' })]
  ] as const)('normalizes %s cancellation', async (provider, arrange) => {
    arrange();
    await expect(getProviderToken(provider)).resolves.toEqual({ type: 'cancelled' });
  });
});

describe('signOutProvider', () => {
  it('signs out Kakao and Google sessions while Apple remains local-only', async () => {
    await signOutProvider('KAKAO');
    await signOutProvider('GOOGLE');
    await signOutProvider('APPLE');

    expect(mocks.kakaoLogout).toHaveBeenCalledOnce();
    expect(mocks.googleConfigure).toHaveBeenCalledWith({
      webClientId: 'google-web-client-id',
      iosClientId: 'google-ios-client-id'
    });
    expect(mocks.googleSignOut).toHaveBeenCalledOnce();
  });
});
