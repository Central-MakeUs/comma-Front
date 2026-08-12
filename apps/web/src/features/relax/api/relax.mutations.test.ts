import { beforeEach, describe, expect, it, vi } from 'vitest';
import { storeActivityId } from '../lib/activityStorage';
import { getRelaxActiveCount, startRelax } from './relax.api';
import { startRelaxActivity } from './relax.mutations';

vi.mock('./relax.api', () => ({
  getRelaxActiveCount: vi.fn(),
  startRelax: vi.fn()
}));

vi.mock('../lib/activityStorage', () => ({
  storeActivityId: vi.fn()
}));

const activity = {
  id: 1,
  name: '산책',
  description: '걷기',
  activeMessage: '걷는 중',
  imageUrl: null,
  activeUserCount: 2
};

beforeEach(() => vi.clearAllMocks());

describe('startRelaxActivity', () => {
  it('starts the activity and refreshes its active count', async () => {
    vi.mocked(startRelax).mockResolvedValue({
      success: true,
      data: { activityId: 42 }
    });
    vi.mocked(getRelaxActiveCount).mockResolvedValue({
      success: true,
      data: { count: 9 }
    });

    await expect(startRelaxActivity(activity)).resolves.toEqual({
      ...activity,
      activityId: 42,
      activeUserCount: 9
    });
    expect(storeActivityId).toHaveBeenCalledWith(42);
  });

  it('throws when starting the activity fails', async () => {
    vi.mocked(startRelax).mockResolvedValue({ success: false, message: '시작 실패' });

    await expect(startRelaxActivity(activity)).rejects.toThrow('시작 실패');
    expect(storeActivityId).not.toHaveBeenCalled();
    expect(getRelaxActiveCount).not.toHaveBeenCalled();
  });

  it('throws when the start response omits the activity id', async () => {
    vi.mocked(startRelax).mockResolvedValue({ success: true });

    await expect(startRelaxActivity(activity)).rejects.toThrow('휴식을 시작하지 못했어요.');
    expect(storeActivityId).not.toHaveBeenCalled();
    expect(getRelaxActiveCount).not.toHaveBeenCalled();
  });
});
