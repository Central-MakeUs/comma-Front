import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createGoogleAuthUrl, getGoogleLoginResult, isValidOAuthState } from './googleOAuth';

const redirectUri = 'https://comma.example.com/oauth/google/callback';

beforeEach(() => {
  vi.stubEnv('EXPO_PUBLIC_GOOGLE_CLIENT_ID', 'google-client-id');
  vi.stubEnv('EXPO_PUBLIC_GOOGLE_REDIRECT_URI', redirectUri);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('createGoogleAuthUrl', () => {
  it('builds an authorization-code URL with the provided state', () => {
    const state = '0123456789abcdef';
    const authUrl = new URL(createGoogleAuthUrl(state));

    expect(authUrl.origin).toBe('https://accounts.google.com');
    expect(authUrl.pathname).toBe('/o/oauth2/v2/auth');
    expect(authUrl.searchParams.get('client_id')).toBe('google-client-id');
    expect(authUrl.searchParams.get('redirect_uri')).toBe(redirectUri);
    expect(authUrl.searchParams.get('response_type')).toBe('code');
    expect(authUrl.searchParams.get('state')).toBe(state);
    expect(authUrl.searchParams.get('scope')).toContain('userinfo.email');
    expect(authUrl.searchParams.get('scope')).toContain('userinfo.profile');
  });

  it('fails fast when required environment variables are missing', () => {
    vi.stubEnv('EXPO_PUBLIC_GOOGLE_CLIENT_ID', '');

    expect(() => createGoogleAuthUrl('0123456789abcdef')).toThrow('Google login env is missing.');
  });
});

describe('getGoogleLoginResult', () => {
  it('extracts code and state only from the configured callback', () => {
    const result = getGoogleLoginResult(`${redirectUri}?code=auth-code&state=0123456789abcdef`);

    expect(result).toEqual({ code: 'auth-code', state: '0123456789abcdef' });
  });

  it.each([
    'https://attacker.example.com/oauth/google/callback?code=x&state=0123456789abcdef',
    'https://comma.example.com/oauth/other/callback?code=x&state=0123456789abcdef',
    `${redirectUri}?code=x`,
    'not-a-url'
  ])('rejects an invalid callback URL: %s', (url) => {
    expect(getGoogleLoginResult(url)).toBeNull();
  });
});

describe('isValidOAuthState', () => {
  it.each(['0123456789abcdef', 'x'.repeat(256)])('accepts a valid state length', (state) => {
    expect(isValidOAuthState(state)).toBe(true);
  });

  it.each([
    'short',
    'x'.repeat(257),
    undefined,
    null,
    123
  ])('rejects an invalid state: %s', (state) => {
    expect(isValidOAuthState(state)).toBe(false);
  });
});
