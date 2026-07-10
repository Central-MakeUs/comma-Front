import { colors, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const gaugeBar = style({
  backgroundColor: colors.lineSecondary,
  width: 120,
  height: 4,
  borderRadius: 100
});

export const gaugeBarInner = style({
  backgroundColor: colors.textPrimary,
  height: 4,
  borderRadius: 100
});

export const gaugeText = style({
  ...typography.bodyNormalR,
  color: colors.textTertiary,
  marginLeft: 16
});
