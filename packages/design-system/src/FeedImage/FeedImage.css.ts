import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const feedImage = style({
  position: 'relative',
  width: '100%',
  height: 'clamp(360px, 58dvh, 499px)',
  overflow: 'hidden',
  background: vars.color.backgroundFill
});

export const image = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  display: 'block',
  objectFit: 'cover'
});

export const heartIcon = style({
  position: 'absolute',
  right: 24,
  bottom: 24,
  width: 32,
  height: 32,
  display: 'grid',
  placeItems: 'center',
  color: vars.color.iconPrimary
});
