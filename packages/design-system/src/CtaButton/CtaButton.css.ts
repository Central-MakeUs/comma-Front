import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const ctaButton = style({
  width: 329,
  height: 60,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  border: 0,
  borderRadius: 100,
  padding: '16px 24px',
  overflow: 'hidden',
  fontFamily: vars.font.body,
  fontSize: vars.typography.headlineB.fontSize,
  fontWeight: vars.typography.headlineB.fontWeight,
  lineHeight: vars.typography.headlineB.lineHeight,
  letterSpacing: vars.typography.headlineB.letterSpacing,
  textAlign: 'center',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  transition: 'background-color 0.12s ease-out, box-shadow 0.12s ease-out, color 0.12s ease-out',
  selectors: {
    '&:active:not(:disabled)': {
      background: 'rgb(50 46 41 / 10%)',
      boxShadow: 'inset -2px 0 10px rgb(255 255 255 / 15%)'
    },
    '&:disabled': {
      cursor: 'not-allowed'
    }
  }
});

export const ctaButtonState = styleVariants({
  default: {
    background: 'rgb(194 191 188 / 10%)',
    color: vars.color.textPrimary,
    boxShadow: 'inset -2px 0 10px rgb(255 255 255 / 33%)'
  },
  pressed: {
    background: 'rgb(50 46 41 / 10%)',
    color: vars.color.textPrimary,
    boxShadow: 'inset -2px 0 10px rgb(255 255 255 / 15%)'
  },
  disabled: {
    background: 'rgb(253 252 252 / 5%)',
    color: vars.color.textTertiary,
    boxShadow: 'none'
  }
});
