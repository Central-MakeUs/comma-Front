import { style } from '@vanilla-extract/css';
import { type RecipeVariants, recipe } from '@vanilla-extract/recipes';
import { vars } from './theme.css';

export const screen = style({
  minHeight: '100dvh',
  display: 'grid',
  placeItems: 'center',
  padding: vars.space[6],
  background: vars.color.background,
  color: vars.color.foreground,
  fontFamily: vars.font.body
});

export const panel = style({
  width: 'min(100%, 560px)'
});

export const eyebrow = style({
  margin: `0 0 ${vars.space[3]}`,
  color: vars.color.muted,
  fontSize: vars.typography.label1.fontSize,
  fontWeight: vars.typography.label1.fontWeight,
  lineHeight: vars.typography.label1.lineHeight,
  textTransform: 'uppercase'
});

export const title = style({
  margin: 0,
  fontSize: 'clamp(42px, 10vw, 76px)',
  lineHeight: 0.95,
  fontFamily: vars.font.display,
  fontWeight: 400
});

export const description = style({
  margin: `${vars.space[6]} 0 ${vars.space[7]}`,
  color: vars.color.body,
  fontSize: vars.typography.display.fontSize,
  fontWeight: vars.typography.display.fontWeight,
  lineHeight: vars.typography.display.lineHeight
});

export const actionButton = recipe({
  base: {
    minHeight: 44,
    border: 0,
    borderRadius: vars.radius.control,
    padding: '0 18px',
    font: 'inherit',
    fontSize: vars.typography.heading1.fontSize,
    fontWeight: vars.typography.heading1.fontWeight,
    lineHeight: vars.typography.heading1.lineHeight,
    selectors: {
      '& + &': {
        marginLeft: 10
      }
    }
  },
  variants: {
    tone: {
      primary: {
        background: vars.color.accent,
        color: vars.color.inverse
      },
      secondary: {
        background: 'transparent',
        color: vars.color.foreground,
        boxShadow: `inset 0 0 0 1px ${vars.color.line}`
      }
    }
  },
  defaultVariants: {
    tone: 'primary'
  }
});

export type ActionButtonVariants = RecipeVariants<typeof actionButton>;
