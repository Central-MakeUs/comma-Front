import { Chip, FeedCard, Icon, NavigationBar } from '@comma/design-system';
import { useRef, useState } from 'react';
import * as styles from './Feed.css';
import { useNavigate, Link } from 'react-router-dom';

const feelCat = ['전체', '멍하고 싶어', '기분 전환이 필요해', '가볍게 해볼 수 있어'];

const bodyStateCat = ['전체', '완전 방전이야', '견딜 만해', '안 피곤해'];

const restCat = ['전체', '아무것도 안하고 싶어', '조용히 혼자 있고 싶어', '몸을 움직이고 싶어'];

type fieldType = 'feel' | 'body' | 'rest';

interface ICategoryModal {
  field: fieldType;
  onClick: (arg0: string) => void;
  style?: React.CSSProperties;
}

const itemStyle: React.CSSProperties = {
  padding: '8px 16px',
  textAlign: 'left',
  background: 'none',
  border: 'none',
  color: 'inherit',
  font: 'inherit',
  cursor: 'pointer'
};

function CategoryModal({ field, onClick, style }: ICategoryModal) {
  const items = field === 'feel' ? feelCat : field === 'body' ? bodyStateCat : restCat;

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
  const [restOpen, setRestOpen] = useState(false);

  const [currentFeel, setCurrentFeel] = useState('기분');
  const [currentBody, setCurrentBody] = useState('몸 상태');
  const [currentRest, setCurrentRest] = useState('휴식');

  const feelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const restRef = useRef<HTMLDivElement>(null);

  const [feelPos, setFeelPos] = useState<{ top: number; left: number }>();
  const [bodyPos, setBodyPos] = useState<{ top: number; left: number }>();
  const [restPos, setRestPos] = useState<{ top: number; left: number }>();

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
        <Link className={styles.headerLink} to='/rest/checklist'>
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
                  setRestOpen(false);
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
                  setRestOpen(false);
                }}
              />
              {bodyOpen ? (
                <CategoryModal
                  field="body"
                  style={bodyPos}
                  onClick={(cat) => {
                    setCurrentBody(cat);
                    setBodyOpen(false);
                  }}
                />
              ) : null}
            </div>
            <div ref={restRef} style={{ position: 'relative', flexShrink: 0 }}>
              <Chip
                label={currentRest}
                state={restOpen ? 'selected' : 'default'}
                onClick={() => {
                  setRestPos(getModalPos(restRef));
                  setRestOpen((prev) => !prev);
                  setFeelOpen(false);
                  setBodyOpen(false);
                }}
              />
              {restOpen ? (
                <CategoryModal
                  field="rest"
                  style={restPos}
                  onClick={(cat) => {
                    setCurrentRest(cat);
                    setRestOpen(false);
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
        <div className={styles.scrollContainer}>
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
        </div>
      </div>
      <NavigationBar active="feed" className={styles.navBarStyle} onItemSelect={(item) => {
        switch(item) {
          case 'rest':
             navigate('/rest/result');
             break;
          case 'feed':
            navigate('/feed');
            break;
          case 'archive':
            navigate('/archive');
            break;
          case 'mypage':
            navigate('/mypage');
            break;
        }
      }}/>
    </div>
  );
}

export default Feed;
