import { NavigationBar } from '@comma/design-system';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { navigateToNavigationItem } from '../../utils/navigation';
import { ARCHIVE_ITEMS, type ArchiveViewMode } from './Archive.constants';
import * as styles from './Archive.css';
import { ArchiveFeedGrid } from './ArchiveFeedGrid';
import { ArchiveFeedList } from './ArchiveFeedList';
import { ArchiveHeader } from './ArchiveHeader';

function Archive() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ArchiveViewMode>('list');

  return (
    <main className={styles.page}>
      <div className={styles.screen}>
        <ArchiveHeader viewMode={viewMode} onViewModeChange={setViewMode} />
        {viewMode === 'list' ? (
          <ArchiveFeedList items={ARCHIVE_ITEMS} />
        ) : (
          <ArchiveFeedGrid items={ARCHIVE_ITEMS} />
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
