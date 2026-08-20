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

  useEffect(() => {
    setHasError(false);
  }, [imageSrc, state]);

  const hasImage = state === 'exist' && Boolean(imageSrc) && !hasError;
  const isVideo = hasImage && VIDEO_SRC_PATTERN.test(imageSrc ?? '');
  const visualState = hasImage ? 'exist' : state === 'exist' ? 'existEmpty' : state;
  const buttonClassName = [imageUpload, imageUploadState[visualState], className]
    .filter(Boolean)
    .join(' ');

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
          />
        ) : (
          <img alt={imageAlt} className={image} onError={() => setHasError(true)} src={imageSrc} />
        )
      ) : null}
    </button>
  );
}
