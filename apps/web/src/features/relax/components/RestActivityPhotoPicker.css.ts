import { colors } from '@comma/design-system';
import { keyframes, style } from '@vanilla-extract/css';
import * as layoutStyles from '../../../shared/components/layout/layout.css';

export const screen = style([
  layoutStyles.scrollScreen,
  {
    height: '100svh',
    color: colors.textPrimary,
    background: colors.backgroundPrimary
  }
]);

export const header = style({
  position: 'relative',
  zIndex: 2,
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  padding:
    'calc(20px + var(--safe-area-top)) calc(32px + var(--safe-area-right)) 20px calc(32px + var(--safe-area-left))'
});

export const content = style({
  position: 'relative',
  zIndex: 2,
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  padding: '32px 24px 0'
});

export const photoGrid = style({
  position: 'relative',
  zIndex: 2,
  width: '100%',
  marginTop: 28,
  paddingBottom: 'max(40px, var(--safe-area-bottom))'
});

export const virtualPhotoTile = style({
  position: 'absolute',
  top: 0,
  left: 0
});

export const cameraTile = style({
  width: '100%',
  height: '100%',
  display: 'grid',
  placeItems: 'center',
  border: 0,
  padding: 0,
  background: 'rgba(26, 24, 20, 0.33)',
  backdropFilter: 'blur(2px)',
  WebkitBackdropFilter: 'blur(2px)',
  color: colors.iconPrimary,
  cursor: 'pointer'
});

export const photoTile = style({
  width: '100%',
  height: '100%',
  border: 0,
  padding: 0,
  overflow: 'hidden',
  background: colors.backgroundPrimary,
  cursor: 'pointer'
});

export const photoTileImage = style({
  width: '100%',
  height: '100%',
  display: 'block',
  objectFit: 'cover'
});

export const emptyPhotoTile = style({
  width: '100%',
  height: '100%',
  background: colors.backgroundPrimary
});

const skeletonPulse = keyframes({
  '0%': {
    opacity: 0.36
  },
  '50%': {
    opacity: 0.72
  },
  '100%': {
    opacity: 0.36
  }
});

export const photoSkeletonTile = style({
  width: '100%',
  height: '100%',
  background: 'rgba(252, 252, 252, 0.14)',
  boxShadow: 'inset -2px 0 18px rgba(255, 255, 255, 0.08)',
  animation: `${skeletonPulse} 1200ms ease-in-out infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none'
    }
  }
});

export const hiddenInput = style({
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap'
});
