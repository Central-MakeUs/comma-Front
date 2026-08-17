import { FeedCard, Toast } from '@comma/design-system';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
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

function getFeedVirtualImageHeight(viewportHeight: number) {
  return Math.min(Math.max(viewportHeight * 0.58, 360), 499);
}

function getFeedVirtualGap(viewportHeight: number) {
  return Math.min(Math.max(viewportHeight * 0.0469, 24), 40);
}

type VirtualFeedItemProps = {
  children: React.ReactNode;
  itemTop: number;
  onHeightChange: (height: number) => void;
};

function VirtualFeedItem({ children, itemTop, onHeightChange }: VirtualFeedItemProps) {
  const itemRef = useRef<HTMLLIElement>(null);

  useLayoutEffect(() => {
    const item = itemRef.current;
    if (!item) return undefined;

    const measure = () => {
      onHeightChange(Math.ceil(item.getBoundingClientRect().height));
    };

    measure();
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : undefined;
    resizeObserver?.observe(item);

    return () => {
      resizeObserver?.disconnect();
    };
  }, [onHeightChange]);

  return (
    <li
      className={styles.virtualFeedCard}
      ref={itemRef}
      style={{
        transform: `translate3d(0, ${itemTop}px, 0)`
      }}
    >
      {children}
    </li>
  );
}

function FeedScreen() {
  const [currentFeel, setCurrentFeel] = useState('상태');
  const [currentBody, setCurrentBody] = useState('시간');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const feedScrollRef = useRef<HTMLDivElement>(null);
  const [virtualMetrics, setVirtualMetrics] = useState({
    scrollTop: 0,
    viewportHeight: 0
  });
  const [feedHeights, setFeedHeights] = useState<Record<number, number>>({});

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
  const feedVirtualGap = getFeedVirtualGap(virtualMetrics.viewportHeight);
  const estimatedFeedItemHeight =
    getFeedVirtualImageHeight(virtualMetrics.viewportHeight) +
    FEED_VIRTUAL_BODY_HEIGHT +
    feedVirtualGap;
  const virtualFeedItems = useMemo(() => {
    let itemTop = 0;

    const items = feeds.map((feed) => {
      const itemHeight = feedHeights[feed.feedId] ?? estimatedFeedItemHeight;
      const item = {
        feed,
        height: itemHeight,
        top: itemTop
      };

      itemTop += itemHeight;
      return item;
    });

    return {
      items,
      totalHeight: itemTop
    };
  }, [estimatedFeedItemHeight, feedHeights, feeds]);
  const visibleFeedRange = useMemo(() => {
    if (!feeds.length) return { start: 0, end: -1 };

    const visibleTop = virtualMetrics.scrollTop;
    const visibleBottom = virtualMetrics.scrollTop + virtualMetrics.viewportHeight;
    const firstVisibleIndex = virtualFeedItems.items.findIndex(
      (item) => item.top + item.height >= visibleTop
    );
    const lastVisibleIndex = virtualFeedItems.items.findIndex((item) => item.top > visibleBottom);
    const start = Math.max(
      (firstVisibleIndex < 0 ? 0 : firstVisibleIndex) - FEED_VIRTUAL_OVERSCAN,
      0
    );
    const end = Math.min(
      (lastVisibleIndex < 0 ? feeds.length - 1 : lastVisibleIndex) + FEED_VIRTUAL_OVERSCAN,
      feeds.length - 1
    );

    return { start, end };
  }, [
    feeds.length,
    virtualFeedItems.items,
    virtualMetrics.scrollTop,
    virtualMetrics.viewportHeight
  ]);
  const visibleFeeds = virtualFeedItems.items.slice(
    visibleFeedRange.start,
    visibleFeedRange.end + 1
  );
  const virtualFeedListHeight = virtualFeedItems.totalHeight;
  const updateFeedVirtualMetrics = useCallback((scrollElement: HTMLDivElement) => {
    const nextMetrics = {
      scrollTop: scrollElement.scrollTop,
      viewportHeight: scrollElement.clientHeight
    };

    setVirtualMetrics((currentMetrics) =>
      currentMetrics.scrollTop === nextMetrics.scrollTop &&
      currentMetrics.viewportHeight === nextMetrics.viewportHeight
        ? currentMetrics
        : nextMetrics
    );
  }, []);
  const handleFeedHeightChange = useCallback(
    (feedId: number, measuredHeight: number) => {
      const nextHeight = measuredHeight + feedVirtualGap;
      setFeedHeights((currentHeights) =>
        Math.abs((currentHeights[feedId] ?? 0) - nextHeight) <= 1
          ? currentHeights
          : { ...currentHeights, [feedId]: nextHeight }
      );
    },
    [feedVirtualGap]
  );
  const resetFeedScrollMetrics = useCallback(() => {
    const scrollElement = feedScrollRef.current;
    if (!scrollElement) return;

    scrollElement.scrollTop = 0;
    updateFeedVirtualMetrics(scrollElement);
  }, [updateFeedVirtualMetrics]);
  const handleFeelChange = useCallback(
    (nextFeel: string) => {
      resetFeedScrollMetrics();
      setCurrentFeel(nextFeel);
    },
    [resetFeedScrollMetrics]
  );
  const handleBodyChange = useCallback(
    (nextBody: string) => {
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

  useEffect(() => {
    const updateVirtualMetrics = () => {
      const scrollElement = feedScrollRef.current;
      if (!scrollElement) return;

      updateFeedVirtualMetrics(scrollElement);
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
  }, [updateFeedVirtualMetrics]);

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
          onScroll={(event) => {
            updateFeedVirtualMetrics(event.currentTarget);
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
            <ul
              aria-label="피드 목록"
              className={styles.virtualFeedList}
              style={{ height: virtualFeedListHeight } as CSSProperties}
            >
              {visibleFeeds.map(({ feed: f, top }) => (
                <VirtualFeedItem
                  itemTop={top}
                  key={f.feedId}
                  onHeightChange={(measuredHeight) =>
                    handleFeedHeightChange(f.feedId, measuredHeight)
                  }
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
                </VirtualFeedItem>
              ))}
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
      {toastVariant ? (
        <Toast variant={toastVariant} className={styles.toast} onClose={dismissToast} />
      ) : null}
    </TabShell>
  );
}

export default FeedScreen;
