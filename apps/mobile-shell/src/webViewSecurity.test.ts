import { describe, expect, it } from 'vitest';
import {
  isAllowedWebViewUrl,
  isAppWebViewUrl,
  isExternalBrowserUrl,
  isTrustedWebViewMessageUrl
} from './webViewSecurity';

const webOrigin = 'https://comma.example.com';

describe('WebView navigation security', () => {
  it.each([
    ['about:blank', true],
    [`${webOrigin}/feed`, true],
    [`${webOrigin}/oauth/google/callback?code=x`, true],
    ['https://kauth.kakao.com/oauth/authorize', true],
    ['https://accounts.google.com/o/oauth2/v2/auth', true],
    ['https://appleid.apple.com/auth/authorize', true],
    ['https://attacker.example.com/feed', false],
    ['not-a-url', false]
  ])('checks whether %s may load inside the WebView', (url, expected) => {
    expect(isAllowedWebViewUrl(url, webOrigin)).toBe(expected);
  });

  it('classifies only the app web origin as an app page', () => {
    expect(isAppWebViewUrl(`${webOrigin}/feed`, webOrigin)).toBe(true);
    expect(isAppWebViewUrl('https://kauth.kakao.com/oauth/authorize', webOrigin)).toBe(false);
    expect(isAppWebViewUrl('https://accounts.google.com/o/oauth2/v2/auth', webOrigin)).toBe(false);
    expect(isAppWebViewUrl('https://appleid.apple.com/auth/authorize', webOrigin)).toBe(false);
  });

  it('trusts messages only when their origin exactly matches the web origin', () => {
    expect(isTrustedWebViewMessageUrl(`${webOrigin}/feed`, webOrigin)).toBe(true);
    expect(isTrustedWebViewMessageUrl('https://comma.example.com.attacker.dev', webOrigin)).toBe(
      false
    );
  });

  it.each([
    ['https://example.com', true],
    ['http://example.com', true],
    ['javascript:alert(1)', false],
    ['comma://feed', false],
    ['invalid', false]
  ])('classifies external browser URL %s', (url, expected) => {
    expect(isExternalBrowserUrl(url)).toBe(expected);
  });
});
