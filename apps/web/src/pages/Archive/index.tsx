import { NavigationBar } from '@comma/design-system';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SESSION_EXPIRED_ERROR_MESSAGE } from '../../apis/client';
import { getMyFeeds } from '../../apis/feed';
import type { loadingState } from '../../types/api';
import type { feedInfo } from '../../types/feed';
import { navigateToNavigationItem } from '../../utils/navigation';
import type { ArchiveViewMode } from './Archive.constants';
import * as styles from './Archive.css';
import { ArchiveFeedGrid } from './ArchiveFeedGrid';
import { ArchiveFeedList } from './ArchiveFeedList';
import { ArchiveHeader } from './ArchiveHeader';

const ARCHIVE_PAGE_SIZE = 5;
const SCROLL_LOAD_THRESHOLD = 160;

function Archive() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ArchiveViewMode>('list');
  const [state, setState] = useState<loadingState>('loading');
  const [content, setContent] = useState<feedInfo[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const isFetchingNextRef = useRef(false);

  useEffect(() => {
    let canceled = false;

    const handleInit = async () => {
      setState('loading');
      setContent([]);
      setNextCursor(null);
      setHasNext(false);
      isFetchingNextRef.current = false;
      setIsFetchingNext(false);

      try {
        const res = await getMyFeeds({ size: ARCHIVE_PAGE_SIZE });

        if (canceled) return;

        if (!res.success || !res.data) {
          setState('error');
          return;
        }

        const feedData = res.data;
        setContent(feedData.items);
        setNextCursor(feedData.hasNext ? feedData.nextCursor : null);
        setHasNext(feedData.hasNext);
        setState(feedData.items.length > 0 ? 'success' : 'empty');
      } catch (error) {
        if (canceled) return;
        if (error instanceof Error && error.message === SESSION_EXPIRED_ERROR_MESSAGE) return;
        console.error(error);
        setState('error');
        alert('내 쉼표 조회 중 오류 발생');
      }
    };

    void handleInit();

    return () => {
      canceled = true;
    };
  }, []);

  const loadNextFeeds = useCallback(async () => {
    if (!hasNext || nextCursor === null || isFetchingNextRef.current) return;

    isFetchingNextRef.current = true;
    setIsFetchingNext(true);

    try {
      const res = await getMyFeeds({
        cursor: nextCursor,
        size: ARCHIVE_PAGE_SIZE
      });

      if (!res.success || !res.data) {
        setState('error');
        return;
      }

      const feedData = res.data;
      setContent((prev) => [...prev, ...feedData.items]);
      setNextCursor(feedData.hasNext ? feedData.nextCursor : null);
      setHasNext(feedData.hasNext);
    } catch (error) {
      if (error instanceof Error && error.message === SESSION_EXPIRED_ERROR_MESSAGE) return;
      console.error(error);
      setState('error');
      alert('내 쉼표 조회 중 오류 발생');
    } finally {
      isFetchingNextRef.current = false;
      setIsFetchingNext(false);
    }
  }, [hasNext, nextCursor]);

  return (
    <main className={styles.page}>
      <div className={styles.screen}>
        <ArchiveHeader viewMode={viewMode} onViewModeChange={setViewMode} />
        <div
          className={styles.scrollContainer}
          onScroll={(event) => {
            const scrollElement = event.currentTarget;
            const distanceToBottom =
              scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight;

            if (distanceToBottom <= SCROLL_LOAD_THRESHOLD && !isFetchingNext) {
              void loadNextFeeds();
            }
          }}
        >
          {state === 'loading' ? (
            <div className={styles.loadingWrapper}>
              <span className={styles.alertText}>불러오는 중...</span>
            </div>
          ) : viewMode === 'list' ? (
            <ArchiveFeedList items={content} />
          ) : (
            <ArchiveFeedGrid items={content} />
          )}
        </div>
        <NavigationBar
          active="archive"
          className={styles.navigation}
          onItemSelect={(item) => navigateToNavigationItem(navigate, item, 'archive')}
        />
      </div>
    </main>
  );
}

export default Archive;
