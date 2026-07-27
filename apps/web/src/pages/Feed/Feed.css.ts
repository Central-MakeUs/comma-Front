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

export const headerContainer = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  boxSizing: 'border-box',
  padding: '16px 32px',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${colors.lineTertiary}`,
  backgroundColor: colors.backgroundFill,
  overflow: 'hidden',
  transition:
    'max-height 220ms ease, padding-top 220ms ease, padding-bottom 220ms ease, opacity 180ms ease, transform 220ms ease'
});

export const headerContainerVisible = style({
  maxHeight: 96,
  opacity: 1,
  transform: 'translateY(0)'
});

export const headerContainerHidden = style({
  maxHeight: 0,
  paddingTop: 0,
  paddingBottom: 0,
  opacity: 0,
  transform: 'translateY(-12px)',
  borderBottomColor: 'transparent'
});

export const headerText = style({
  ...typography.bodyReadingR,
  color: colors.textTertiary
});

export const headerLink = style({
  ...typography.bodyReadingR,
  color: colors.textPrimary,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
  textDecoration: 'none'
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
  gap: 40,
  paddingBottom: 'calc(144px + var(--safe-area-bottom))'
});
