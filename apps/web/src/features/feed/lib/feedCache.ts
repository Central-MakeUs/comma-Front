import type { InfiniteData } from '@tanstack/react-query';
import type { FeedInfo, FeedPage } from '../model/feed.types';

type FeedData = InfiniteData<FeedPage, number | undefined> | undefined;
type FeedItemsUpdater = (items: FeedInfo[]) => FeedInfo[];

const updateFeedItems = (data: FeedData, updater: FeedItemsUpdater): FeedData =>
  data
    ? {
        ...data,
        pages: data.pages.map((page) => {
          const items = updater(page.items);
          return items === page.items ? page : { ...page, items };
        })
      }
    : data;

const updateFeedById = (data: FeedData, feedId: number, updater: (feed: FeedInfo) => FeedInfo) =>
  updateFeedItems(data, (items) => {
    const targetIndex = items.findIndex((feed) => feed.feedId === feedId);
    if (targetIndex < 0) return items;

    return items.map((feed, index) => (index === targetIndex ? updater(feed) : feed));
  });

export const toggleFeedLike = (data: FeedData, feedId: number) =>
  updateFeedById(data, feedId, (feed) => ({
    ...feed,
    isLiked: !feed.isLiked,
    likeCount: Math.max(0, feed.likeCount + (feed.isLiked ? -1 : 1))
  }));

export const setFeedLike = (
  data: FeedData,
  feedId: number,
  like: Pick<FeedInfo, 'isLiked' | 'likeCount'>
) => updateFeedById(data, feedId, (feed) => ({ ...feed, ...like }));

export const removeFeed = (data: FeedData, feedId: number) =>
  updateFeedItems(data, (items) => {
    if (!items.some((feed) => feed.feedId === feedId)) return items;
    return items.filter((feed) => feed.feedId !== feedId);
  });
