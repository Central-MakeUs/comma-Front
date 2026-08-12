const ACTIVE_ACTIVITY_ID_KEY = 'comma.activeActivityId';

const isValidActivityId = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value) && value > 0;

const getLocalStorage = () => {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export const getStoredActivityId = () => {
  const storage = getLocalStorage();
  if (!storage) return null;

  try {
    const storedValue = storage.getItem(ACTIVE_ACTIVITY_ID_KEY);
    if (storedValue === null) return null;

    const activityId = Number(storedValue);
    if (isValidActivityId(activityId)) return activityId;

    storage.removeItem(ACTIVE_ACTIVITY_ID_KEY);
    return null;
  } catch {
    return null;
  }
};

export const storeActivityId = (activityId: number) => {
  if (!isValidActivityId(activityId)) {
    throw new Error('유효하지 않은 휴식 활동 ID입니다.');
  }

  const storage = getLocalStorage();
  if (!storage) return false;

  try {
    storage.setItem(ACTIVE_ACTIVITY_ID_KEY, String(activityId));
    return true;
  } catch {
    return false;
  }
};

export const clearStoredActivityId = () => {
  const storage = getLocalStorage();
  if (!storage) return false;

  try {
    storage.removeItem(ACTIVE_ACTIVITY_ID_KEY);
    return true;
  } catch {
    return false;
  }
};
