import { FeedCard, NavigationBar } from '@comma/design-system';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeeds, getLikes } from '../../apis/feed';
import type { feedInfo } from '../../types/feed';
import { navigateToNavigationItem } from '../../utils/navigation';
import { transformDate } from '../../utils/transformDate';
import { moods, times } from './Feed.constants';
import * as styles from './Feed.css';
import FeedHeader from './FeedHeader';
import FeedToast from './FeedToast';

function Feed() {
  const [currentFeel, setCurrentFeel] = useState('상태');
  const [currentBody, setCurrentBody] = useState('시간');

  const [loading, setLoading] = useState(true);
  const [feeds, setFeeds] = useState<feedInfo[] | never[]>([]);

  useEffect(() => {
    const handleInit = async () => {
      let res: Awaited<ReturnType<typeof getFeeds>> | undefined;
      let likeRes: feedInfo[] | undefined;

      try {
        res = await getFeeds({
          mood: moods[currentFeel],
          timeBudget: times[currentBody],
          cursor: undefined,
          size: undefined
        });

        if (res?.success && res.data) {
          likeRes = await Promise.all(
            (res.data.items ?? []).map(async (item) => {
              const likeRes = await getLikes({ feedId: item.feedId });

              return {
                ...item,
                liked: likeRes.data?.liked ?? false,
                likeCount: likeRes.data?.likeCount ?? 0
              };
            })
          );
        }
      } catch (error) {
        console.error(error);
        alert('피드 조회 오류 발생');
      } finally {
        if (res?.success) {
          setFeeds([...(likeRes ?? [])]);
          setLoading(false);
        }
      }
    };

    handleInit();
  }, [currentFeel, currentBody]);

  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <FeedToast />
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <FeedHeader
          currentFeel={currentFeel}
          currentBody={currentBody}
          onFeelChange={setCurrentFeel}
          onBodyChange={setCurrentBody}
        />
        <div className={styles.scrollContainer}>
          {loading
            ? null
            : feeds.map((f) => (
                <FeedCard
                  key={f.feedId}
                  id={String(f.feedId)}
                  imageSrc={f.imageUrl}
                  imageAlt={`피드 이미지 ${f.feedId}`}
                  timeLabel={transformDate(f.createdAt)}
                  tags={[...f.hashtags]}
                  content={f.review}
                  variant="others"
                  liked={f.liked}
                  likeCount={f.likeCount}
                />
              ))}
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
