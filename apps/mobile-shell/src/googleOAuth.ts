export const GOOGLE_OAUTH_PENDING_STATE_KEY = 'google-oauth-pending-state';

export interface GoogleLoginResultMessage {
  type: 'GOOGLE_LOGIN_SUCCESS' | 'GOOGLE_LOGIN_FAILED';
  code?: string;
  error?: string;
  redirectUri?: string;
  state: string;
}

export const getGoogleRedirectUri = () => process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI?.trim();

export const createGoogleAuthUrl = (state: string) => {
  const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  const redirectUri = getGoogleRedirectUri();

  if (!clientId || !redirectUri) throw new Error('Google login env is missing.');

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    state,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ].join(' ')
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const getGoogleLoginResult = (url: string) => {
  const redirectUri = getGoogleRedirectUri();
  if (!redirectUri) return null;

  try {
    const parsedUrl = new URL(url);
    const parsedRedirectUri = new URL(redirectUri);
    if (
      parsedUrl.origin !== parsedRedirectUri.origin ||
      parsedUrl.pathname !== parsedRedirectUri.pathname
    ) {
      return null;
    }

    const code = parsedUrl.searchParams.get('code');
    const state = parsedUrl.searchParams.get('state');
    return code && state ? { code, state } : null;
  } catch {
    return null;
  }
};

export const isValidOAuthState = (state: unknown): state is string =>
  typeof state === 'string' && state.length >= 16 && state.length <= 256;
