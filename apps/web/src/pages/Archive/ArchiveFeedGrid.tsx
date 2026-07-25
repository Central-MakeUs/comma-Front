import { FeedBadook } from '@comma/design-system';
import * as styles from './Archive.css';
import { feedInfo } from '../../types/feed';
import { transformDate } from '../../utils/transformDate';

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
          /* TODO: liked 및 likeCount 반영 */
          liked={false}
          likeCount={0}
          tags={[...item.hashtags]}
        />
      ))}
    </section>
  );
}
