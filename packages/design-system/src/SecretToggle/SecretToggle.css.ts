import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const secretToggle = style({
  position: 'relative',
  width: 156,
  height: 44,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  boxSizing: 'border-box',
  border: 0,
  borderRadius: 100,
  padding: 4,
  overflow: 'hidden',
  appearance: 'none',
  background: 'rgb(119 111 105 / 15%)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  cursor: 'pointer',
  margin: 0,
  outline: 'none',
  fontFamily: vars.font.body,
  transition: 'box-shadow 0.16s ease-out, opacity 0.16s ease-out',
  selectors: {
    '&:focus-visible': {
      boxShadow: `0 0 0 2px ${vars.color.linePrimary}`
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.56
    }
  }
});

export const secretToggleThumb = style({
  position: 'absolute',
  top: 4,
  left: 4,
  width: 72,
  height: 36,
  borderRadius: 100,
  background:
    'linear-gradient(135deg, rgb(255 255 255 / 14%) 0%, rgb(194 191 188 / 10%) 42%, rgb(50 46 41 / 12%) 100%)',
  boxShadow:
    'inset -2px 0 40px rgb(255 255 255 / 10%), inset 0 1px 1px rgb(255 255 255 / 42%), inset 1px 0 0 rgb(255 255 255 / 24%), inset 0 -1px 1px rgb(255 255 255 / 24%), 0 1px 2px rgb(0 0 0 / 18%)',
  pointerEvents: 'none',
  transition: 'transform 0.2s ease-out, background 0.12s ease-out, box-shadow 0.12s ease-out',
  selectors: {
    [`${secretToggle}:active:not(:disabled) &`]: {
      background:
        'linear-gradient(135deg, rgb(255 255 255 / 8%) 0%, rgb(50 46 41 / 10%) 48%, rgb(26 24 20 / 14%) 100%)',
      boxShadow:
        'inset -2px 0 20px rgb(255 255 255 / 5%), inset 0 1px 1px rgb(255 255 255 / 42%), inset 1px 0 0 rgb(255 255 255 / 24%), inset 0 -1px 1px rgb(255 255 255 / 18%), 0 1px 2px rgb(0 0 0 / 18%)'
    }
  }
});

export const secretToggleThumbState = styleVariants({
  unchecked: {
    transform: 'translateX(0)'
  },
  checked: {
    transform: 'translateX(76px)'
  }
});

export const secretToggleThumbInteraction = styleVariants({
  default: {},
  pressed: {
    background:
      'linear-gradient(135deg, rgb(255 255 255 / 8%) 0%, rgb(50 46 41 / 10%) 48%, rgb(26 24 20 / 14%) 100%)',
    boxShadow:
      'inset -2px 0 20px rgb(255 255 255 / 5%), inset 0 1px 1px rgb(255 255 255 / 42%), inset 1px 0 0 rgb(255 255 255 / 24%), inset 0 -1px 1px rgb(255 255 255 / 18%), 0 1px 2px rgb(0 0 0 / 18%)'
  }
});

export const secretToggleSegment = style({
  position: 'relative',
  zIndex: 1,
  width: 72,
  height: 36,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  borderRadius: 100,
  padding: '6px 0',
  color: vars.color.textTertiary,
  fontSize: vars.typography.bodyNormalR.fontSize,
  fontWeight: vars.typography.bodyNormalR.fontWeight,
  lineHeight: vars.typography.bodyNormalR.lineHeight,
  letterSpacing: vars.typography.bodyNormalR.letterSpacing,
  whiteSpace: 'nowrap',
  transition: 'color 0.12s ease-out, font-weight 0.12s ease-out'
});

export const secretToggleSegmentState = styleVariants({
  idle: {},
  selected: {
    color: vars.color.textPrimary,
    fontWeight: vars.typography.bodyNormalB.fontWeight
  }
});
