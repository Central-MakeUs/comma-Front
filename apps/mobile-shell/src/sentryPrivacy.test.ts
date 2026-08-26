import { describe, expect, it } from 'vitest';
import { sanitizeSentryBreadcrumb } from './sentryPrivacy';

describe('sanitizeSentryBreadcrumb', () => {
  it('sanitizes navigation URLs', () => {
    expect(
      sanitizeSentryBreadcrumb({
        data: {
          from: 'comma://oauth?code=private&state=secret',
          to: 'comma://feed?filter=mood#cards'
        }
      })
    ).toEqual({ data: { from: 'comma://oauth', to: 'comma://feed' } });
  });

  it('drops console breadcrumbs', () => {
    expect(
      sanitizeSentryBreadcrumb({
        category: 'console',
        data: { arguments: ['comma://oauth?access_token=private'] },
        message: 'Blocked URL comma://oauth?access_token=private'
      })
    ).toBeNull();
  });
});
