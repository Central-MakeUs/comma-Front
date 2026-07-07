import { FeedBadook } from '@comma/design-system';
import type { ArchiveItem } from './Archive.constants';
import * as styles from './Archive.css';

type ArchiveFeedGridProps = {
  items: readonly ArchiveItem[];
};

export function ArchiveFeedGrid({ items }: ArchiveFeedGridProps) {
  return (
    <section className={styles.grid} aria-label="내 쉼표 2열 그리드">
      {items.map((item) => (
        <FeedBadook
          content={item.content}
          dateLabel={item.dateLabel}
          imageAlt={item.imageAlt}
          imageSrc={item.imageSrc}
          key={item.id}
          liked={item.liked}
          likeCount={item.likeCount}
          tags={[...item.tags]}
        />
      ))}
    </section>
  );
}
