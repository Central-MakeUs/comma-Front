import { style } from '@vanilla-extract/css';
import { type RecipeVariants, recipe } from '@vanilla-extract/recipes';
import { vars } from './theme.css';

export const screen = style({
  minHeight: '100dvh',
  display: 'grid',
  placeItems: 'center',
  padding: vars.space[6],
  background: vars.color.backgroundPrimary,
  color: vars.color.textPrimary,
  fontFamily: vars.font.body
});

export const panel = style({
  width: 'min(100%, 560px)'
});

export const eyebrow = style({
  margin: `0 0 ${vars.space[3]}`,
  color: vars.color.textTertiary,
  fontSize: vars.typography.systemSection.fontSize,
  fontWeight: vars.typography.systemSection.fontWeight,
  lineHeight: vars.typography.systemSection.lineHeight,
  textTransform: 'uppercase'
});

export const title = style({
  margin: 0,
  fontSize: vars.typography.engNum.fontSize,
  lineHeight: vars.typography.engNum.lineHeight,
  fontFamily: vars.typography.engNum.fontFamily,
  fontWeight: vars.typography.engNum.fontWeight
});

export const description = style({
  margin: `${vars.space[6]} 0 ${vars.space[7]}`,
  color: vars.color.textSecondary,
  fontSize: vars.typography.bodyNormalR.fontSize,
  fontWeight: vars.typography.bodyNormalR.fontWeight,
  lineHeight: vars.typography.bodyNormalR.lineHeight
});

export const actionButton = recipe({
  base: {
    minHeight: 44,
    border: 0,
    borderRadius: vars.radius.control,
    padding: '0 18px',
    font: 'inherit',
    fontSize: vars.typography.bodyNormalB.fontSize,
    fontWeight: vars.typography.bodyNormalB.fontWeight,
    lineHeight: vars.typography.bodyNormalB.lineHeight,
    selectors: {
      '& + &': {
        marginLeft: 10
      }
    }
  },
  variants: {
    tone: {
      primary: {
        background: vars.color.textBlackSecondary,
        color: vars.color.textPrimary
      },
      secondary: {
        background: 'transparent',
        color: vars.color.textPrimary,
        boxShadow: `inset 0 0 0 1px ${vars.color.linePrimary}`
      }
    }
  },
  defaultVariants: {
    tone: 'primary'
  }
});

export type ActionButtonVariants = RecipeVariants<typeof actionButton>;
