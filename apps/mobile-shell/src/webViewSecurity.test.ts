import { describe, expect, it } from 'vitest';
import {
  isAllowedWebViewUrl,
  isAppleAuthUrl,
  isExternalBrowserUrl,
  isTrustedWebViewMessageUrl,
  isWebOAuthCallbackUrl
} from './webViewSecurity';

const webOrigin = 'https://comma.example.com';

describe('WebView navigation security', () => {
  it.each([
    ['about:blank', true],
    [`${webOrigin}/feed`, true],
    [`${webOrigin}/oauth/google/callback?code=x`, true],
    ['https://attacker.example.com/feed', false],
    ['not-a-url', false]
  ])('checks whether %s may load inside the WebView', (url, expected) => {
    expect(isAllowedWebViewUrl(url, webOrigin)).toBe(expected);
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

describe('OAuth URL security', () => {
  it('recognizes only the official Apple authorization origin', () => {
    expect(isAppleAuthUrl('https://appleid.apple.com/auth/authorize')).toBe(true);
    expect(isAppleAuthUrl('https://appleid.apple.com.attacker.dev/auth/authorize')).toBe(false);
  });

  it.each([
    [`${webOrigin}/oauth/google/callback`, true],
    [`${webOrigin}/oauth/kakao/callback?code=x`, true],
    [`${webOrigin}/oauth/apple/callback`, false],
    ['https://attacker.example.com/oauth/google/callback', false]
  ])('checks whether %s is a supported web OAuth callback', (url, expected) => {
    expect(isWebOAuthCallbackUrl(url, webOrigin)).toBe(expected);
  });
});
