import { colors } from '@comma/design-system';
import { keyframes, style } from '@vanilla-extract/css';

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

const skeletonPulse = keyframes({
  '0%': {
    opacity: 0.42
  },
  '50%': {
    opacity: 0.8
  },
  '100%': {
    opacity: 0.42
  }
});

const skeletonBase = style({
  borderRadius: 999,
  background: 'rgba(252, 252, 252, 0.22)',
  boxShadow: 'inset -2px 0 18px rgba(255, 255, 255, 0.16)',
  animation: `${skeletonPulse} 1200ms ease-in-out infinite`
});

export const skeletonContainer = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

export const skeletonProgress = style({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  gap: 4,
  marginTop: 36
});

export const skeletonProgressFill = style([
  skeletonBase,
  {
    width: 163,
    height: 2,
    background: 'rgba(252, 252, 252, 0.76)'
  }
]);

export const skeletonProgressTrack = style([
  skeletonBase,
  {
    width: 163,
    height: 2,
    background: 'rgba(252, 252, 252, 0.22)'
  }
]);

export const skeletonQuestion = style({
  width: 'calc(100% - 126px)',
  marginTop: 64,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start'
});

export const skeletonStep = style([
  skeletonBase,
  {
    width: 38,
    height: 16,
    marginBottom: 18
  }
]);

export const skeletonTitle = style([
  skeletonBase,
  {
    width: 214,
    height: 34,
    marginBottom: 48,
    borderRadius: 8
  }
]);

export const skeletonOption = style([
  skeletonBase,
  {
    width: '100%',
    height: 60,
    marginBottom: 8,
    background: 'rgba(252, 252, 252, 0.18)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)'
  }
]);

export const navigation = style({
  position: 'absolute',
  left: '50%',
  bottom: 'max(40px, var(--safe-area-bottom))',
  zIndex: 3,
  transform: 'translateX(-50%)'
});
