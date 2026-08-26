import { describe, expect, it } from 'vitest';
import { sanitizeSentryBreadcrumb } from './sentryPrivacy';

describe('sanitizeSentryBreadcrumb', () => {
  it('removes query strings and fragments from navigation breadcrumb URLs', () => {
    expect(
      sanitizeSentryBreadcrumb({
        data: {
          from: '/oauth/callback?code=private&state=secret#fragment',
          to: '/feed?filter=mood#cards',
          url: 'https://example.com/path?token=private#fragment'
        }
      })
    ).toEqual({
      data: {
        from: '/oauth/callback',
        to: '/feed',
        url: 'https://example.com/path'
      }
    });
  });

  it('drops console breadcrumbs whose message or arguments can contain private data', () => {
    expect(
      sanitizeSentryBreadcrumb({
        category: 'console',
        data: { arguments: [{ review: 'private review' }], logger: 'console' },
        message: 'Blocked URL https://example.com?access_token=private'
      })
    ).toBeNull();
  });
});
