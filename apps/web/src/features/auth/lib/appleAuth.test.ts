import { describe, expect, it } from 'vitest';
import { isAppleLoginCancelled } from './appleAuth';

describe('Apple web login errors', () => {
  it('identifies the Apple user cancellation response', () => {
    expect(isAppleLoginCancelled({ error: 'user_cancelled_authorize' })).toBe(true);
  });

  it('does not hide other Apple or runtime errors', () => {
    expect(isAppleLoginCancelled({ error: 'invalid_request' })).toBe(false);
    expect(isAppleLoginCancelled(new Error('Network unavailable.'))).toBe(false);
    expect(isAppleLoginCancelled(null)).toBe(false);
  });
});
