import { style, styleVariants } from '@vanilla-extract/css';

export const overlay = style({
  position: 'fixed',
  inset: 0,
  left: '50%',
  zIndex: 100,
  width: '100%',
  maxWidth: 'var(--app-max-width, 440px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transform: 'translateX(-50%)',
  overscrollBehavior: 'none'
});

export const backdrop = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  border: 0,
  padding: 0,
  cursor: 'default'
});

export const backdropTone = styleVariants({
  dim: { background: 'rgba(26, 24, 20, 0.66)' },
  soft: { background: 'rgba(26, 24, 20, 0.3)' },
  transparent: { background: 'transparent' }
});

export const surface = style({
  position: 'relative',
  zIndex: 1,
  outline: 0
});
