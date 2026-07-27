import { FeedCard, NavigationBar } from '@comma/design-system';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeeds, postLikes } from '../../apis/feed';
import type { loadingState } from '../../types/api';
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

  const [feeds, setFeeds] = useState<feedInfo[]>([]);
  const [state, setState] = useState<loadingState>('loading');

  const onHeartClick = async (feedId: number, isLiked: boolean) => {
    try {
      const res = await postLikes({ feedId });
      if (res.success) {
        setFeeds((prev) =>
          prev.map((feed) =>
            feed.feedId === feedId
              ? {
                  ...feed,
                  isLiked: !feed.isLiked,
                  likeCount: isLiked ? feed.likeCount - 1 : feed.likeCount + 1
                }
              : feed
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleInit = async () => {
      let res: Awaited<ReturnType<typeof getFeeds>> | undefined;

      try {
        let cnt = 0;
        do {
          res = await getFeeds({
            mood: moods[currentFeel],
            timeBudget: times[currentBody],
            cursor: cnt,
            size: 5
          });

          if (res?.success) {
            setFeeds((prev) => [...prev, ...(res?.data?.items ?? [])]);
            if (res?.data?.hasNext) cnt += 5;
          } else setState('error');
        } while (res?.data?.hasNext);

        if (state !== 'error' && feeds.length) setState('success');
        else if (feeds.length === 0) setState('empty');
      } catch (error) {
        console.error(error);
        setState('error');
        alert('피드 조회 오류 발생');
      }
    };

    handleInit();
  }, [currentFeel, currentBody, state, feeds.length]);

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
          {state === 'loading'
            ? /* TODO: error와 empty 시 화면 UI 반영 */
              null
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
                  liked={f.isLiked}
                  likeCount={f.likeCount}
                  onHeartClick={() => onHeartClick(f.feedId, f.isLiked)}
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
