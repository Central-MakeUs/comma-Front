import { colors } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const container = style({
  width: '100%',
  height: 532,
  backgroundColor: '#C2BFBC10',
  padding: '8px 24px',
  paddingBottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
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
