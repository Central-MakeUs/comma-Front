import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const navigationBar = style({
  width: 329,
  height: 64,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  borderRadius: vars.radius.pill,
  padding: '0 16px',
  background: 'rgb(27 24 19 / 10%)',
  boxShadow: vars.shadow.glassInset,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  fontFamily: vars.font.body
});

export const navigationItem = style({
  flex: '1 0 0',
  minWidth: 0,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 2,
  padding: '8px 0',
  boxSizing: 'border-box',
  border: 0,
  background: 'transparent',
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${vars.color.textPrimary}`,
      outlineOffset: 2,
      borderRadius: vars.radius.lg
    }
  }
});

export const navigationItemTone = styleVariants({
  active: {
    color: vars.color.iconPrimary
  },
  inactive: {
    color: vars.color.iconSecondary
  }
});

export const navigationIcon = style({
  width: 28,
  height: 28,
  display: 'block',
  flexShrink: 0,
  transition: 'color 0.3s ease-out'
});

export const navigationLabel = style({
  display: 'block',
  width: '100%',
  overflow: 'hidden',
  textAlign: 'center',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  transition: 'color 0.3s ease-out, text-shadow 0.3s ease-out'
});

export const navigationLabelTone = styleVariants({
  active: {
    color: vars.color.textPrimary,
    fontSize: vars.typography.captionB.fontSize,
    fontWeight: vars.typography.captionB.fontWeight,
    lineHeight: vars.typography.captionB.lineHeight,
    letterSpacing: vars.typography.captionB.letterSpacing,
    textShadow: vars.shadow.card
  },
  inactive: {
    color: vars.color.textTertiary,
    fontSize: vars.typography.captionR.fontSize,
    fontWeight: vars.typography.captionR.fontWeight,
    lineHeight: vars.typography.captionR.lineHeight,
    letterSpacing: vars.typography.captionR.letterSpacing
  }
});
