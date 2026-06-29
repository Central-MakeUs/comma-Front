import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const question = style({
  width: 393,
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
  boxSizing: 'border-box',
  color: vars.color.textPrimary,
  fontFamily: vars.font.body
});

export const topArea = style({
  height: 24,
  display: 'flex',
  alignItems: 'center',
  boxSizing: 'border-box',
  padding: '0 32px'
});

export const backButton = style({
  width: 24,
  height: 24,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  border: 0,
  padding: 0,
  background: 'transparent',
  color: vars.color.iconPrimary,
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${vars.color.textPrimary}`,
      outlineOffset: 2,
      borderRadius: vars.radius.sm
    }
  }
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 43
});

export const titleBlock = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  boxSizing: 'border-box',
  padding: '0 32px'
});

export const counter = style({
  margin: 0,
  color: vars.color.textTertiary,
  fontFamily: vars.typography.labelReadingR.fontFamily,
  fontSize: vars.typography.labelReadingR.fontSize,
  lineHeight: vars.typography.labelReadingR.lineHeight,
  letterSpacing: vars.typography.labelReadingR.letterSpacing
});

export const counterCurrent = style({
  fontWeight: vars.typography.labelReadingB.fontWeight
});

export const counterRest = style({
  fontWeight: vars.typography.labelReadingR.fontWeight
});

export const title = style({
  margin: 0,
  color: vars.color.textPrimary,
  fontFamily: vars.typography.titleR.fontFamily,
  fontSize: vars.typography.titleR.fontSize,
  fontWeight: vars.typography.titleR.fontWeight,
  lineHeight: vars.typography.titleR.lineHeight,
  letterSpacing: vars.typography.titleR.letterSpacing
});

export const options = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  boxSizing: 'border-box',
  padding: '0 32px'
});
