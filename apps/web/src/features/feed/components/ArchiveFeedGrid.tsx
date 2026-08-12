import { FeedBadook } from '@comma/design-system';
import { transformDate } from '../../../shared/lib/transformDate';
import type { FeedInfo } from '../model/feed.types';
import * as styles from './Archive.css';

type ArchiveFeedGridProps = {
  items: readonly FeedInfo[];
};

export function ArchiveFeedGrid({ items }: ArchiveFeedGridProps) {
  if (!items.length) {
    return (
      <section className={styles.loadingWrapper} aria-label="내 쉼표 1열 목록">
        <span className={styles.alertText}>쉼표를 추가해보세요.</span>
      </section>
    );
  }

  return (
    <section className={styles.grid} aria-label="내 쉼표 2열 그리드">
      {items.map((item) => (
        <FeedBadook
          content={item.review}
          dateLabel={transformDate(item.createdAt)}
          imageAlt={`피드 이미지 ${item.feedId}`}
          imageSrc={item.imageUrl}
          key={item.feedId}
          liked={item.isLiked}
          likeCount={item.likeCount}
          tags={[...item.hashtags]}
        />
      ))}
    </section>
  );
}
