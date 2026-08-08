import { QueryClient } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FeedPage } from '../model/feed.types';
import { getFeeds, getMyFeeds } from './feed.api';
import {
  feedInfiniteQueryOptions,
  feedQueryKeys,
  latestMyFeedQueryOptions,
  myFeedsInfiniteQueryOptions
} from './feed.queries';

vi.mock('./feed.api', () => ({
  getFeeds: vi.fn(),
  getMyFeeds: vi.fn()
}));

const page = (hasNext: boolean, nextCursor: number): FeedPage => ({
  items: [],
  hasNext,
  nextCursor
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('feed query keys', () => {
  it('keeps filters and personal feeds in separate cache entries', () => {
    expect(feedQueryKeys.filtered('A', 'X')).toEqual(['feeds', { mood: 'A', timeBudget: 'X' }]);
    expect(feedQueryKeys.mine()).toEqual(['feeds', 'me']);
    expect(feedQueryKeys.latestMine()).toEqual(['feeds', 'me', 'latest']);
  });
});

describe('feedInfiniteQueryOptions', () => {
  it('forwards the next cursor and active filters to the API', async () => {
    vi.mocked(getFeeds).mockResolvedValue(page(false, 0));
    const options = feedInfiniteQueryOptions({ mood: 'B', timeBudget: 'Y', size: 10 });
    const queryFn = options.queryFn;
    if (!queryFn) throw new Error('Feed query function is missing.');

    await queryFn({
      client: new QueryClient(),
      queryKey: options.queryKey,
      pageParam: 42,
      signal: new AbortController().signal,
      direction: 'forward',
      meta: undefined
    });

    expect(getFeeds).toHaveBeenCalledWith({
      mood: 'B',
      timeBudget: 'Y',
      cursor: 42,
      size: 10
    });
  });

  it('returns a cursor only while the server has another page', () => {
    const options = feedInfiniteQueryOptions({});

    expect(options.getNextPageParam?.(page(true, 15), [], undefined, [])).toBe(15);
    expect(options.getNextPageParam?.(page(false, 15), [], undefined, [])).toBeUndefined();
  });
});

describe('personal feed query options', () => {
  it('uses the requested page size for archive pagination', async () => {
    vi.mocked(getMyFeeds).mockResolvedValue(page(false, 0));
    const options = myFeedsInfiniteQueryOptions(12);
    const queryFn = options.queryFn;
    if (!queryFn) throw new Error('My feeds query function is missing.');

    await queryFn({
      client: new QueryClient(),
      queryKey: options.queryKey,
      pageParam: 7,
      signal: new AbortController().signal,
      direction: 'forward',
      meta: undefined
    });

    expect(getMyFeeds).toHaveBeenCalledWith({ cursor: 7, size: 12 });
  });

  it('loads only one item for the latest personal feed', async () => {
    vi.mocked(getMyFeeds).mockResolvedValue({
      items: [
        {
          feedId: 1,
          mood: 'A',
          timeBudget: 'X',
          imageUrl: '/image.png',
          hashtags: [],
          review: 'review',
          isPublic: true,
          createdAt: '2026-01-01T00:00:00Z',
          isLiked: false,
          likeCount: 0
        }
      ],
      hasNext: false,
      nextCursor: 0
    });

    await expect(
      latestMyFeedQueryOptions.queryFn?.({
        client: new QueryClient(),
        queryKey: latestMyFeedQueryOptions.queryKey,
        signal: new AbortController().signal,
        meta: undefined
      })
    ).resolves.toMatchObject({ feedId: 1 });
    expect(getMyFeeds).toHaveBeenCalledWith({ size: 1 });
  });
});
