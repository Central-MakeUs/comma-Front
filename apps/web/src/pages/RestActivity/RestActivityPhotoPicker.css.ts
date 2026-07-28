import { colors } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const screen = style({
  position: 'relative',
  width: '100%',
  minHeight: '100dvh',
  overflowX: 'hidden',
  color: colors.textPrimary,
  background: colors.backgroundPrimary
});

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
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gridAutoRows: 'calc((var(--app-width) - 54px) / 3)',
  gap: 3,
  marginTop: 28,
  paddingBottom: 'max(40px, var(--safe-area-bottom))'
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

export const hiddenInput = style({
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap'
});
