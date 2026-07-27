import { colors } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const page = style({
  minHeight: '100dvh',
  width: '100%',
  overflow: 'hidden',
  background: colors.backgroundPrimary
});

export const screen = style({
  position: 'relative',
  width: '100%',
  minHeight: '100dvh',
  overflow: 'hidden',
  color: colors.textPrimary,
  backgroundColor: 'lightgray'
});

export const backgroundImage = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: 0
});

export const dimOverlay = style({
  display: 'none'
});

export const topGradient = style({
  display: 'none'
});

export const bottomGradient = style({
  display: 'none'
});

export const content = style({
  position: 'relative',
  zIndex: 2,
  minHeight: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: 'calc(48px + var(--safe-area-top))',
  paddingBottom: 'calc(132px + var(--safe-area-bottom))'
});

export const header = style({
  width: '100%',
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

export const logo = style({
  width: 110,
  height: 24,
  display: 'block'
});

export const progress = style({
  marginTop: 36
});

export const question = style({
  marginTop: 64
});

export const navigation = style({
  position: 'absolute',
  left: '50%',
  bottom: 'max(40px, var(--safe-area-bottom))',
  zIndex: 3,
  transform: 'translateX(-50%)'
});
