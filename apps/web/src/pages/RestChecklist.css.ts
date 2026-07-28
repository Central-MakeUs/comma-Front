import { colors, questionTopGap } from '@comma/design-system';
import { keyframes, style } from '@vanilla-extract/css';

const topInset = 'clamp(40px, 5.63dvh, 56px)';
const logoToProgressGap = 'clamp(28px, 4.23dvh, 40px)';
const progressToQuestionGap = 'clamp(4px, 1.18dvh, 12px)';
const questionTopAreaGap = 'clamp(8px, 1.64dvh, 18px)';
const navigationBottomGap = 'clamp(28px, 4.69dvh, 40px)';

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
  paddingTop: `calc(${topInset} + var(--safe-area-top))`,
  paddingBottom: `calc(64px + ${navigationBottomGap} + 28px + var(--safe-area-bottom))`
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
  marginTop: logoToProgressGap
});

export const question = style({
  marginTop: progressToQuestionGap,
  vars: {
    [questionTopGap]: questionTopAreaGap
  }
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
  animation: `${skeletonPulse} 1200ms ease-in-out infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none'
    }
  }
});

export const skeletonContainer = style({
  width: '100%',
  maxWidth: 393,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

export const skeletonProgress = style({
  width: 329,
  display: 'flex',
  gap: 4,
  marginTop: logoToProgressGap
});

export const skeletonProgressFill = style([
  skeletonBase,
  {
    flex: 1,
    height: 2,
    background: 'rgba(252, 252, 252, 0.76)'
  }
]);

export const skeletonProgressTrack = style([
  skeletonBase,
  {
    flex: 1,
    height: 2,
    background: 'rgba(252, 252, 252, 0.22)'
  }
]);

export const skeletonQuestion = style({
  width: '100%',
  marginTop: progressToQuestionGap,
  display: 'flex',
  flexDirection: 'column',
  gap: questionTopAreaGap
});

export const skeletonTopArea = style({
  height: 24,
  boxSizing: 'border-box',
  padding: '0 32px'
});

export const skeletonContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 43
});

export const skeletonTitleBlock = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  boxSizing: 'border-box',
  padding: '0 32px',
  alignItems: 'flex-start'
});

export const skeletonStep = style([
  skeletonBase,
  {
    width: 38,
    height: 16
  }
]);

export const skeletonTitle = style([
  skeletonBase,
  {
    width: 214,
    height: 34,
    borderRadius: 8
  }
]);

export const skeletonOptions = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  boxSizing: 'border-box',
  padding: '0 32px'
});

export const skeletonOption = style([
  skeletonBase,
  {
    width: '100%',
    height: 60,
    background: 'rgba(252, 252, 252, 0.18)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)'
  }
]);

export const navigation = style({
  position: 'absolute',
  left: '50%',
  bottom: `max(${navigationBottomGap}, var(--safe-area-bottom))`,
  zIndex: 3,
  transform: 'translateX(-50%)'
});
