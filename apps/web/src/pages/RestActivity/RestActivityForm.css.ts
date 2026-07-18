import { colors, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const header = style({
  position: 'relative',
  zIndex: 2,
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  padding: 'calc(20px + var(--safe-area-top)) calc(32px + var(--safe-area-right)) 20px calc(32px + var(--safe-area-left))'
});

export const content = style({
  position: 'relative',
  zIndex: 2,
  width: '100%',
  minHeight: 'calc(100dvh - 112px)',
  display: 'flex',
  flexDirection: 'column',
  padding: '0 0 188px'
});

export const heroText = style({
  width: '100%',
  padding: '0 36px'
});

export const uploadArea = style({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  marginTop: 32,
  padding: '0 24px'
});

export const formStack = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 32,
  marginTop: 24
});

export const input = style({
  width: 'calc(100vw - 64px)',
  maxWidth: 329
});

export const tagSection = style({
  width: 'calc(100vw - 64px)',
  maxWidth: 329,
  display: 'flex',
  flexDirection: 'column',
  gap: 10
});

export const tagList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
  width: '100%',
  padding: '0 4px'
});

export const tag = style({
  ...typography.bodyNormalB,
  color: colors.textPrimary,
  whiteSpace: 'nowrap'
});

export const visibilityRow = style({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  padding: 0,
  pointerEvents: 'auto'
});

export const visibilityLabel = style({
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap'
});

export const footer = style({
  position: 'fixed',
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 3,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 24,
  justifyContent: 'center',
  padding: '64px calc(32px + var(--safe-area-right)) max(32px, var(--safe-area-bottom)) calc(32px + var(--safe-area-left))',
  background: 'linear-gradient(to bottom, rgba(26, 24, 20, 0) 0%, #1A1814 46.767%, #1A1814 100%)',
  pointerEvents: 'none'
});
