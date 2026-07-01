import { style } from '@vanilla-extract/css';
import { vars } from './theme.css';

export const screen = style({
  minHeight: '100dvh',
  display: 'grid',
  placeItems: 'center',
  padding: vars.space[6],
  background: vars.color.backgroundPrimary,
  color: vars.color.textPrimary,
  fontFamily: vars.font.body
});

export const panel = style({
  width: 'min(100%, 560px)'
});

export const eyebrow = style({
  margin: `0 0 ${vars.space[3]}`,
  color: vars.color.textTertiary,
  fontSize: vars.typography.systemSection.fontSize,
  fontWeight: vars.typography.systemSection.fontWeight,
  lineHeight: vars.typography.systemSection.lineHeight,
  textTransform: 'uppercase'
});

export const title = style({
  margin: 0,
  fontSize: vars.typography.engNum.fontSize,
  lineHeight: vars.typography.engNum.lineHeight,
  fontFamily: vars.typography.engNum.fontFamily,
  fontWeight: vars.typography.engNum.fontWeight
});

export const description = style({
  margin: `${vars.space[6]} 0 ${vars.space[7]}`,
  color: vars.color.textSecondary,
  fontSize: vars.typography.bodyNormalR.fontSize,
  fontWeight: vars.typography.bodyNormalR.fontWeight,
  lineHeight: vars.typography.bodyNormalR.lineHeight
});
