import { FeedCard } from '@comma/design-system';
import type { ArchiveItem } from './Archive.constants';
import * as styles from './Archive.css';

type ArchiveFeedListProps = {
  items: readonly ArchiveItem[];
};

export function ArchiveFeedList({ items }: ArchiveFeedListProps) {
  return (
    <section className={styles.list} aria-label="내 쉼표 1열 목록">
      {items.map((item) => (
        <FeedCard
          className={styles.listCard}
          content={item.content}
          dateLabel={item.dateLabel}
          imageAlt={item.imageAlt}
          imageClassName={styles.listImage}
          imageHeart
          imageSrc={item.imageSrc}
          key={item.id}
          liked={item.liked}
          likeCount={item.likeCount}
          tags={[...item.tags]}
          variant="my"
        />
      ))}
    </section>
  );
}
