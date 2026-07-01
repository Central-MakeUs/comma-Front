import type { ComponentPropsWithoutRef } from 'react';
import { FeedImage } from '../FeedImage';
import { Icon } from '../Icon';
import {
  body,
  contentText,
  feedCard,
  likeRow,
  metaRow,
  metaText,
  secondaryMetaText,
  tagsText
} from './FeedCard.css';

export type FeedCardVariant = 'others' | 'my';

export type FeedCardProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'content'> & {
  variant?: FeedCardVariant;
  imageSrc?: string;
  imageAlt?: string;
  imageHeart?: boolean;
  title?: string;
  timeLabel?: string;
  dateLabel?: string;
  content?: string;
  tags?: string[];
  likeCount?: number;
  liked?: boolean;
};

function formatTags(tags: string[]): string {
  return tags.map((tag) => (tag.startsWith('#') ? tag : `#${tag}`)).join('  ');
}

export function FeedCard({
  variant = 'others',
  imageSrc,
  imageAlt,
  imageHeart = false,
  title = '꿈꾸는 소녀',
  timeLabel = '3분 전',
  dateLabel = '2026. 07. 23',
  content = '오랜만에 하늘 보면서 숨 쉬니까 좋네요',
  tags = ['한강', '힐링'],
  likeCount = 12,
  liked = true,
  className,
  ...divProps
}: FeedCardProps) {
  const rootClassName = [feedCard, className].filter(Boolean).join(' ');
  const tagsLabel = formatTags(tags);

  return (
    <div className={rootClassName} {...divProps}>
      <FeedImage heart={imageHeart} imageAlt={imageAlt} imageSrc={imageSrc} />
      <div className={body}>
        <div className={metaRow}>
          {variant === 'my' ? (
            <>
              <span className={metaText}>{dateLabel}</span>
              <span className={likeRow}>
                <Icon height={18} name="heart" variant={liked ? 'on' : 'off'} width={18} />
                <span>{likeCount}</span>
              </span>
            </>
          ) : (
            <>
              <span className={metaText}>{title}</span>
              <span className={secondaryMetaText}>{timeLabel}</span>
            </>
          )}
        </div>
        <p className={contentText}>{content}</p>
        {tagsLabel.length > 0 ? <p className={tagsText}>{tagsLabel}</p> : null}
      </div>
    </div>
  );
}
