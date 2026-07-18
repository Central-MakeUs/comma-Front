import { colors, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const container = style({
  width: '100%',
  height: '100dvh',
  overflow: 'hidden',
  backgroundColor: colors.backgroundPrimary,
  display: 'flex',
  flexDirection: 'column'
});

export const headerContainer = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  boxSizing: 'border-box',
  padding: '16px 32px',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${colors.lineTertiary}`
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
  bottom: 40,
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
  gap: 40
});

export const chipModal = style({
  position: 'fixed',
  width: 180,
  borderRadius: 20,
  backgroundColor: 'rgba(50, 46, 41, 0.66)',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  ...typography.bodyNormalR,
  color: colors.textTertiary,
  zIndex: 10
});
