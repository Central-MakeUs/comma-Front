import { colors, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const container = style({
  position: 'relative',
  width: '100%',
  height: '100dvh',
  overflow: 'hidden',
  backgroundColor: colors.backgroundPrimary,
  boxSizing: 'border-box',
  paddingTop: 'calc(160px + var(--safe-area-top))',
  paddingLeft: 32,
  paddingRight: 32
});

export const backgroundImage = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: 0
});

export const content = style({
  position: 'relative',
  zIndex: 2
});

export const title = style({
  ...typography.titleR,
  color: colors.textPrimary
});

export const num = style({
  ...typography.engNum,
  color: colors.textPrimary,
  marginRight: 4,
  textBoxTrim: 'trim-end',
  textBoxEdge: 'cap alphabetic'
});

export const desc = style({
  ...typography.headlineR,
  color: colors.textTertiary
});
