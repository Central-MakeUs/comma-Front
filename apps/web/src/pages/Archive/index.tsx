import { NavigationBar } from '@comma/design-system';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyFeeds } from '../../apis/feed';
import type { feedInfo } from '../../types/feed';
import { navigateToNavigationItem } from '../../utils/navigation';
import type { ArchiveViewMode } from './Archive.constants';
import * as styles from './Archive.css';
import { ArchiveFeedGrid } from './ArchiveFeedGrid';
import { ArchiveFeedList } from './ArchiveFeedList';
import { ArchiveHeader } from './ArchiveHeader';
import { loadingState } from '../../types/api';

function Archive() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ArchiveViewMode>('list');
  const [state, setState] = useState<loadingState>('loading');
  const [content, setContent] = useState<feedInfo[]>([]);

  useEffect(() => {
    const handleInit = async () => {
      let res: Awaited<ReturnType<typeof getMyFeeds>> | undefined;

      try {
        res = await getMyFeeds({ cursor: undefined, size: undefined });

      } catch (error) {
        console.error(error);
        setState('error');
        alert('내 쉼표 조회 중 오류 발생');

      } finally {
        if (res?.success) {
          if(res.data?.items.length) setState('success');
          else setState('empty');
          setContent([...(res.data?.items ?? [])]);

        }

      }
    };

    handleInit();
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.screen}>
        <ArchiveHeader viewMode={viewMode} onViewModeChange={setViewMode} />
        {viewMode === 'list' ? (
          <ArchiveFeedList items={state == 'loading' ? [] : content} />
        ) : (
          <ArchiveFeedGrid items={state == 'loading' ? [] : content} />
        )}
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
