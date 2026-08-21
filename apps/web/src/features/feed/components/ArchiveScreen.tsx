import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { trackEvent } from '../../../shared/analytics/events';
import { SESSION_EXPIRED_ERROR_MESSAGE } from '../../../shared/api/client';
import { TabScrollArea, TabShell } from '../../../shared/components/layout';
import { QueryFeedback } from '../../../shared/components/QueryFeedback';
import { myFeedsInfiniteQueryOptions } from '../api/feed.queries';
import type { ArchiveViewMode } from './Archive.constants';
import * as styles from './Archive.css';
import { ArchiveFeedGrid } from './ArchiveFeedGrid';
import { ArchiveFeedList } from './ArchiveFeedList';
import { ArchiveHeader } from './ArchiveHeader';

const ARCHIVE_PAGE_SIZE = 5;
const SCROLL_LOAD_THRESHOLD = 160;

function ArchiveScreen() {
  const [viewMode, setViewMode] = useState<ArchiveViewMode>('list');
  const archiveQuery = useInfiniteQuery(myFeedsInfiniteQueryOptions(ARCHIVE_PAGE_SIZE));
  const content = archiveQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const handleViewModeChange = (nextViewMode: ArchiveViewMode) => {
    if (nextViewMode === viewMode) return;

    trackEvent('archive_view_changed', { view_mode: nextViewMode });
    setViewMode(nextViewMode);
  };

  return (
    <TabShell active="archive" className={styles.screen}>
      <ArchiveHeader viewMode={viewMode} onViewModeChange={handleViewModeChange} />
      <TabScrollArea
        className={styles.scrollContainer}
        onScroll={(event) => {
          const scrollElement = event.currentTarget;
          const distanceToBottom =
            scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight;

          if (
            distanceToBottom <= SCROLL_LOAD_THRESHOLD &&
            archiveQuery.hasNextPage &&
            !archiveQuery.isFetchingNextPage
          ) {
            void archiveQuery.fetchNextPage({ cancelRefetch: false });
          }
        }}
      >
        {archiveQuery.isPending ? (
          <div className={styles.loadingWrapper}>
            <QueryFeedback message="내 쉼표를 불러오고 있어요..." state="loading" />
          </div>
        ) : archiveQuery.isError && content.length === 0 ? (
          archiveQuery.error.message === SESSION_EXPIRED_ERROR_MESSAGE ? null : (
            <QueryFeedback
              message="내 쉼표를 불러오지 못했어요."
              onRetry={() => void archiveQuery.refetch()}
              state="error"
            />
          )
        ) : viewMode === 'list' ? (
          <ArchiveFeedList items={content} />
        ) : (
          <ArchiveFeedGrid items={content} />
        )}
        {archiveQuery.isFetchNextPageError && content.length > 0 ? (
          <QueryFeedback
            message="내 쉼표를 더 불러오지 못했어요."
            onRetry={() => void archiveQuery.fetchNextPage({ cancelRefetch: false })}
            state="error"
          />
        ) : null}
      </TabScrollArea>
    </TabShell>
  );
}

export default ArchiveScreen;
