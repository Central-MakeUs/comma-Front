import { type UIEventHandler, useCallback } from 'react';

const FEED_HEADER_VISIBILITY_OFFSET = 4;
const FEED_LOAD_THRESHOLD = 160;

interface ScrollMetrics {
  scrollHeight: number;
  scrollTop: number;
  clientHeight: number;
}

interface FeedPaginationState {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export const isFeedHeaderVisible = (scrollTop: number) =>
  scrollTop <= FEED_HEADER_VISIBILITY_OFFSET;

export const shouldFetchNextFeedPage = (
  { scrollHeight, scrollTop, clientHeight }: ScrollMetrics,
  { hasNextPage, isFetchingNextPage }: FeedPaginationState
) =>
  scrollHeight - scrollTop - clientHeight <= FEED_LOAD_THRESHOLD &&
  hasNextPage &&
  !isFetchingNextPage;

interface UseFeedInfiniteScrollOptions extends FeedPaginationState {
  fetchNextPage: (options: { cancelRefetch: boolean }) => Promise<unknown>;
  onHeaderVisibilityChange: (isVisible: boolean) => void;
}

export function useFeedInfiniteScroll({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  onHeaderVisibilityChange
}: UseFeedInfiniteScrollOptions): UIEventHandler<HTMLDivElement> {
  return useCallback(
    (event) => {
      const scrollElement = event.currentTarget;
      onHeaderVisibilityChange(isFeedHeaderVisible(scrollElement.scrollTop));

      if (
        shouldFetchNextFeedPage(scrollElement, {
          hasNextPage,
          isFetchingNextPage
        })
      ) {
        void fetchNextPage({ cancelRefetch: false });
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, onHeaderVisibilityChange]
  );
}
