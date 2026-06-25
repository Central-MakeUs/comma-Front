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
  fontSize: 13,
  fontWeight: 700,
  textTransform: 'uppercase'
});

export const title = style({
  margin: 0,
  fontSize: 'clamp(42px, 10vw, 76px)',
  lineHeight: 0.95
});

export const description = style({
  margin: `${vars.space[6]} 0 ${vars.space[7]}`,
  color: vars.color.body,
  fontSize: 18,
  lineHeight: 1.6
});

export const actionButton = recipe({
  base: {
    minHeight: 44,
    border: 0,
    borderRadius: vars.radius.control,
    padding: '0 18px',
    font: 'inherit',
    fontWeight: 700,
    selectors: {
      '& + &': {
        marginLeft: 10
      }
    }
  },
  variants: {
    tone: {
      primary: {
        background: vars.color.foreground,
        color: vars.color.inverse
      },
      secondary: {
        background: 'transparent',
        color: vars.color.foreground,
        boxShadow: `inset 0 0 0 1px ${vars.color.foreground}`
      }
    }
  },
  defaultVariants: {
    tone: 'primary'
  }
});

export type ActionButtonVariants = RecipeVariants<typeof actionButton>;
