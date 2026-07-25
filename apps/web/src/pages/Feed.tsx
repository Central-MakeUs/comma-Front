import { Chip, FeedCard, Icon, NavigationBar } from '@comma/design-system';
import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { navigateToNavigationItem } from '../utils/navigation';
import * as styles from './Feed.css';
import { feedInfo } from '../types/feed';
import { getFeeds } from '../apis/feed';
import { transformDate } from '../utils/transformDate';

const feelCat = ['전체', '지치고 무기력해', '답답하고 환기가 필요해', '괜찮아, 가볍게 즐기고 싶어'];

const bodyStateCat = ['전체', '잠깐 (1시간 이내)', '여유 (1-3시간 이내)', '넉넉 (3시간 이상)'];

type fieldType = 'feel' | 'time';

interface ICategoryModal {
  field: fieldType;
  onClick: (arg0: string) => void;
  style?: React.CSSProperties;
}

const itemStyle: React.CSSProperties = {
  padding: '8px 16px',
  paddingRight: 0,
  textAlign: 'left',
  background: 'none',
  border: 'none',
  color: 'inherit',
  font: 'inherit',
  cursor: 'pointer'
};

const moods:Record<string, string> = {
  '지치고 무기력해': 'A',
  '답답하고 환기가 필요해': 'B',
  '괜찮아, 가볍게 즐기고 싶어': 'C'
}

const times:Record<string, string> = {
  '잠깐 (1시간 이내)': 'X',
  '여유 (1-3시간 이내)': 'Y',
  '넉넉 (3시간 이상)': 'Z'
}

function CategoryModal({ field, onClick, style }: ICategoryModal) {
  const items = field === 'feel' ? feelCat : bodyStateCat;

  return (
    <div className={styles.chipModal} style={style}>
      {items.map((item) => (
        <button key={item} type="button" style={itemStyle} onClick={() => onClick(item)}>
          {item}
        </button>
      ))}
    </div>
  );
}

function Feed() {
  const [feelOpen, setFeelOpen] = useState(false);
  const [bodyOpen, setBodyOpen] = useState(false);

  const [currentFeel, setCurrentFeel] = useState('상태');
  const [currentBody, setCurrentBody] = useState('시간');

  const feelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const [feelPos, setFeelPos] = useState<{ top: number; left: number }>();
  const [bodyPos, setBodyPos] = useState<{ top: number; left: number }>();

  const [loading, setLoading] = useState(true);
  const [feeds, setFeeds] = useState<feedInfo[] | never[]>([]);

  useEffect(() => {
    const handleInit = async () => {
      let res;
      try {
        res = await getFeeds({
          mood: moods[currentFeel],
          timeBudget: times[currentBody],
          cursor: undefined,
          size: undefined
        });

      } catch(error) {
        console.error(error);
        alert('피드 조회 오류 발생');
      } finally {
        if(res && res.success) {
          setFeeds([...(res.data?.items ?? [])]);
          setLoading(false);
        }
      }
    };

    handleInit();
  }, [currentFeel, currentBody]);

  const navigate = useNavigate();

  const getModalPos = (ref: React.RefObject<HTMLDivElement | null>) => {
    const rect = ref.current?.getBoundingClientRect();
    return rect ? { top: rect.bottom + 8, left: rect.left } : undefined;
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <span className={styles.headerText}>
          오늘 아직 쉬지 못했어요.
          <br />
          잠깐 쉼표 찍으러 갈까요?
        </span>
        <Link className={styles.headerLink} to="/rest/checklist">
          휴식하기 <Icon name="rightArrow" />
        </Link>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
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
                    setCurrentFeel(cat);
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
                    setCurrentBody(cat);
                    setBodyOpen(false);
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
        <div className={styles.scrollContainer}>
          {
            // TODO: liked 및 likeCount 연동
            loading? null : (
              feeds.map((f) => <FeedCard id={String(f.feedId)} imageSrc={f.imageUrl} imageAlt={`피드 이미지 ${f.feedId}`} timeLabel={transformDate(f.createdAt)} tags={[...f.hashtags]} content={f.review} variant='others' liked={false} likeCount={0} />) 
            )
          }
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
