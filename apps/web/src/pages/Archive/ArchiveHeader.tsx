import { Icon } from '@comma/design-system';
import { ARCHIVE_TITLE, type ArchiveViewMode } from './Archive.constants';
import * as styles from './Archive.css';

type ArchiveHeaderProps = {
  viewMode: ArchiveViewMode;
  onViewModeChange: (viewMode: ArchiveViewMode) => void;
};

export function ArchiveHeader({ viewMode, onViewModeChange }: ArchiveHeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{ARCHIVE_TITLE}</h1>
      <fieldset className={styles.viewControls} aria-label="아카이브 보기 방식">
        <button
          aria-label="1열 보기"
          aria-pressed={viewMode === 'list'}
          className={`${styles.viewButton} ${
            styles.viewButtonState[viewMode === 'list' ? 'active' : 'inactive']
          }`}
          onClick={() => onViewModeChange('list')}
          type="button"
        >
          <Icon height={24} name="array" variant="list" width={24} />
        </button>
        <button
          aria-label="2열 보기"
          aria-pressed={viewMode === 'grid'}
          className={`${styles.viewButton} ${
            styles.viewButtonState[viewMode === 'grid' ? 'active' : 'inactive']
          }`}
          onClick={() => onViewModeChange('grid')}
          type="button"
        >
          <Icon height={24} name="array" variant="badook" width={24} />
        </button>
      </fieldset>
    </header>
  );
}
