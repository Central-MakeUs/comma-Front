import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../theme.css';

const selectedBorder = `1px solid ${vars.color.linePrimary}`;
const selectedPressedBorder = `1px solid ${vars.color.lineSecondary}`;

export const chip = style({
  width: 80,
  height: 36,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 2,
  boxSizing: 'border-box',
  border: '1px solid transparent',
  borderRadius: 100,
  padding: '6px 12px 6px 14px',
  overflow: 'hidden',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  fontFamily: vars.font.body,
  fontSize: vars.typography.bodyNormalR.fontSize,
  fontWeight: vars.typography.bodyNormalR.fontWeight,
  lineHeight: vars.typography.bodyNormalR.lineHeight,
  letterSpacing: vars.typography.bodyNormalR.letterSpacing,
  textAlign: 'center',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  transition:
    'background-color 0.12s ease-out, border-color 0.12s ease-out, box-shadow 0.12s ease-out, color 0.12s ease-out',
  selectors: {
    '&:disabled': {
      cursor: 'not-allowed'
    }
  }
});

export const chipLabel = style({
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
});

export const chipIcon = style({
  width: 16,
  height: 16,
  flex: '0 0 16px'
});

export const chipState = styleVariants({
  default: {
    background: 'rgb(194 191 188 / 10%)',
    color: vars.color.textSecondary,
    boxShadow:
      'inset -2px 0 40px rgb(255 255 255 / 10%), inset 0 1px 0 rgb(255 255 255 / 18%), inset 0 -1px 0 rgb(255 255 255 / 8%)'
  },
  defaultPressed: {
    background: 'rgb(50 46 41 / 10%)',
    color: vars.color.textSecondary,
    boxShadow:
      'inset -2px 0 20px rgb(255 255 255 / 5%), inset 0 1px 0 rgb(255 255 255 / 10%), inset 0 -1px 0 rgb(255 255 255 / 5%)'
  },
  selected: {
    background: 'rgb(88 81 76 / 10%)',
    border: selectedBorder,
    color: vars.color.textSecondary,
    boxShadow:
      'inset -2px 0 10px rgb(255 255 255 / 66%), inset 0 1px 0 rgb(255 255 255 / 30%), inset 0 -1px 0 rgb(255 255 255 / 12%)'
  },
  selectedPressed: {
    background: 'rgb(88 81 76 / 5%)',
    border: selectedPressedBorder,
    color: vars.color.textSecondary,
    boxShadow:
      'inset -2px 0 10px rgb(255 255 255 / 33%), inset 0 1px 0 rgb(255 255 255 / 16%), inset 0 -1px 0 rgb(255 255 255 / 8%)'
  }
});
