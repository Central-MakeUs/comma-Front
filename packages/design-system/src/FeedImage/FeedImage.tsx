import type { ComponentPropsWithoutRef, MouseEventHandler } from 'react';
import { designAssets } from '../assets';
import { Icon } from '../Icon';
import { feedImage, heartIcon, image } from './FeedImage.css';


export type FeedImageProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'onClick'> & {
  imageSrc?: string;
  imageAlt?: string;
  heart?: boolean;
  onClick?: MouseEventHandler<HTMLSpanElement>;
};

export function FeedImage({
  imageSrc = designAssets.feed.image.src,
  imageAlt = '',
  heart = false,
  className,
  onClick,
  ...divProps
}: FeedImageProps) {
  const rootClassName = [feedImage, className].filter(Boolean).join(' ');

  return (
    <div className={rootClassName} {...divProps}>
      <img alt={imageAlt} className={image} src={imageSrc} />
      <span aria-hidden="true" className={heartIcon} onClick={onClick}>
        <Icon height={32} name="heart" variant={heart ? 'on' : 'off'} width={32} />
      </span>
    </div>
  );
}
