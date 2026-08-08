import { colors, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const menu = style({
  position: 'fixed',
  width: 200,
  borderRadius: 20,
  backgroundColor: 'rgba(50, 46, 41, 0.66)',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  ...typography.bodyNormalR,
  color: colors.textTertiary,
  zIndex: 10
});

export const optionButton = style({
  width: '100%',
  height: 'auto',
  justifyContent: 'flex-start',
  padding: '8px 16px',
  paddingRight: 0,
  borderRadius: 0,
  background: 'none',
  boxShadow: 'none',
  color: 'inherit',
  ...typography.bodyNormalR,
  textAlign: 'left'
});
