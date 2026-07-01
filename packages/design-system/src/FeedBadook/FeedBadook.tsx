import type { ComponentPropsWithoutRef } from 'react';
import { Icon } from '../Icon';
import { vars } from '../theme.css';
import {
  body,
  contentText,
  dateText,
  feedBadook,
  image,
  imageFrame,
  likeRow,
  metaRow,
  tagsRow
} from './FeedBadook.css';

export type FeedBadookProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'content'> & {
  imageSrc?: string;
  imageAlt?: string;
  dateLabel?: string;
  content?: string;
  tags?: string[];
  likeCount?: number;
  liked?: boolean;
};

function formatTag(tag: string): string {
  return tag.startsWith('#') ? tag : `#${tag}`;
}

export function FeedBadook({
  imageSrc,
  imageAlt = '',
  dateLabel = '2026. 07. 23',
  content = '오랜만에 하늘 보면서 숨 쉬니까 좋네요',
  tags = ['한강', '힐링'],
  likeCount = 12,
  liked = true,
  className,
  ...divProps
}: FeedBadookProps) {
  const rootClassName = [feedBadook, className].filter(Boolean).join(' ');

  return (
    <div className={rootClassName} {...divProps}>
      <div className={imageFrame}>
        {imageSrc ? <img alt={imageAlt} className={image} src={imageSrc} /> : null}
      </div>
      <div className={body}>
        <div className={metaRow}>
          <span className={dateText}>{dateLabel}</span>
          <span className={likeRow}>
            <Icon
              color={vars.color.textTertiary}
              height={16}
              name="heart"
              variant={liked ? 'on' : 'off'}
              width={16}
            />
            <span>{likeCount}</span>
          </span>
        </div>
        <p className={contentText}>{content}</p>
        {tags.length > 0 ? (
          <div className={tagsRow}>
            {tags.map((tag) => (
              <span key={tag}>{formatTag(tag)}</span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
