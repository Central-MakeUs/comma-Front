import { NavigationBar } from '@comma/design-system';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { navigateToNavigationItem } from '../../utils/navigation';
import { ARCHIVE_ITEMS, type ArchiveViewMode } from './Archive.constants';
import * as styles from './Archive.css';
import { ArchiveFeedGrid } from './ArchiveFeedGrid';
import { ArchiveFeedList } from './ArchiveFeedList';
import { ArchiveHeader } from './ArchiveHeader';
import { getMyFeeds } from '../../apis/feed';
import { feedInfo } from '../../types/feed';

function Archive() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ArchiveViewMode>('list');
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<feedInfo[]>([]);

  useEffect(() => {
    const handleInit = async () => {
      let res;
      try {
        res = await getMyFeeds({cursor: undefined, size: undefined});

      } catch(error) {
        console.error(error);
        alert('내 쉼표 조회 중 오류 발생');
      } finally {
        setContent([...(res?.data?.items ?? [])]);
        setLoading(false);
      }
    }

    handleInit();
  }, [])

  return (
    <main className={styles.page}>
      <div className={styles.screen}>
        <ArchiveHeader viewMode={viewMode} onViewModeChange={setViewMode} />
        {viewMode === 'list' ? (
          <ArchiveFeedList items={loading? [] : content} />
        ) : (
          <ArchiveFeedGrid items={loading? [] : content} />
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
