import { colors, radii, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const page = style({
  width: '100%',
  height: '100dvh',
  overflowY: 'auto',
  overflowX: 'hidden',
  overscrollBehaviorY: 'contain',
  WebkitOverflowScrolling: 'touch',
  background: colors.backgroundPrimary
});

export const screen = style({
  position: 'relative',
  width: '100%',
  minHeight: '100%',
  overflowX: 'hidden',
  color: colors.textPrimary,
  background: colors.backgroundPrimary
});

export const backgroundImage = style({
  position: 'absolute',
  inset: 0,
  zIndex: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover'
});

export const dimOverlay = style({
  position: 'absolute',
  inset: 0,
  zIndex: 0,
  display: 'none',
  background: 'rgba(26, 24, 20, 0.5)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  pointerEvents: 'none'
});

export const dimOverlayVisible = style({
  display: 'block'
});

export const topGradient = style({
  position: 'absolute',
  top: 0,
  right: 0,
  left: 0,
  zIndex: 0,
  height: 120,
  background: 'linear-gradient(180deg, rgba(17, 17, 17, 0.66) 0%, rgba(17, 17, 17, 0) 100%)',
  pointerEvents: 'none'
});

export const bottomGradient = style({
  position: 'absolute',
  top: 254,
  right: 0,
  bottom: -2,
  left: 0,
  zIndex: 0,
  background: 'linear-gradient(0deg, rgba(17, 17, 17, 0.66) 0%, rgba(17, 17, 17, 0) 100%)',
  pointerEvents: 'none'
});

export const iconButton = style({
  width: 32,
  height: 32,
  display: 'inline-grid',
  placeItems: 'center',
  border: 0,
  borderRadius: radii.pill,
  padding: 4,
  background: 'transparent',
  color: colors.iconPrimary,
  cursor: 'pointer'
});

export const title = style({
  ...typography.titleR,
  margin: 0,
  color: colors.textPrimary
});

export const description = style({
  ...typography.bodyReadingR,
  margin: '4px 0 0',
  color: colors.textTertiary
});

export const upload = style({
  width: 'min(345px, calc(var(--app-width) - 48px))',
  height: 'min(438px, calc((var(--app-width) - 48px) * 1.27))',
  borderRadius: 100
});

export const doneButton = style({
  width: '100%',
  maxWidth: 329,
  pointerEvents: 'auto'
});
