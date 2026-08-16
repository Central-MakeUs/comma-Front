import type { AuthProvider } from '@comma/bridge';
import { GoogleSignin, isCancelledResponse } from '@react-native-google-signin/google-signin';
import {
  login as loginWithKakao,
  logout as logoutFromKakao
} from '@react-native-seoul/kakao-login';
import * as AppleAuthentication from 'expo-apple-authentication';

export type ProviderTokenResult = { type: 'success'; token: string } | { type: 'cancelled' };

let isGoogleConfigured = false;

const getGoogleWebClientId = () =>
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID?.trim() ||
  process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID?.trim();

const getGoogleIosClientId = () => process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();

const configureGoogle = () => {
  if (isGoogleConfigured) return;

  const webClientId = getGoogleWebClientId();
  if (!webClientId) throw new Error('Google native login client ID is missing.');

  GoogleSignin.configure({
    webClientId,
    iosClientId: getGoogleIosClientId()
  });
  isGoogleConfigured = true;
};

const isCancelledError = (error: unknown) => {
  if (typeof error !== 'object' || error === null) return false;

  const candidate = error as { code?: unknown; message?: unknown };
  return (
    candidate.code === 'ERR_REQUEST_CANCELED' ||
    (typeof candidate.message === 'string' && /cancel/i.test(candidate.message))
  );
};

async function getKakaoToken(): Promise<ProviderTokenResult> {
  try {
    const result = await loginWithKakao();
    if (!result.accessToken) throw new Error('Kakao login did not return an access token.');
    return { type: 'success', token: result.accessToken };
  } catch (error) {
    if (isCancelledError(error)) return { type: 'cancelled' };
    throw error;
  }
}

async function getGoogleToken(): Promise<ProviderTokenResult> {
  configureGoogle();
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const response = await GoogleSignin.signIn();
  if (isCancelledResponse(response)) return { type: 'cancelled' };
  if (!response.data.idToken) throw new Error('Google login did not return an ID token.');

  return { type: 'success', token: response.data.idToken };
}

async function getAppleToken(): Promise<ProviderTokenResult> {
  if (!(await AppleAuthentication.isAvailableAsync())) {
    throw new Error('Apple login is not available on this device.');
  }

  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL
      ]
    });
    if (!credential.identityToken) throw new Error('Apple login did not return an identity token.');
    return { type: 'success', token: credential.identityToken };
  } catch (error) {
    if (isCancelledError(error)) return { type: 'cancelled' };
    throw error;
  }
}

export const getProviderToken = (provider: AuthProvider) => {
  if (provider === 'KAKAO') return getKakaoToken();
  if (provider === 'GOOGLE') return getGoogleToken();
  if (provider === 'APPLE') return getAppleToken();
  throw new Error('Unsupported native login provider.');
};

export async function signOutProvider(provider: AuthProvider) {
  if (provider === 'KAKAO') {
    await logoutFromKakao();
    return;
  }
  if (provider === 'GOOGLE') {
    configureGoogle();
    await GoogleSignin.signOut();
    return;
  }
  if (provider !== 'APPLE') throw new Error('Unsupported native login provider.');
}

export const resetGoogleConfigurationForTests = () => {
  isGoogleConfigured = false;
};
