import { FeedCard, NavigationBar } from '@comma/design-system';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checklistQueryKey, getChecklistQuestions } from '../../apis/checklist';
import { SESSION_EXPIRED_ERROR_MESSAGE } from '../../apis/client';
import { getFeeds, postLikes } from '../../apis/feed';
import type { loadingState } from '../../types/api';
import type { feedInfo } from '../../types/feed';
import { navigateToNavigationItem } from '../../utils/navigation';
import { transformDate } from '../../utils/transformDate';
import { moods, times } from './Feed.constants';
import * as styles from './Feed.css';
import FeedHeader from './FeedHeader';
import FeedToast from './FeedToast';

const FEED_PAGE_SIZE = 5;
const SCROLL_LOAD_THRESHOLD = 160;

function Feed() {
  const [currentFeel, setCurrentFeel] = useState('상태');
  const [currentBody, setCurrentBody] = useState('시간');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const [feeds, setFeeds] = useState<feedInfo[]>([]);
  const [state, setState] = useState<loadingState>('loading');
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const isFetchingNextRef = useRef(false);
  const feedRequestIdRef = useRef(0);
  const queryClient = useQueryClient();

  const onHeartClick = async (feedId: number, isLiked: boolean, nickname: string) => {
    try {
      const myNickname = localStorage.getItem('comma.nickname');
      if (myNickname === nickname) return;

      const res = await postLikes({ feedId });
      console.log(res);
      if (res.success) {
        setFeeds((prev) =>
          prev.map((feed) =>
            feed.feedId === feedId
              ? {
                  ...feed,
                  isLiked: !feed.isLiked,
                  likeCount: isLiked ? feed.likeCount - 1 : feed.likeCount + 1
                }
              : feed
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    void queryClient.prefetchQuery({
      queryKey: checklistQueryKey,
      queryFn: getChecklistQuestions,
      staleTime: 1000 * 60 * 10
    });
  }, [queryClient]);

  useEffect(() => {
    let canceled = false;
    const requestId = feedRequestIdRef.current + 1;
    feedRequestIdRef.current = requestId;

    const handleInit = async () => {
      setState('loading');
      setFeeds([]);
      setNextCursor(null);
      setHasNext(false);
      isFetchingNextRef.current = false;
      setIsFetchingNext(false);

      try {
        const res = await getFeeds({
          mood: moods[currentFeel],
          timeBudget: times[currentBody],
          size: FEED_PAGE_SIZE
        });

        if (canceled || feedRequestIdRef.current !== requestId) return;

        if (!res.success || !res.data) {
          setState('error');
          return;
        }

        const feedData = res.data;
        setFeeds(feedData.items);
        setNextCursor(feedData.hasNext ? feedData.nextCursor : null);
        setHasNext(feedData.hasNext);
        setState(feedData.items.length > 0 ? 'success' : 'empty');
      } catch (error) {
        if (canceled) return;
        if (error instanceof Error && error.message === SESSION_EXPIRED_ERROR_MESSAGE) return;
        console.error(error);
        setState('error');
        alert('피드 조회 오류 발생');
      }
    };

    void handleInit();

    return () => {
      canceled = true;
    };
  }, [currentFeel, currentBody]);

  const loadNextFeeds = useCallback(async () => {
    if (!hasNext || nextCursor === null || isFetchingNextRef.current) return;

    const requestId = feedRequestIdRef.current;
    isFetchingNextRef.current = true;
    setIsFetchingNext(true);

    try {
      const res = await getFeeds({
        mood: moods[currentFeel],
        timeBudget: times[currentBody],
        cursor: nextCursor,
        size: FEED_PAGE_SIZE
      });

      if (feedRequestIdRef.current !== requestId) return;

      if (!res.success || !res.data) {
        setState('error');
        return;
      }

      const feedData = res.data;
      setFeeds((prev) => [...prev, ...feedData.items]);
      setNextCursor(feedData.hasNext ? feedData.nextCursor : null);
      setHasNext(feedData.hasNext);
    } catch (error) {
      if (feedRequestIdRef.current !== requestId) return;
      if (error instanceof Error && error.message === SESSION_EXPIRED_ERROR_MESSAGE) return;
      console.error(error);
      setState('error');
      alert('피드 조회 오류 발생');
    } finally {
      if (feedRequestIdRef.current === requestId) {
        isFetchingNextRef.current = false;
        setIsFetchingNext(false);
      }
    }
  }, [currentFeel, currentBody, hasNext, nextCursor]);

  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <FeedToast isVisible={isHeaderVisible} />
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <FeedHeader
          currentFeel={currentFeel}
          currentBody={currentBody}
          onFeelChange={setCurrentFeel}
          onBodyChange={setCurrentBody}
        />
        <div
          className={styles.scrollContainer}
          onScroll={(event) => {
            const scrollElement = event.currentTarget;
            setIsHeaderVisible(scrollElement.scrollTop <= 4);

            const distanceToBottom =
              scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight;

            if (distanceToBottom <= SCROLL_LOAD_THRESHOLD && !isFetchingNext) {
              void loadNextFeeds();
            }
          }}
        >
          {state === 'loading' ? (
            /* TODO: error와 empty 시 화면 UI 반영 */
            <span className={styles.alertText}>불러오는 중...</span>
          ) : state === 'empty' ? (
            <span className={styles.alertText}>쉼표를 추가해보세요.</span>
          ) : state === 'error' ? null : (
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
                onHeartClick={() => onHeartClick(f.feedId, f.isLiked, f.nickname ?? '')}
                title={f.nickname}
                imageHeart={f.isLiked}
              />
            ))
          )}
        </div>
      </div>
      <NavigationBar
        active="feed"
        className={styles.navBarStyle}
        onItemSelect={(item) => navigateToNavigationItem(navigate, item, 'feed')}
      />
    </div>
  );
}

export default Feed;
