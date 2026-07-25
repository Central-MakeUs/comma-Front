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
  backgroundColor: colors.backgroundFill
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
