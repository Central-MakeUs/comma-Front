import type { ComponentPropsWithoutRef } from 'react';
import { designAssets } from '../assets';
import { Icon } from '../Icon';
import { feedImage, heartIcon, image } from './FeedImage.css';

export type FeedImageProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  imageSrc?: string;
  imageAlt?: string;
  heart?: boolean;
};

export function FeedImage({
  imageSrc = designAssets.feed.image.src,
  imageAlt = '',
  heart = false,
  className,
  ...divProps
}: FeedImageProps) {
  const rootClassName = [feedImage, className].filter(Boolean).join(' ');

  return (
    <div className={rootClassName} {...divProps}>
      <img alt={imageAlt} className={image} src={imageSrc} />
      <span aria-hidden="true" className={heartIcon}>
        <Icon height={32} name="heart" variant={heart ? 'on' : 'off'} width={32} />
      </span>
    </div>
  );
}
