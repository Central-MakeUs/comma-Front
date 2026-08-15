import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { consumeWebOAuthState, createWebOAuthState } from './oauthState';

const TEN_MINUTES_MS = 10 * 60 * 1000;

const createStorage = (): Storage => {
  const values = new Map<string, string>();

  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => Array.from(values.keys())[index] ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value)
  };
};

beforeEach(() => {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      crypto: globalThis.crypto,
      localStorage: createStorage(),
      sessionStorage: createStorage()
    }
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('web OAuth state', () => {
  it('creates a cryptographically random state and consumes it only once', () => {
    const state = createWebOAuthState('KAKAO');

    expect(state).toMatch(/^[a-f0-9]{64}$/);
    expect(consumeWebOAuthState('KAKAO', state)).toBe(true);
    expect(consumeWebOAuthState('KAKAO', state)).toBe(false);
  });

  it('rejects a mismatched state and clears the pending request', () => {
    const state = createWebOAuthState('GOOGLE');

    expect(consumeWebOAuthState('GOOGLE', `${state}-tampered`)).toBe(false);
    expect(consumeWebOAuthState('GOOGLE', state)).toBe(false);
  });

  it('rejects an expired state', () => {
    const now = 1_800_000_000_000;
    vi.spyOn(Date, 'now').mockReturnValue(now);
    const state = createWebOAuthState('APPLE');

    vi.spyOn(Date, 'now').mockReturnValue(now + TEN_MINUTES_MS + 1);

    expect(consumeWebOAuthState('APPLE', state)).toBe(false);
  });
});
