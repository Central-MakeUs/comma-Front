import type { ToastVariant } from '@comma/design-system';
import {
  type InfiniteData,
  type QueryKey,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { trackEvent } from '../../../shared/analytics/events';
import { getStoredNickname } from '../../../shared/lib/tokenStorage';
import { blockFeed, postLikes, reportFeed } from '../api/feed.api';
import { removeFeed, setFeedLike, toggleFeedLike } from '../lib/feedCache';
import type { FeedInfo, FeedPage } from '../model/feed.types';

interface UseFeedActionsOptions {
  currentNickname: string | null;
  feeds: FeedInfo[];
  mood?: string;
  queryKey: QueryKey;
  timeBudget?: string;
}

export function useFeedActions({
  currentNickname,
  feeds,
  mood,
  queryKey,
  timeBudget
}: UseFeedActionsOptions) {
  const queryClient = useQueryClient();
  const pendingLikeKeysRef = useRef(new Set<string>());
  const [toastVariant, setToastVariant] = useState<ToastVariant | null>(null);
  const likeMutation = useMutation({
    mutationFn: async (feedId: number) => {
      const response = await postLikes({ feedId });
      if (!response.success) throw new Error(response.message ?? '좋아요를 반영하지 못했습니다.');
      return response.data;
    }
  });
  const reportMutation = useMutation({
    mutationFn: async (feedId: number) => {
      const response = await reportFeed({ feedId });
      if (!response.success) throw new Error(response.message ?? '신고하지 못했습니다.');
      return response.data;
    }
  });
  const blockMutation = useMutation({
    mutationFn: async (feedId: number) => {
      const response = await blockFeed({ feedId });
      if (!response.success) throw new Error(response.message ?? '차단하지 못했습니다.');
      return response.data;
    }
  });

  const updateCache = useCallback(
    (
      updater: (
        data: InfiniteData<FeedPage, number | undefined> | undefined
      ) => InfiniteData<FeedPage, number | undefined> | undefined
    ) => {
      queryClient.setQueryData<InfiniteData<FeedPage, number | undefined>>(queryKey, updater);
    },
    [queryClient, queryKey]
  );

  const onHeartClick = useCallback(
    async (feedId: number, userNickname: string) => {
      const likeRequestKey = `${mood}:${timeBudget}:${feedId}`;
      if (pendingLikeKeysRef.current.has(likeRequestKey)) return;
      if (getStoredNickname() === userNickname) return;

      const previousFeed = feeds.find((feed) => feed.feedId === feedId);
      if (!previousFeed) return;

      const rollbackLike = () => {
        updateCache((data) =>
          setFeedLike(data, feedId, {
            isLiked: previousFeed.isLiked,
            likeCount: previousFeed.likeCount
          })
        );
      };

      pendingLikeKeysRef.current.add(likeRequestKey);
      updateCache((data) => toggleFeedLike(data, feedId));

      try {
        const like = await likeMutation.mutateAsync(feedId);
        if (!like) return;

        updateCache((data) =>
          setFeedLike(data, feedId, {
            isLiked: like.liked,
            likeCount: like.likeCount
          })
        );
        trackEvent('feed_like_changed', { action: like.liked ? 'liked' : 'unliked' });
      } catch (error) {
        console.error(error);
        rollbackLike();
      } finally {
        pendingLikeKeysRef.current.delete(likeRequestKey);
      }
    },
    [feeds, likeMutation, mood, timeBudget, updateCache]
  );

  const onReportClick = useCallback(
    async (feedId: number, userNickname: string) => {
      if (userNickname === currentNickname) return;

      try {
        await reportMutation.mutateAsync(feedId);
        trackEvent('feed_reported');
        setToastVariant('report');
      } catch (error) {
        console.error(error);
      }
    },
    [currentNickname, reportMutation]
  );

  const onBlockClick = useCallback(
    async (feedId: number, userNickname: string) => {
      if (userNickname === currentNickname) return;

      try {
        await blockMutation.mutateAsync(feedId);
        trackEvent('feed_user_blocked');
        setToastVariant('block');
        updateCache((data) => removeFeed(data, feedId));
      } catch (error) {
        console.error(error);
      }
    },
    [blockMutation, currentNickname, updateCache]
  );

  const actionError = likeMutation.error ?? reportMutation.error ?? blockMutation.error;
  const isActionPending =
    likeMutation.isPending || reportMutation.isPending || blockMutation.isPending;

  return {
    actionError,
    dismissToast: () => setToastVariant(null),
    onBlockClick,
    onHeartClick,
    onReportClick,
    isActionPending,
    toastVariant
  };
}
