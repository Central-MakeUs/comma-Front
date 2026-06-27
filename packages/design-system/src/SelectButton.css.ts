import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from './theme.css';

const pressedState = {
  background: 'rgb(17 17 17 / 10%)',
  color: vars.color.textSecondary,
  boxShadow: 'inset -2px 0 10px rgb(255 255 255 / 15%)'
};

export const selectButton = style({
  width: 329,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  border: 0,
  borderRadius: 100,
  padding: '16px 32px',
  overflow: 'hidden',
  fontFamily: vars.font.body,
  fontSize: vars.typography.headlineR.fontSize,
  lineHeight: vars.typography.headlineR.lineHeight,
  letterSpacing: vars.typography.headlineR.letterSpacing,
  textAlign: 'center',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  transition: 'background-color 0.12s ease-out, box-shadow 0.12s ease-out, color 0.12s ease-out',
  selectors: {
    '&:active': pressedState
  }
});

export const selectButtonState = styleVariants({
  default: {
    background: 'rgb(50 46 41 / 10%)',
    color: vars.color.textSecondary,
    fontWeight: vars.typography.headlineR.fontWeight,
    boxShadow: 'inset -2px 0 10px rgb(255 255 255 / 33%)'
  },
  pressed: {
    ...pressedState,
    fontWeight: vars.typography.headlineR.fontWeight
  },
  selected: {
    background: 'rgb(253 252 252 / 10%)',
    color: vars.color.textPrimary,
    fontWeight: vars.typography.headlineB.fontWeight,
    boxShadow: 'inset -2px 0 10px rgb(255 255 255 / 66%)'
  }
});
