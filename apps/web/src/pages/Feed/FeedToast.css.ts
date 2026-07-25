import { style } from "@vanilla-extract/css";
import { typography, colors } from "@comma/design-system";

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