import { afterEach, describe, expect, it, vi } from 'vitest';
import { clearStoredActivityId, getStoredActivityId, storeActivityId } from './activityStorage';

const createStorage = () => {
  const values = new Map<string, string>();

  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => values.set(key, value)),
    removeItem: vi.fn((key: string) => values.delete(key)),
    clear: vi.fn(() => values.clear()),
    key: vi.fn((index: number) => [...values.keys()][index] ?? null),
    get length() {
      return values.size;
    }
  } satisfies Storage;
};

const installWindow = (localStorage: Storage) => {
  vi.stubGlobal('window', { localStorage });
};

afterEach(() => vi.unstubAllGlobals());

describe('activityStorage', () => {
  it('stores and restores an activity id', () => {
    installWindow(createStorage());

    storeActivityId(123);

    expect(getStoredActivityId()).toBe(123);
  });

  it('clears a completed activity id', () => {
    installWindow(createStorage());
    storeActivityId(123);

    clearStoredActivityId();

    expect(getStoredActivityId()).toBeNull();
  });

  it.each([0, -1, 1.5, Number.NaN])('rejects an invalid activity id: %s', (activityId) => {
    installWindow(createStorage());

    expect(() => storeActivityId(activityId)).toThrow('유효하지 않은 휴식 활동 ID입니다.');
  });

  it('removes an invalid stored value', () => {
    const localStorage = createStorage();
    installWindow(localStorage);
    localStorage.setItem('comma.activeActivityId', 'invalid');

    expect(getStoredActivityId()).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith('comma.activeActivityId');
  });
});
