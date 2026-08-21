import { describe, expect, it } from 'vitest';
import { isAnalyticsPageAllowed, PRODUCTION_ANALYTICS_HOSTNAME } from './config';

describe('isAnalyticsPageAllowed', () => {
  it('allows the production deployment host', () => {
    expect(
      isAnalyticsPageAllowed({
        hostname: PRODUCTION_ANALYTICS_HOSTNAME,
        isProduction: true,
        pathname: '/feed',
        search: ''
      })
    ).toBe(true);
  });

  it.each([
    '/oauth/apple/callback',
    '/oauth/google/callback',
    '/oauth/kakao/callback',
    '/oauth/google/callback/'
  ])('blocks OAuth callback path %s', (pathname) => {
    expect(
      isAnalyticsPageAllowed({
        hostname: PRODUCTION_ANALYTICS_HOSTNAME,
        isProduction: true,
        pathname,
        search: '?code=secret&state=secret'
      })
    ).toBe(false);
  });

  it('allows an OAuth callback after its query has been removed', () => {
    expect(
      isAnalyticsPageAllowed({
        hostname: PRODUCTION_ANALYTICS_HOSTNAME,
        isProduction: true,
        pathname: '/oauth/google/callback',
        search: ''
      })
    ).toBe(true);
  });

  it('blocks Vercel preview deployments', () => {
    expect(
      isAnalyticsPageAllowed({
        hostname: 'comma-front-web-git-feature.example.vercel.app',
        isProduction: true,
        pathname: '/feed',
        search: ''
      })
    ).toBe(false);
  });

  it('blocks development builds', () => {
    expect(
      isAnalyticsPageAllowed({
        hostname: PRODUCTION_ANALYTICS_HOSTNAME,
        isProduction: false,
        pathname: '/feed',
        search: ''
      })
    ).toBe(false);
  });
});
