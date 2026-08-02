import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const toast = style({
  width: 329,
  minHeight: 44,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  boxSizing: 'border-box',
  padding: '10px 20px',
  borderRadius: 20,
  background: vars.color.backgroundPrimary,
  color: vars.color.textPrimary,
  backdropFilter: 'blur(2px)',
  WebkitBackdropFilter: 'blur(2px)',
  fontFamily: vars.font.body
});

export const message = style({
  ...vars.typography.bodyNormalB,
  flex: '1 0 0',
  minWidth: 0,
  margin: 0,
  color: vars.color.textPrimary,
  wordBreak: 'break-word',
  fontFeatureSettings: '"ss10" 1'
});

export const messageMuted = style({
  color: vars.color.textTertiary
});

export const closeSlot = style({
  position: 'relative',
  width: 20,
  height: 20,
  flex: '0 0 20px'
});

export const closeButton = style({
  position: 'absolute',
  top: -12,
  left: -12,
  width: 44,
  height: 44,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  border: 0,
  background: 'transparent',
  color: vars.color.iconSecondary,
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${vars.color.textPrimary}`,
      outlineOffset: -2,
      borderRadius: vars.radius.lg
    }
  }
});

export const closeIcon = style({
  width: 20,
  height: 20,
  display: 'block'
});

export const toastTone = styleVariants({
  default: {},
  open: {},
  lock: {},
  edit: {},
  report: {},
  block: {}
});
