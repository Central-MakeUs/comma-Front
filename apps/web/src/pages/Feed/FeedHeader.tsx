import { Chip } from '@comma/design-system';
import { useRef, useState } from 'react';
import type { RefObject } from 'react';
import * as styles from './Feed.css';
import CategoryModal from './FeedCategoryModal';

interface IFeedHeader {
  currentFeel: string;
  currentBody: string;
  onFeelChange: (feel: string) => void;
  onBodyChange: (body: string) => void;
}

function FeedHeader({ currentFeel, currentBody, onFeelChange, onBodyChange }: IFeedHeader) {
  const [feelOpen, setFeelOpen] = useState(false);
  const [bodyOpen, setBodyOpen] = useState(false);

  const feelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const [feelPos, setFeelPos] = useState<{ top: number; left: number }>();
  const [bodyPos, setBodyPos] = useState<{ top: number; left: number }>();

  const getModalPos = (ref: RefObject<HTMLDivElement | null>) => {
    const rect = ref.current?.getBoundingClientRect();
    return rect ? { top: rect.bottom + 8, left: rect.left } : undefined;
  };

  return (
    <div style={{ width: '100%' }}>
      <div className={styles.title}>피드</div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          paddingTop: 8,
          paddingBottom: 16,
          paddingLeft: 24,
          paddingRight: 24,
          gap: 8,
          overflowX: 'auto',
          overflowY: 'hidden'
        }}
      >
        <div ref={feelRef} style={{ position: 'relative', flexShrink: 0 }}>
          <Chip
            label={currentFeel}
            state={feelOpen ? 'selected' : 'default'}
            onClick={() => {
              setFeelPos(getModalPos(feelRef));
              setFeelOpen((prev) => !prev);
              setBodyOpen(false);
            }}
          />
          {feelOpen ? (
            <CategoryModal
              field="feel"
              style={feelPos}
              onClick={(cat) => {
                onFeelChange(cat);
                setFeelOpen(false);
              }}
            />
          ) : null}
        </div>
        <div ref={bodyRef} style={{ position: 'relative', flexShrink: 0 }}>
          <Chip
            label={currentBody}
            state={bodyOpen ? 'selected' : 'default'}
            className={styles.secondChip}
            onClick={() => {
              setBodyPos(getModalPos(bodyRef));
              setBodyOpen((prev) => !prev);
              setFeelOpen(false);
            }}
          />
          {bodyOpen ? (
            <CategoryModal
              field="time"
              style={bodyPos}
              onClick={(cat) => {
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
