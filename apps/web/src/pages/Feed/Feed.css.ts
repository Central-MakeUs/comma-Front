import { colors, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const container = style({
  width: '100%',
  height: '100dvh',
  overflow: 'hidden',
  backgroundColor: colors.backgroundPrimary,
  display: 'flex',
  flexDirection: 'column',
  paddingTop: 'var(--safe-area-top)'
});

export const title = style({
  width: '100%',
  padding: 16,
  textAlign: 'center',
  ...typography.headingB,
  color: colors.textPrimary
});

export const navBarStyle = style({
  position: 'fixed',
  bottom: 'max(40px, var(--safe-area-bottom))',
  left: '50%',
  transform: 'translateX(-50%)'
});

export const secondChip = style({
  width: 'fit-content'
});

export const scrollContainer = style({
  width: '100%',
  boxSizing: 'border-box',
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  gap: 'clamp(24px, 4.69dvh, 40px)',
  paddingBottom: 'calc(144px + var(--safe-area-bottom))'
});

export const alertText = style({
  ...typography.bodyReadingR,
  color: colors.textTertiary,
  margin: 'auto'
});

export const toast = style({
  position: 'fixed',
  bottom: 120,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 3
})
