import { FeedCard, Toast } from '@comma/design-system';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useEffect, useRef, useState } from 'react';
import { trackEvent } from '../../../shared/analytics/events';
import { SESSION_EXPIRED_ERROR_MESSAGE } from '../../../shared/api/client';
import { TabScrollArea, TabShell } from '../../../shared/components/layout';
import { QueryFeedback } from '../../../shared/components/QueryFeedback';
import { getStoredNickname } from '../../../shared/lib/tokenStorage';
import { transformDate } from '../../../shared/lib/transformDate';
import { userRestStatusQueryOptions } from '../../auth/api/user.queries';
import { feedInfiniteQueryOptions } from '../api/feed.queries';
import { useFeedActions } from '../hooks/useFeedActions';
import { useFeedInfiniteScroll } from '../hooks/useFeedInfiniteScroll';
import { shouldShowFeedRestPrompt } from '../lib/feedRestStatus';
import { moods, times } from '../model/feed.constants';
import * as styles from './Feed.css';
import FeedHeader from './FeedHeader';
import FeedToast from './FeedToast';

const FEED_PAGE_SIZE = 5;
const FEED_CARD_BODY_HEIGHT = 104;
const FEED_VIRTUAL_OVERSCAN = 3;

function getViewportHeight() {
  return typeof window === 'undefined' ? 720 : window.innerHeight;
}

function getFeedImageHeight() {
  const viewportHeight = getViewportHeight();

  return Math.min(Math.max(viewportHeight * 0.58, 360), 499);
}

function getFeedVirtualGap() {
  const viewportHeight = getViewportHeight();

  return Math.min(Math.max(viewportHeight * 0.0469, 24), 40);
}

function FeedScreen() {
  const [currentFeel, setCurrentFeel] = useState('상태');
  const [currentBody, setCurrentBody] = useState('시간');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const feedScrollRef = useRef<HTMLDivElement>(null);

  const nickname = getStoredNickname();
  const mood = moods[currentFeel];
  const timeBudget = times[currentBody];
  const queryOptions = feedInfiniteQueryOptions({ mood, timeBudget, size: FEED_PAGE_SIZE });
  const queryKey = queryOptions.queryKey;
  const feedQuery = useInfiniteQuery(queryOptions);
  const restStatusQuery = useQuery(userRestStatusQueryOptions);
  const feeds = feedQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const feedVirtualizer = useVirtualizer({
    count: feeds.length,
    estimateSize: () => getFeedImageHeight() + FEED_CARD_BODY_HEIGHT,
    gap: getFeedVirtualGap(),
    getItemKey: (index) => feeds[index]?.feedId ?? index,
    getScrollElement: () => feedScrollRef.current,
    overscan: FEED_VIRTUAL_OVERSCAN
  });
  const virtualFeeds = feedVirtualizer.getVirtualItems();
  const {
    actionError,
    dismissToast,
    isActionPending,
    onBlockClick,
    onHeartClick,
    onReportClick,
    toastVariant
  } = useFeedActions({
    currentNickname: nickname,
    feeds,
    mood,
    queryKey,
    timeBudget
  });
  const onScroll = useFeedInfiniteScroll({
    fetchNextPage: feedQuery.fetchNextPage,
    hasNextPage: Boolean(feedQuery.hasNextPage),
    isFetchingNextPage: feedQuery.isFetchingNextPage,
    onHeaderVisibilityChange: setIsHeaderVisible
  });
  const resetFeedScrollMetrics = useCallback(() => {
    const scrollElement = feedScrollRef.current;
    if (!scrollElement) return;

    scrollElement.scrollTop = 0;
    setIsHeaderVisible(true);
  }, []);
  const handleFeelChange = useCallback(
    (nextFeel: string) => {
      trackEvent('feed_filter_applied', {
        filter_state: nextFeel === '전체' ? 'cleared' : 'applied',
        filter_type: 'mood'
      });
      resetFeedScrollMetrics();
      setCurrentFeel(nextFeel);
    },
    [resetFeedScrollMetrics]
  );
  const handleBodyChange = useCallback(
    (nextBody: string) => {
      trackEvent('feed_filter_applied', {
        filter_state: nextBody === '전체' ? 'cleared' : 'applied',
        filter_type: 'time_budget'
      });
      resetFeedScrollMetrics();
      setCurrentBody(nextBody);
    },
    [resetFeedScrollMetrics]
  );

  useEffect(() => {
    if (!feedQuery.error) return;
    if (feedQuery.error.message === SESSION_EXPIRED_ERROR_MESSAGE) return;

    console.error(feedQuery.error);
  }, [feedQuery.error]);

  return (
    <TabShell active="feed" className={styles.container}>
      <FeedToast
        isVisible={shouldShowFeedRestPrompt({
          restedToday: restStatusQuery.data?.restedToday,
          isHeaderVisible,
          isSuccess: restStatusQuery.isSuccess,
          isFetching: restStatusQuery.isFetching
        })}
      />
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <FeedHeader
          currentFeel={currentFeel}
          currentBody={currentBody}
          onFeelChange={handleFeelChange}
          onBodyChange={handleBodyChange}
        />
        <TabScrollArea
          className={styles.scrollContainer}
          onScroll={onScroll}
          scrollRef={feedScrollRef}
        >
          {feedQuery.isPending ? (
            <QueryFeedback message="피드를 불러오고 있어요..." state="loading" />
          ) : feedQuery.isError && feeds.length === 0 ? (
            feedQuery.error.message === SESSION_EXPIRED_ERROR_MESSAGE ? null : (
              <QueryFeedback
                message="피드를 불러오지 못했어요."
                onRetry={() => void feedQuery.refetch()}
                state="error"
              />
            )
          ) : feeds.length === 0 ? (
            <span className={styles.alertText}>쉼표를 추가해보세요.</span>
          ) : (
            <ul
              aria-label="피드 목록"
              className={styles.feedList}
              style={{ height: feedVirtualizer.getTotalSize() }}
            >
              {virtualFeeds.map((virtualFeed) => {
                const f = feeds[virtualFeed.index];
                if (!f) return null;

                return (
                  <li
                    className={styles.feedListItem}
                    data-index={virtualFeed.index}
                    key={virtualFeed.key}
                    ref={feedVirtualizer.measureElement}
                    style={{ top: virtualFeed.start }}
                  >
                    <FeedCard
                      id={String(f.feedId)}
                      imageSrc={f.imageUrl}
                      imageAlt={`피드 이미지 ${f.feedId}`}
                      timeLabel={transformDate(f.createdAt)}
                      tags={[...f.hashtags]}
                      content={f.review}
                      variant="others"
                      liked={f.isLiked}
                      likeCount={f.likeCount}
                      onHeartClick={() => onHeartClick(f.feedId, f.nickname ?? '')}
                      title={f.nickname}
                      imageHeart={f.isLiked}
                      onReportClick={
                        f.nickname === nickname
                          ? undefined
                          : () => onReportClick(f.feedId, f.nickname ?? '')
                      }
                      onBlockClick={
                        f.nickname === nickname
                          ? undefined
                          : () => onBlockClick(f.feedId, f.nickname ?? '')
                      }
                    />
                  </li>
                );
              })}
            </ul>
          )}
          {feedQuery.isFetchNextPageError && feeds.length > 0 ? (
            <QueryFeedback
              message="피드를 더 불러오지 못했어요."
              onRetry={() => void feedQuery.fetchNextPage({ cancelRefetch: false })}
              state="error"
            />
          ) : null}
          {actionError ? (
            <QueryFeedback
              message={actionError.message || '피드 요청을 처리하지 못했어요.'}
              state="error"
            />
          ) : null}
          {isActionPending && !actionError ? (
            <QueryFeedback message="요청을 처리하고 있어요..." state="loading" />
          ) : null}
        </TabScrollArea>
      </div>
      <div aria-hidden="true" className={styles.bottomScrim} />
      {toastVariant ? (
        <Toast variant={toastVariant} className={styles.toast} onClose={dismissToast} />
      ) : null}
    </TabShell>
  );
}

export default FeedScreen;
