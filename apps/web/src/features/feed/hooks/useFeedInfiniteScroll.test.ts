import { describe, expect, it } from 'vitest';
import { isFeedHeaderVisible, shouldFetchNextFeedPage } from './useFeedInfiniteScroll';

describe('feed scroll decisions', () => {
  it.each([
    [0, true],
    [4, true],
    [5, false]
  ])('sets header visibility at scrollTop %s', (scrollTop, expected) => {
    expect(isFeedHeaderVisible(scrollTop)).toBe(expected);
  });

  it('fetches near the bottom when another page is available', () => {
    expect(
      shouldFetchNextFeedPage(
        { scrollHeight: 1_000, scrollTop: 650, clientHeight: 200 },
        { hasNextPage: true, isFetchingNextPage: false }
      )
    ).toBe(true);
  });

  it.each([
    [{ scrollHeight: 1_000, scrollTop: 500, clientHeight: 200 }, true, false],
    [{ scrollHeight: 1_000, scrollTop: 650, clientHeight: 200 }, false, false],
    [{ scrollHeight: 1_000, scrollTop: 650, clientHeight: 200 }, true, true]
  ])('does not fetch when distance or query state blocks it', (metrics, hasNextPage, isFetching) => {
    expect(
      shouldFetchNextFeedPage(metrics, {
        hasNextPage,
        isFetchingNextPage: isFetching
      })
    ).toBe(false);
  });
});
