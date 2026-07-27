import { FeedBadook } from '@comma/design-system';
import type { feedInfo } from '../../types/feed';
import { transformDate } from '../../utils/transformDate';
import * as styles from './Archive.css';

type ArchiveFeedGridProps = {
  items: readonly feedInfo[];
};

export function ArchiveFeedGrid({ items }: ArchiveFeedGridProps) {
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
