import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const smallButton = style({
  position: 'relative',
  isolation: 'isolate',
  width: 60,
  height: 36,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  boxSizing: 'border-box',
  border: 0,
  borderRadius: vars.radius.pill,
  padding: '6px 16px',
  overflow: 'hidden',
  appearance: 'none',
  background: 'transparent',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  fontFamily: vars.typography.bodyNormalR.fontFamily,
  fontSize: vars.typography.bodyNormalR.fontSize,
  fontWeight: vars.typography.bodyNormalR.fontWeight,
  lineHeight: vars.typography.bodyNormalR.lineHeight,
  letterSpacing: vars.typography.bodyNormalR.letterSpacing,
  color: vars.color.textSecondary,
  textAlign: 'center',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  transition: 'background-color 0.12s ease-out, box-shadow 0.12s ease-out',
  selectors: {
    '&::before': {
      position: 'absolute',
      inset: 0,
      zIndex: -2,
      borderRadius: 'inherit',
      content: '""',
      pointerEvents: 'none',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      transition: 'background-color 0.12s ease-out'
    },
    '&::after': {
      position: 'absolute',
      inset: 0,
      zIndex: -1,
      borderRadius: 'inherit',
      content: '""',
      pointerEvents: 'none',
      transition: 'box-shadow 0.12s ease-out'
    },
    '&:disabled': {
      cursor: 'not-allowed'
    }
  }
});

export const smallButtonLabel = style({
  position: 'relative',
  zIndex: 1,
  minWidth: 0,
  flexShrink: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
});

export const smallButtonState = styleVariants({
  default: {
    selectors: {
      '&::before': {
        background: 'rgb(194 191 188 / 10%)'
      },
      '&::after': {
        boxShadow:
          'inset -2px 0 40px rgb(255 255 255 / 10%), inset 0 1px 0 rgb(255 255 255 / 18%), inset 0 -1px 0 rgb(255 255 255 / 8%)'
      }
    }
  },
  pressed: {
    selectors: {
      '&::before': {
        background: 'rgb(50 46 41 / 10%)'
      },
      '&::after': {
        boxShadow:
          'inset -2px 0 20px rgb(255 255 255 / 5%), inset 0 1px 0 rgb(255 255 255 / 10%), inset 0 -1px 0 rgb(255 255 255 / 5%)'
      }
    }
  }
});
