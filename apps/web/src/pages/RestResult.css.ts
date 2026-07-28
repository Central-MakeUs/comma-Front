import { colors, radii, shadows, typography } from '@comma/design-system';
import { globalStyle, style } from '@vanilla-extract/css';

export const container = style({
  width: '100%',
  height: '100dvh',
  overflow: 'hidden',
  boxSizing: 'border-box',
  position: 'relative',
  isolation: 'isolate',
  background: colors.backgroundPrimary
});

globalStyle(`${container} > :not([aria-hidden="true"])`, {
  position: 'relative',
  zIndex: 2
});

export const backgroundImage = style({
  position: 'absolute',
  inset: 0,
  zIndex: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover'
});

export const backgroundOverlay = style({
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  background: 'rgba(26, 24, 20, 0.5)',
  backdropFilter: 'blur(5px)',
  WebkitBackdropFilter: 'blur(5px)'
});

export const title = style({
  ...typography.titleR,
  color: colors.textPrimary,
  marginBottom: 4
});

export const subTitle = style({
  ...typography.bodyReadingR,
  color: colors.textTertiary,
  marginBottom: 64
});

export const imageUploadStyle = style({
  selectors: {
    '&::after': {
      content: '',
      position: 'absolute',
      inset: 0,
      borderRadius: 'inherit',
      zIndex: 1,
      background: 'linear-gradient(rgba(17, 17, 17, 0) 0%, rgba(17, 17, 17, 0.66) 100%)',
      boxShadow: 'inset 0 4px 10px 0 rgba(255, 255, 255, 0.2), 0 4px 40px 0 rgba(0, 0, 0, 0.2)'
    }
  }
});

export const dot = style({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: 'rgba(252, 252, 252, 0.15)'
});

export const ctaButtonStyle = style({
  width: '100%',
  maxWidth: 329,
  color: colors.textPrimary,
  pointerEvents: 'auto'
});

export const footer = style({
  position: 'fixed',
  width: '100%',
  maxWidth: 'var(--app-max-width)',
  right: 'auto',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 3,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding:
    '64px calc(32px + var(--safe-area-right)) max(32px, var(--safe-area-bottom)) calc(32px + var(--safe-area-left))',
  background: 'linear-gradient(to bottom, rgba(26, 24, 20, 0) 0%, #1A1814 46.767%, #1A1814 100%)',
  pointerEvents: 'none'
});

export const navStyle = style({
  position: 'absolute',
  bottom: 'max(40px, var(--safe-area-bottom))',
  left: '50%',
  transform: 'translateX(-50%)',
  borderRadius: radii.pill,
  boxShadow: `${shadows.glassInsetStrong}, 0 8px 24px rgb(0 0 0 / 18%)`,
  fontFamily: typography.bodyNormalR.fontFamily
});

export const imageNumStyle = style({
  ...typography.engNum,
  color: colors.textPrimary
});

export const imageText = style({
  ...typography.headlineR,
  color: colors.textSecondary
});

export const modalContainer = style({
  width: 'calc(100% - 64px)',
  height: 284,
  backgroundColor: 'rgba(194, 191, 188, 0.1)',
  boxShadow: 'inset -2px 0 40px 0 rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxSizing: 'border-box',
  padding: '24px 20px',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 36
});

export const modalTitle = style({
  ...typography.headlineB,
  color: colors.textPrimary,
  marginBottom: 8
});

export const modalDesc = style({
  ...typography.bodyNormalR,
  color: colors.textPrimary
});

const buttonBase = style({
  width: '100%',
  height: 60
});

export const cancleBtn = style([
  buttonBase,
  {
    marginBottom: 8,
    background: 'transparent',
    border: '1px solid rgba(194, 191, 188, 0.66)',
    boxShadow: 'none'
  }
]);

export const confirmBtn = style([
  buttonBase,
  {
    boxShadow: 'none'
  }
]);
