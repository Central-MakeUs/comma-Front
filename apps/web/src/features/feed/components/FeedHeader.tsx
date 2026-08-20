import { Chip, useDismissibleLayer } from '@comma/design-system';
import type { RefObject } from 'react';
import { useState } from 'react';
import * as styles from './Feed.css';
import { FeedFilterMenu } from './FeedFilterMenu';

interface IFeedHeader {
  currentFeel: string;
  currentBody: string;
  onFeelChange: (feel: string) => void;
  onBodyChange: (body: string) => void;
}

function FeedHeader({ currentFeel, currentBody, onFeelChange, onBodyChange }: IFeedHeader) {
  const [feelOpen, setFeelOpen] = useState(false);
  const [bodyOpen, setBodyOpen] = useState(false);

  const feelRef = useDismissibleLayer<HTMLDivElement>({
    dismissOnScroll: true,
    enabled: feelOpen,
    onDismiss: () => setFeelOpen(false)
  });
  const bodyRef = useDismissibleLayer<HTMLDivElement>({
    dismissOnScroll: true,
    enabled: bodyOpen,
    onDismiss: () => setBodyOpen(false)
  });

  const [feelPos, setFeelPos] = useState<{ top: number; left: number }>();
  const [bodyPos, setBodyPos] = useState<{ top: number; left: number }>();

  const getMenuPosition = (ref: RefObject<HTMLDivElement | null>) => {
    const rect = ref.current?.getBoundingClientRect();
    return rect ? { top: rect.bottom + 8, left: rect.left } : undefined;
  };

  return (
    <div className={styles.header}>
      <div className={styles.title}>피드</div>
      <div className={styles.filterRow}>
        <div className={styles.filterItem} ref={feelRef}>
          <Chip
            aria-controls="feed-feel-filter-menu"
            aria-expanded={feelOpen}
            aria-haspopup="menu"
            label={currentFeel}
            state={feelOpen ? 'selected' : 'default'}
            onClick={() => {
              setFeelPos(getMenuPosition(feelRef));
              setFeelOpen((prev) => !prev);
              setBodyOpen(false);
            }}
          />
          {feelOpen ? (
            <FeedFilterMenu
              field="feel"
              id="feed-feel-filter-menu"
              style={feelPos}
              onSelect={(cat) => {
                onFeelChange(cat);
                setFeelOpen(false);
              }}
            />
          ) : null}
        </div>
        <div className={styles.filterItem} ref={bodyRef}>
          <Chip
            aria-controls="feed-time-filter-menu"
            aria-expanded={bodyOpen}
            aria-haspopup="menu"
            label={currentBody}
            state={bodyOpen ? 'selected' : 'default'}
            className={styles.secondChip}
            onClick={() => {
              setBodyPos(getMenuPosition(bodyRef));
              setBodyOpen((prev) => !prev);
              setFeelOpen(false);
            }}
          />
          {bodyOpen ? (
            <FeedFilterMenu
              field="time"
              id="feed-time-filter-menu"
              style={bodyPos}
              onSelect={(cat) => {
                onBodyChange(cat);
                setBodyOpen(false);
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default FeedHeader;
