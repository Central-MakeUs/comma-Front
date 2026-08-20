import type { ComponentPropsWithoutRef, CSSProperties } from 'react';
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
  // an ancestor's clip-path/overflow:hidden. clip-path is kept on the button (shapes the
  // ::after overlay and the button's own box) and on the video/img themselves; a
  // mask-image derived from the same path() is added on the video as a WebKit fallback.
  const { clipPath, WebkitClipPath, width, height } = style ?? {};
  const pathData =
    typeof clipPath === 'string' ? clipPath.match(/^path\(\s*["'](.+)["']\s*\)$/)?.[1] : undefined;
  const maskImage =
    pathData && typeof width === 'number' && typeof height === 'number'
      ? `url("data:image/svg+xml,${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path d="${pathData}" fill="#fff"/></svg>`
        )}")`
      : undefined;
  const videoStyle: CSSProperties = {
    position: 'absolute',
    clipPath,
    WebkitClipPath,
    ...(maskImage
      ? {
          WebkitMaskImage: maskImage,
          maskImage,
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat'
        }
      : undefined)
  };
  const imageStyle: CSSProperties | undefined =
    clipPath || WebkitClipPath ? { clipPath, WebkitClipPath } : undefined;

  return (
    <button
      aria-label={ariaLabelledBy ? ariaLabel : (ariaLabel ?? defaultAriaLabels[state])}
      aria-labelledby={ariaLabelledBy}
      className={buttonClassName}
      style={{ ...style, position: 'relative' }}
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
            style={videoStyle}
          />
        ) : (
          <img
            alt={imageAlt}
            className={image}
            onError={() => setHasError(true)}
            src={imageSrc}
            style={imageStyle}
          />
        )
      ) : null}
    </button>
  );
}
