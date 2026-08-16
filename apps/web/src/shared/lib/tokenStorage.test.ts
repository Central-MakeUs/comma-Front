import { beforeEach, describe, expect, it } from 'vitest';
import { getStoredNickname, setStoredNickname } from './tokenStorage';

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
    value: { localStorage: createStorage() }
  });
});

describe('stored nickname', () => {
  it('removes a previous nickname when the login response contains null', () => {
    setStoredNickname('comma-user');
    expect(getStoredNickname()).toBe('comma-user');

    setStoredNickname(null);
    expect(getStoredNickname()).toBeNull();
  });
});
