import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { getPlan, getRandomNickname, getRestStatus } from './user.api';
import {
  randomNicknameQueryOptions,
  userPlanQueryOptions,
  userQueryKeys,
  userRestStatusQueryOptions
} from './user.queries';

vi.mock('./user.api', () => ({
  getPlan: vi.fn(),
  getRandomNickname: vi.fn(),
  getRestStatus: vi.fn()
}));

describe('user query options', () => {
  it('separates plan, rest status, and random nickname cache entries', () => {
    expect(userPlanQueryOptions.queryKey).toEqual(userQueryKeys.plan());
    expect(userRestStatusQueryOptions.queryKey).toEqual(userQueryKeys.restStatus());
    expect(randomNicknameQueryOptions.queryKey).toEqual(userQueryKeys.randomNickname());
  });

  it('connects each query option to its API function', async () => {
    vi.mocked(getPlan).mockResolvedValue({ currentPlan: 'FREE', plans: [] });
    vi.mocked(getRandomNickname).mockResolvedValue({ nickname: '쉼표' });
    vi.mocked(getRestStatus).mockResolvedValue({ restedToday: false, lastRestedAt: null });
    const planQueryFn = userPlanQueryOptions.queryFn;
    const nicknameQueryFn = randomNicknameQueryOptions.queryFn;
    const restStatusQueryFn = userRestStatusQueryOptions.queryFn;
    if (!planQueryFn || !nicknameQueryFn || !restStatusQueryFn) {
      throw new Error('User query function is missing.');
    }

    await planQueryFn({
      client: new QueryClient(),
      queryKey: userPlanQueryOptions.queryKey,
      signal: new AbortController().signal,
      meta: undefined
    });
    await nicknameQueryFn({
      client: new QueryClient(),
      queryKey: randomNicknameQueryOptions.queryKey,
      signal: new AbortController().signal,
      meta: undefined
    });
    await restStatusQueryFn({
      client: new QueryClient(),
      queryKey: userRestStatusQueryOptions.queryKey,
      signal: new AbortController().signal,
      meta: undefined
    });

    expect(getPlan).toHaveBeenCalledOnce();
    expect(getRandomNickname).toHaveBeenCalledOnce();
    expect(getRestStatus).toHaveBeenCalledOnce();
  });
});
