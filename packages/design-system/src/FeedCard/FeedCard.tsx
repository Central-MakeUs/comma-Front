import type { ComponentPropsWithoutRef, MouseEventHandler } from 'react';
import { useState } from 'react';
import { FeedImage } from '../FeedImage';
import { Icon } from '../Icon';
import {
  body,
  contentText,
  feedCard,
  likeRow,
  metaRow,
  metaText,
  modal,
  modalOverlay,
  modalText,
  secondaryMetaText,
  tagsText
} from './FeedCard.css';

export type FeedCardVariant = 'others' | 'my';

export type FeedCardProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'content'> & {
  variant?: FeedCardVariant;
  imageSrc?: string;
  imageAlt?: string;
  imageHeart?: boolean;
  imageClassName?: string;
  title?: string;
  timeLabel?: string;
  dateLabel?: string;
  content?: string;
  tags?: string[];
  likeCount?: number;
  liked?: boolean;
  onHeartClick?: MouseEventHandler<HTMLSpanElement>;
  onReportClick?: MouseEventHandler<HTMLButtonElement>;
  onBlockClick?: MouseEventHandler<HTMLButtonElement>;
};

function formatTags(tags: string[]): string {
  return tags.map((tag) => (tag.startsWith('#') ? tag : `#${tag}`)).join('  ');
}

export function FeedCard({
  variant = 'others',
  imageSrc,
  imageAlt,
  imageHeart = false,
  imageClassName,
  title = '꿈꾸는 소녀',
  timeLabel = '3분 전',
  dateLabel = '2026. 07. 23',
  content = '오랜만에 하늘 보면서 숨 쉬니까 좋네요',
  tags = ['한강', '힐링'],
  likeCount = 12,
  liked = true,
  onHeartClick,
  onReportClick,
  onBlockClick,
  className,
  ...divProps
}: FeedCardProps) {
  const rootClassName = [feedCard, className].filter(Boolean).join(' ');
  const tagsLabel = formatTags(tags);
  const isOther = variant === 'others' && onReportClick && onBlockClick;
  const [clicked, setClicked] = useState(false);

  return (
    <div className={rootClassName} {...divProps}>
      <FeedImage
        className={imageClassName}
        heart={imageHeart}
        imageAlt={imageAlt}
        imageSrc={imageSrc}
        onClick={onHeartClick}
      />
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          {tagsLabel.length > 0 ? <p className={tagsText}>{tagsLabel}</p> : null}
          {isOther ? <Icon name="dots" onClick={() => setClicked(true)} /> : null}
          {clicked ? (
            <>
              <button
                aria-label="닫기"
                className={modalOverlay}
                onClick={() => setClicked(false)}
                type="button"
              />
              <div className={modal}>
                <button
                  className={modalText}
                  onClick={(e) => {
                    setClicked(false);
                    onReportClick?.(e);
                  }}
                  type="button"
                >
                  신고
                </button>
                <button
                  className={modalText}
                  onClick={(e) => {
                    setClicked(false);
                    onBlockClick?.(e);
                  }}
                  type="button"
                >
                  차단
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
