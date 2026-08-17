import { FeedCard, Toast } from '@comma/design-system';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
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
const FEED_VIRTUAL_BODY_HEIGHT = 104;
const FEED_VIRTUAL_OVERSCAN = 4;

function FeedScreen() {
  const [currentFeel, setCurrentFeel] = useState('상태');
  const [currentBody, setCurrentBody] = useState('시간');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const feedScrollRef = useRef<HTMLDivElement>(null);
  const [virtualMetrics, setVirtualMetrics] = useState({
    scrollTop: 0,
    viewportHeight: 0
  });

  const nickname = getStoredNickname();
  const mood = moods[currentFeel];
  const timeBudget = times[currentBody];
  const queryOptions = feedInfiniteQueryOptions({ mood, timeBudget, size: FEED_PAGE_SIZE });
  const queryKey = queryOptions.queryKey;
  const feedQuery = useInfiniteQuery(queryOptions);
  const restStatusQuery = useQuery(userRestStatusQueryOptions);
  const feeds = feedQuery.data?.pages.flatMap((page) => page.items) ?? [];
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
  const feedVirtualItemHeight =
    Math.min(Math.max(virtualMetrics.viewportHeight * 0.58, 360), 499) +
    FEED_VIRTUAL_BODY_HEIGHT +
    Math.min(Math.max(virtualMetrics.viewportHeight * 0.0469, 24), 40);
  const visibleFeedRange = useMemo(() => {
    if (!feeds.length) return { start: 0, end: -1 };

    const start = Math.max(
      Math.floor(virtualMetrics.scrollTop / feedVirtualItemHeight) - FEED_VIRTUAL_OVERSCAN,
      0
    );
    const end = Math.min(
      Math.ceil((virtualMetrics.scrollTop + virtualMetrics.viewportHeight) / feedVirtualItemHeight) +
        FEED_VIRTUAL_OVERSCAN,
      feeds.length - 1
    );

    return { start, end };
  }, [feeds.length, feedVirtualItemHeight, virtualMetrics.scrollTop, virtualMetrics.viewportHeight]);
  const visibleFeeds = feeds
    .map((feed, index) => ({ feed, index }))
    .slice(visibleFeedRange.start, visibleFeedRange.end + 1);
  const virtualFeedListHeight = feeds.length * feedVirtualItemHeight;

  useEffect(() => {
    if (!feedQuery.error) return;
    if (feedQuery.error.message === SESSION_EXPIRED_ERROR_MESSAGE) return;

    console.error(feedQuery.error);
  }, [feedQuery.error]);

  useEffect(() => {
    const updateVirtualMetrics = () => {
      const scrollElement = feedScrollRef.current;
      if (!scrollElement) return;

      setVirtualMetrics({
        scrollTop: scrollElement.scrollTop,
        viewportHeight: scrollElement.clientHeight
      });
    };

    updateVirtualMetrics();
    window.addEventListener('resize', updateVirtualMetrics);
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateVirtualMetrics) : undefined;
    if (feedScrollRef.current) resizeObserver?.observe(feedScrollRef.current);

    return () => {
      window.removeEventListener('resize', updateVirtualMetrics);
      resizeObserver?.disconnect();
    };
  }, []);

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
          onFeelChange={setCurrentFeel}
          onBodyChange={setCurrentBody}
        />
        <TabScrollArea
          className={styles.scrollContainer}
          onScroll={(event) => {
            setVirtualMetrics({
              scrollTop: event.currentTarget.scrollTop,
              viewportHeight: event.currentTarget.clientHeight
            });
            onScroll(event);
          }}
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
            <div
              aria-label="피드 목록"
              className={styles.virtualFeedList}
              style={{ height: virtualFeedListHeight } as CSSProperties}
            >
              {visibleFeeds.map(({ feed: f, index }) => (
                <FeedCard
                  className={styles.virtualFeedCard}
                  key={f.feedId}
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
                    f.nickname === nickname ? undefined : () => onBlockClick(f.feedId, f.nickname ?? '')
                  }
                  style={{
                    transform: `translate3d(0, ${index * feedVirtualItemHeight}px, 0)`
                  }}
                />
              ))}
            </div>
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
      {toastVariant ? (
        <Toast variant={toastVariant} className={styles.toast} onClose={dismissToast} />
      ) : null}
    </TabShell>
  );
}

export default FeedScreen;
