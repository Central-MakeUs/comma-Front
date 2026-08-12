import { FeedCard, Toast } from '@comma/design-system';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { SESSION_EXPIRED_ERROR_MESSAGE } from '../../../shared/api/client';
import { TabScrollArea, TabShell } from '../../../shared/components/layout';
import { QueryFeedback } from '../../../shared/components/QueryFeedback';
import { getStoredNickname } from '../../../shared/lib/tokenStorage';
import { transformDate } from '../../../shared/lib/transformDate';
import { feedInfiniteQueryOptions } from '../api/feed.queries';
import { useFeedActions } from '../hooks/useFeedActions';
import { useFeedInfiniteScroll } from '../hooks/useFeedInfiniteScroll';
import { moods, times } from '../model/feed.constants';
import * as styles from './Feed.css';
import FeedHeader from './FeedHeader';
import FeedToast from './FeedToast';

const FEED_PAGE_SIZE = 5;

function FeedScreen() {
  const [currentFeel, setCurrentFeel] = useState('상태');
  const [currentBody, setCurrentBody] = useState('시간');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const nickname = getStoredNickname();
  const mood = moods[currentFeel];
  const timeBudget = times[currentBody];
  const queryOptions = feedInfiniteQueryOptions({ mood, timeBudget, size: FEED_PAGE_SIZE });
  const queryKey = queryOptions.queryKey;
  const feedQuery = useInfiniteQuery(queryOptions);
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

  useEffect(() => {
    if (!feedQuery.error) return;
    if (feedQuery.error.message === SESSION_EXPIRED_ERROR_MESSAGE) return;

    console.error(feedQuery.error);
  }, [feedQuery.error]);

  return (
    <TabShell active="feed" className={styles.container}>
      <FeedToast isVisible={isHeaderVisible} />
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <FeedHeader
          currentFeel={currentFeel}
          currentBody={currentBody}
          onFeelChange={setCurrentFeel}
          onBodyChange={setCurrentBody}
        />
        <TabScrollArea className={styles.scrollContainer} onScroll={onScroll}>
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
            feeds.map((f) => (
              <FeedCard
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
                  f.nickname === nickname
                    ? undefined
                    : () => onBlockClick(f.feedId, f.nickname ?? '')
                }
              />
            ))
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
