import { colors, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const modal = style({
  width: 'min(329px, calc(var(--app-width) - 64px))',
  minHeight: 284,
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  borderRadius: 36,
  padding: '24px 20px',
  background: 'rgba(194, 191, 188, 0.1)',
  boxShadow: 'inset -2px 0 40px rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)'
});

export const header = style({
  display: 'flex',
  justifyContent: 'flex-end'
});

export const text = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  marginTop: 8,
  marginBottom: 32
});

export const title = style({
  ...typography.headlineB,
  margin: 0,
  color: colors.textPrimary
});

export const description = style({
  ...typography.bodyNormalR,
  margin: 0,
  color: colors.textPrimary
});

export const actions = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  marginTop: 'auto'
});

const modalButton = style({
  width: '100%',
  height: 60
});

export const cancelButton = style([
  modalButton,
  {
    border: '1px solid rgba(194, 191, 188, 0.66)',
    background: 'transparent',
    boxShadow: 'none'
  }
]);

export const confirmButton = style([
  modalButton,
  {
    boxShadow: 'none'
  }
]);
