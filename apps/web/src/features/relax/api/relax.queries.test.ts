import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { onlineCount } from './relax.api';
import { onlineCountQueryOptions, relaxQueryKeys } from './relax.queries';

vi.mock('./relax.api', () => ({
  onlineCount: vi.fn()
}));

describe('onlineCountQueryOptions', () => {
  it('loads the online count under the relax cache key', async () => {
    vi.mocked(onlineCount).mockResolvedValue(27);
    const queryFn = onlineCountQueryOptions.queryFn;
    if (!queryFn) throw new Error('Online count query function is missing.');

    await expect(
      queryFn({
        client: new QueryClient(),
        queryKey: onlineCountQueryOptions.queryKey,
        signal: new AbortController().signal,
        meta: undefined
      })
    ).resolves.toBe(27);
    expect(onlineCountQueryOptions.queryKey).toEqual(relaxQueryKeys.onlineCount());
  });
});
