import type { InfiniteData } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';
import type { FeedInfo, FeedPage } from '../model/feed.types';
import { removeFeed, setFeedLike, toggleFeedLike } from './feedCache';

const feed = (feedId: number, isLiked = false, likeCount = 0): FeedInfo => ({
  feedId,
  mood: 'A',
  timeBudget: 'X',
  imageUrl: `/feed-${feedId}.png`,
  hashtags: [],
  review: `feed ${feedId}`,
  isPublic: true,
  createdAt: '2026-01-01T00:00:00Z',
  isLiked,
  likeCount
});

const data = (): InfiniteData<FeedPage, number | undefined> => ({
  pages: [
    { items: [feed(1, false, 3)], hasNext: true, nextCursor: 2 },
    { items: [feed(2, true, 0)], hasNext: false, nextCursor: 0 }
  ],
  pageParams: [undefined, 2]
});

describe('feed cache updates', () => {
  it('optimistically toggles only the target feed across pages', () => {
    const current = data();
    const updated = toggleFeedLike(current, 1);

    expect(updated?.pages[0].items[0]).toMatchObject({ isLiked: true, likeCount: 4 });
    expect(updated?.pages[1]).toBe(current.pages[1]);
    expect(updated?.pageParams).toBe(current.pageParams);
  });

  it('never produces a negative optimistic like count', () => {
    const updated = toggleFeedLike(data(), 2);

    expect(updated?.pages[1].items[0]).toMatchObject({ isLiked: false, likeCount: 0 });
  });

  it('applies the server-confirmed like state', () => {
    const updated = setFeedLike(data(), 1, { isLiked: true, likeCount: 9 });

    expect(updated?.pages[0].items[0]).toMatchObject({ isLiked: true, likeCount: 9 });
  });

  it('removes a blocked feed without changing pagination metadata', () => {
    const current = data();
    const updated = removeFeed(current, 2);

    expect(updated?.pages.flatMap((page) => page.items).map((item) => item.feedId)).toEqual([1]);
    expect(updated?.pageParams).toBe(current.pageParams);
  });

  it('keeps an empty cache unchanged', () => {
    expect(toggleFeedLike(undefined, 1)).toBeUndefined();
    expect(removeFeed(undefined, 1)).toBeUndefined();
  });
});
