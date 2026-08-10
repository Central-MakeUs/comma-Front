import { describe, expect, it, vi } from 'vitest';
import { isNativeBackBlockedPath, runNativeBackHandlers } from './nativeBack';

describe('runNativeBackHandlers', () => {
  it('runs the most recently registered handler first', () => {
    const first = vi.fn(() => true);
    const second = vi.fn(() => true);

    expect(runNativeBackHandlers([first, second])).toBe(true);
    expect(second).toHaveBeenCalledOnce();
    expect(first).not.toHaveBeenCalled();
  });

  it('continues until a handler consumes the event', () => {
    const first = vi.fn(() => true);
    const second = vi.fn(() => false);

    expect(runNativeBackHandlers([first, second])).toBe(true);
    expect(second).toHaveBeenCalledOnce();
    expect(first).toHaveBeenCalledOnce();
  });

  it('returns false when no handler consumes the event', () => {
    expect(runNativeBackHandlers([() => false])).toBe(false);
  });
});

describe('isNativeBackBlockedPath', () => {
  it.each([
    '/loading',
    '/oauth/kakao/callback',
    '/oauth/google/callback',
    '/oauth/apple/callback'
  ])('blocks native back navigation on %s', (pathname) => {
    expect(isNativeBackBlockedPath(pathname)).toBe(true);
  });

  it('allows root pages to fall through to native app exit', () => {
    expect(isNativeBackBlockedPath('/feed')).toBe(false);
  });
});
