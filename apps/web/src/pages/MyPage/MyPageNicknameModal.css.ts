import { colors, shadows } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const overlay = style({
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: '50%',
  width: '100%',
  maxWidth: 'var(--app-max-width)',
  transform: 'translateX(-50%)',
  zIndex: 10,
  overscrollBehavior: 'none'
});

export const backdropButton = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  border: 0,
  padding: 0,
  background: 'transparent',
  cursor: 'default'
});

export const container = style({
  width: '100%',
  height: 532,
  borderRadius: '36px 36px 0 0',
  backgroundColor: '#C2BFBC10',
  boxShadow: shadows.glassInset,
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  padding: '8px 24px',
  paddingBottom: 0,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'absolute',
  bottom: 0,
  zIndex: 1
});

export const icon = style({
  width: 36,
  height: 4,
  borderRadius: 100,
  color: colors.iconSecondary,
  marginBottom: 24
});

export const cancelBtn = style({
  backgroundColor: 'transparent',
  border: '1px solid #C2BFBC66',
  boxShadow: 'none',
  marginBottom: 8
});
