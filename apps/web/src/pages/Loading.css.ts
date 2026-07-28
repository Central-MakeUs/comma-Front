import { colors, typography } from '@comma/design-system';
import { globalStyle, style } from '@vanilla-extract/css';

export const container = style({
  position: 'relative',
  isolation: 'isolate',
  backgroundColor: '#1A1814',
  width: '100%',
  height: '100dvh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: 'var(--safe-area-top)',
  paddingBottom: 'var(--safe-area-bottom)',
  paddingLeft: 32,
  paddingRight: 32,
  boxSizing: 'border-box'
});

globalStyle(`${container} > :not([aria-hidden="true"])`, {
  position: 'relative',
  zIndex: 1
});

export const backgroundImage = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: 0
});

export const title = style({
  ...typography.titleR,
  color: colors.textPrimary
});

export const desc = style({
  ...typography.bodyReadingR,
  color: colors.textTertiary,
  marginTop: 16
});
