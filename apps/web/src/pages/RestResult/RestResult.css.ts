import { colors, radii, shadows, typography } from '@comma/design-system';
import { globalStyle, style, styleVariants } from '@vanilla-extract/css';

export const container = style({
  width: '100%',
  height: '100dvh',
  overflow: 'hidden',
  boxSizing: 'border-box',
  position: 'relative',
  isolation: 'isolate',
  background: colors.backgroundPrimary
});

globalStyle(`:where(${container} > :not([aria-hidden="true"]))`, {
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

export const gradient = style({
  position: 'absolute',
  top: 254,
  bottom: -2,
  width: '100%',
  background: 'linear-gradient(0deg, rgba(17, 17, 17, 0.66) 0%, rgba(17, 17, 17, 0) 100%)',
  zIndex: -1
});

export const header = style({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  boxSizing: 'border-box',
  padding:
    'calc(20px + var(--safe-area-top)) calc(32px + var(--safe-area-right)) 20px calc(32px + var(--safe-area-left))'
});

export const titleContainer = style({
  width: '100%',
  boxSizing: 'border-box',
  paddingLeft: 32,
  paddingRight: 32,
  display: 'flex',
  flexDirection: 'column'
});

const dotContainerBase = {
  width: 88,
  height: 8,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  margin: '0 auto'
} as const;

export const dotContainer = styleVariants({
  compact: { ...dotContainerBase, marginTop: 12, marginBottom: 0 },
  normal: { ...dotContainerBase, marginTop: 16, marginBottom: 24 }
});
