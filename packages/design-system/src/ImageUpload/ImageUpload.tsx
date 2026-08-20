import type { ComponentPropsWithoutRef } from 'react';
import { useEffect, useState } from 'react';
import { VIDEO_SRC_PATTERN } from '../lib/media';
import { image, imageUpload, imageUploadState, plusIcon, selectText } from './ImageUpload.css';

export type ImageUploadState = 'none' | 'select' | 'exist';

export type ImageUploadProps = Omit<ComponentPropsWithoutRef<'button'>, 'type'> & {
  state?: ImageUploadState;
  imageSrc?: string;
  imageAlt?: string;
  type?: 'button' | 'submit' | 'reset';
};

const defaultAriaLabels: Record<ImageUploadState, string> = {
  none: '사진 추가',
  select: '사진 선택',
  exist: '사진 변경'
};

export function ImageUpload({
  state = 'none',
  imageSrc,
  imageAlt = '',
  type = 'button',
  className,
  style,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...buttonProps
}: ImageUploadProps) {
  const [hasError, setHasError] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset error state when imageSrc or state changes so a previously broken image can retry
  useEffect(() => {
    setHasError(false);
  }, [imageSrc, state]);

  const hasImage = state === 'exist' && Boolean(imageSrc) && !hasError;
  const isVideo = hasImage && VIDEO_SRC_PATTERN.test(imageSrc ?? '');
  const visualState = hasImage ? 'exist' : state === 'exist' ? 'existEmpty' : state;
  const buttonClassName = [imageUpload, imageUploadState[visualState], className]
    .filter(Boolean)
    .join(' ');

  // iOS WebKit renders <video> in its own hardware compositing layer, which can ignore
  // an ancestor's clip-path/overflow:hidden. Keep clip-path on the button too (it still
  // shapes the ::after overlay and the button's own box), and also apply it directly to
  // the media element so the video itself is clipped if WebKit honors it there.
  const { clipPath, WebkitClipPath } = style ?? {};
  const mediaStyle = clipPath || WebkitClipPath ? { clipPath, WebkitClipPath } : undefined;

  return (
    <button
      aria-label={ariaLabelledBy ? ariaLabel : (ariaLabel ?? defaultAriaLabels[state])}
      aria-labelledby={ariaLabelledBy}
      className={buttonClassName}
      style={style}
      type={type}
      {...buttonProps}
    >
      {state === 'none' ? <span aria-hidden="true" className={plusIcon} /> : null}
      {state === 'select' ? <span className={selectText}>사진을 선택하세요</span> : null}
      {hasImage ? (
        isVideo ? (
          <video
            autoPlay
            className={image}
            loop
            muted
            onError={() => setHasError(true)}
            playsInline
            src={imageSrc}
            style={mediaStyle}
          />
        ) : (
          <img
            alt={imageAlt}
            className={image}
            onError={() => setHasError(true)}
            src={imageSrc}
            style={mediaStyle}
          />
        )
      ) : null}
    </button>
  );
}
