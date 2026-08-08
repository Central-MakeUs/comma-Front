import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { type FeedQueryRequest, getFeeds, getMyFeeds } from './feed.api';

export const feedQueryKeys = {
  all: ['feeds'] as const,
  filtered: (mood?: string, timeBudget?: string) =>
    [...feedQueryKeys.all, { mood, timeBudget }] as const,
  mine: () => [...feedQueryKeys.all, 'me'] as const,
  latestMine: () => [...feedQueryKeys.mine(), 'latest'] as const
};

export const feedInfiniteQueryOptions = ({
  mood,
  timeBudget,
  size = 5
}: Omit<FeedQueryRequest, 'cursor'>) =>
  infiniteQueryOptions({
    queryKey: feedQueryKeys.filtered(mood, timeBudget),
    queryFn: ({ pageParam }) => getFeeds({ mood, timeBudget, cursor: pageParam, size }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    retry: false
  });

export const myFeedsInfiniteQueryOptions = (size = 5) =>
  infiniteQueryOptions({
    queryKey: feedQueryKeys.mine(),
    queryFn: ({ pageParam }) => getMyFeeds({ cursor: pageParam, size }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    retry: false
  });

export const latestMyFeedQueryOptions = queryOptions({
  queryKey: feedQueryKeys.latestMine(),
  queryFn: async () => (await getMyFeeds({ size: 1 })).items[0] ?? null,
  staleTime: 1000 * 60
});
