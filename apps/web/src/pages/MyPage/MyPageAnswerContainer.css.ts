import { colors, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const answerNum = style({
  ...typography.engNum,
  color: colors.textPrimary,
  fontSize: 24,
  marginRight: 6
});

export const answerContainer = style({
  ...typography.labelNormalR,
  color: colors.textPrimary
});
