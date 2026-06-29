import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from './theme.css';

const glassSurface = {
  background: 'rgb(194 191 188 / 10%)',
  boxShadow: 'inset -2px 0 40px rgb(255 255 255 / 10%)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)'
};

export const imageUpload = style({
  position: 'relative',
  width: 345,
  height: 438,
  display: 'inline-grid',
  placeItems: 'center',
  boxSizing: 'border-box',
  border: 0,
  borderRadius: 100,
  padding: 0,
  overflow: 'hidden',
  color: vars.color.textTertiary,
  fontFamily: vars.font.body,
  cursor: 'pointer',
  transition: 'opacity 0.12s ease-out, box-shadow 0.12s ease-out',
  selectors: {
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.5
    }
  }
});

export const imageUploadState = styleVariants({
  none: glassSurface,
  select: glassSurface,
  exist: {
    background: 'transparent',
    boxShadow: 'none',
    backdropFilter: 'none',
    WebkitBackdropFilter: 'none'
  },
  existEmpty: glassSurface
});

export const plusIcon = style({
  position: 'relative',
  width: 32,
  height: 32,
  selectors: {
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      inset: '50% auto auto 50%',
      width: 32,
      height: 2,
      borderRadius: 2,
      background: vars.color.iconSecondary,
      transform: 'translate(-50%, -50%)'
    },
    '&::after': {
      transform: 'translate(-50%, -50%) rotate(90deg)'
    }
  }
});

export const selectText = style({
  margin: 0,
  color: vars.color.textTertiary,
  fontFamily: vars.typography.bodyNormalR.fontFamily,
  fontSize: vars.typography.bodyNormalR.fontSize,
  fontWeight: vars.typography.bodyNormalR.fontWeight,
  lineHeight: vars.typography.bodyNormalR.lineHeight,
  letterSpacing: vars.typography.bodyNormalR.letterSpacing
});

export const image = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  display: 'block',
  objectFit: 'cover'
});
