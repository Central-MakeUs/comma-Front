import { colors, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

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
  maxHeight: 160,
  opacity: 1,
  transform: 'translateY(0)',
  pointerEvents: 'auto'
});

export const headerContainerHidden = style({
  maxHeight: 0,
  paddingTop: 0,
  paddingBottom: 0,
  opacity: 0,
  transform: 'translateY(-12px)',
  borderBottomColor: 'transparent',
  pointerEvents: 'none'
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
