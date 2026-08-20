import { colors, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  paddingTop: 'var(--safe-area-top)'
});

export const header = style({
  position: 'relative',
  zIndex: 2,
  width: '100%',
  flexShrink: 0,
  background: colors.backgroundPrimary
});

export const title = style({
  width: '100%',
  padding: 16,
  textAlign: 'center',
  ...typography.headingB,
  color: colors.textPrimary
});

export const filterRow = style({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  paddingTop: 8,
  paddingBottom: 16,
  paddingLeft: 24,
  paddingRight: 24,
  gap: 8,
  overflowX: 'auto',
  overflowY: 'hidden'
});

export const filterItem = style({
  position: 'relative',
  flexShrink: 0
});

export const secondChip = style({
  width: 'fit-content'
});

export const scrollContainer = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 'clamp(24px, 4.69dvh, 40px)',
  background: colors.backgroundPrimary
});

export const feedList = style({
  width: '100%',
  flexShrink: 0,
  margin: 0,
  padding: 0,
  display: 'grid',
  gap: 'clamp(24px, 4.69dvh, 40px)',
  listStyle: 'none'
});

export const feedListItem = style({
  width: '100%'
});

export const alertText = style({
  ...typography.bodyReadingR,
  color: colors.textTertiary,
  margin: 'auto'
});

export const bottomScrim = style({
  position: 'fixed',
  left: '50%',
  bottom: 0,
  zIndex: 2,
  width: '100%',
  maxWidth: 'var(--app-max-width)',
  height: 'calc(144px + var(--safe-area-bottom))',
  transform: 'translateX(-50%)',
  pointerEvents: 'none',
  background: `linear-gradient(to bottom, rgba(50, 46, 41, 0) 0%, ${colors.backgroundPrimary} 48%, ${colors.backgroundPrimary} 100%)`
});

export const toast = style({
  position: 'fixed',
  bottom: 120,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 3
});
