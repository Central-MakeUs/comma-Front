import type { ComponentPropsWithoutRef, MouseEventHandler } from 'react';
import { useState } from 'react';
import { FeedImage } from '../FeedImage';
import { useDismissibleLayer } from '../hooks/useDismissibleLayer';
import { Icon } from '../Icon';
import { vars } from '../theme.css';
import {
  actionMenu,
  actionMenuContainer,
  actionMenuItem,
  body,
  contentText,
  feedCard,
  footerRow,
  likeRow,
  metaRow,
  metaText,
  moreButton,
  myContentText,
  myMetaText,
  secondaryMetaText,
  summary,
  tag,
  tagsList
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
  const isOther = variant === 'others' && onReportClick && onBlockClick;
  const [clicked, setClicked] = useState(false);
  const actionMenuContainerRef = useDismissibleLayer<HTMLDivElement>({
    dismissOnScroll: true,
    enabled: clicked,
    onDismiss: () => setClicked(false)
  });

  return (
    <div className={rootClassName} {...divProps}>
      <FeedImage
        className={imageClassName}
        heart={imageHeart}
        imageAlt={imageAlt}
        imageSrc={imageSrc}
        onClick={onHeartClick}
        showHeart={variant !== 'my'}
      />
      <div className={body}>
        <div className={summary}>
          <div className={metaRow}>
            {variant === 'my' ? (
              <>
                <span className={myMetaText}>{dateLabel}</span>
                <span className={likeRow}>
                  <Icon
                    color={vars.color.textTertiary}
                    height={20}
                    name="heart"
                    variant={liked ? 'on' : 'off'}
                    width={20}
                  />
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
          <p className={variant === 'my' ? myContentText : contentText}>{content}</p>
        </div>
        <div className={footerRow}>
          {tags.length > 0 ? (
            <div className={tagsList}>
              {tags.map((tagValue) => (
                <span className={tag} key={tagValue}>
                  {tagValue.startsWith('#') ? tagValue : `#${tagValue}`}
                </span>
              ))}
            </div>
          ) : null}
          {isOther ? (
            <div className={actionMenuContainer} ref={actionMenuContainerRef}>
              <button
                aria-expanded={clicked}
                aria-haspopup="menu"
                aria-label="신고 및 차단 메뉴 열기"
                className={moreButton}
                onClick={() => setClicked((isOpen) => !isOpen)}
                type="button"
              >
                <Icon name="dots" />
              </button>
              {clicked ? (
                <div aria-label="피드 작업" className={actionMenu} role="menu">
                  <button
                    className={actionMenuItem}
                    onClick={(e) => {
                      setClicked(false);
                      onReportClick?.(e);
                    }}
                    role="menuitem"
                    type="button"
                  >
                    신고
                  </button>
                  <button
                    className={actionMenuItem}
                    onClick={(e) => {
                      setClicked(false);
                      onBlockClick?.(e);
                    }}
                    role="menuitem"
                    type="button"
                  >
                    차단
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
