import { colors, shadows } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

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
  zIndex: 3,
  position: 'absolute',
  bottom: 0
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
