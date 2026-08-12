import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { getPlan, getRandomNickname } from './user.api';
import { randomNicknameQueryOptions, userPlanQueryOptions, userQueryKeys } from './user.queries';

vi.mock('./user.api', () => ({
  getPlan: vi.fn(),
  getRandomNickname: vi.fn()
}));

describe('user query options', () => {
  it('separates plan and random nickname cache entries', () => {
    expect(userPlanQueryOptions.queryKey).toEqual(userQueryKeys.plan());
    expect(randomNicknameQueryOptions.queryKey).toEqual(userQueryKeys.randomNickname());
  });

  it('connects each query option to its API function', async () => {
    vi.mocked(getPlan).mockResolvedValue({ currentPlan: 'FREE', plans: [] });
    vi.mocked(getRandomNickname).mockResolvedValue({ nickname: '쉼표' });
    const planQueryFn = userPlanQueryOptions.queryFn;
    const nicknameQueryFn = randomNicknameQueryOptions.queryFn;
    if (!planQueryFn || !nicknameQueryFn) throw new Error('User query function is missing.');

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

    expect(getPlan).toHaveBeenCalledOnce();
    expect(getRandomNickname).toHaveBeenCalledOnce();
  });
});
