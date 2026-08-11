import { colors, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const modalContainer = style({
  width: 'calc(100% - 64px)',
  height: 284,
  backgroundColor: 'rgba(194, 191, 188, 0.1)',
  boxShadow: 'inset -2px 0 40px 0 rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxSizing: 'border-box',
  padding: '24px 20px',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 36
});

export const modalTitle = style({
  ...typography.headlineB,
  color: colors.textPrimary,
  marginBottom: 8
});

export const modalDesc = style({
  ...typography.bodyNormalR,
  color: colors.textPrimary
});

const buttonBase = style({
  width: '100%',
  height: 60
});

export const cancleBtn = style([
  buttonBase,
  {
    marginBottom: 8,
    background: 'transparent',
    border: '1px solid rgba(194, 191, 188, 0.66)',
    boxShadow: 'none'
  }
]);

export const confirmBtn = style([
  buttonBase,
  {
    boxShadow: 'none'
  }
]);
