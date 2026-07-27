import { FeedCard } from '@comma/design-system';
import type { feedInfo } from '../../types/feed';
import { transformDate } from '../../utils/transformDate';
import * as styles from './Archive.css';

type ArchiveFeedListProps = {
  items: readonly feedInfo[];
};

export function ArchiveFeedList({ items }: ArchiveFeedListProps) {
  return (
    <section className={styles.list} aria-label="내 쉼표 1열 목록">
      {items.map((item) => (
        <FeedCard
          className={styles.listCard}
          content={item.review}
          dateLabel={transformDate(item.createdAt)}
          imageAlt={`피드 이미지 ${item.feedId}`}
          imageClassName={styles.listImage}
          imageHeart
          imageSrc={item.imageUrl}
          key={item.feedId}
          liked={item.isLiked}
          likeCount={item.likeCount}
          tags={[...item.hashtags]}
          variant="my"
        />
      ))}
    </section>
  );
}
