import { colors, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const container = style({
  width: '100vw',
  height: '100vh',
  backgroundImage: 'url(/images/Home.png)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  boxSizing: 'border-box',
  paddingTop: 160,
  paddingLeft: 32,
  paddingRight: 32
});

export const title = style({
  ...typography.titleR,
  color: colors.textPrimary
});

export const num = style({
  ...typography.engNum,
  color: colors.textPrimary,
  marginRight: 4
});

export const desc = style({
  ...typography.headlineR,
  color: colors.textTertiary
});
