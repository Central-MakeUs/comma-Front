import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const navigationBar = style({
  width: 344,
  height: 68,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxSizing: 'border-box',
  border: `1px solid rgb(255 255 255 / 12%)`,
  borderRadius: vars.radius.pill,
  padding: '0 16px',
  background: 'rgb(66 61 56 / 72%)',
  boxShadow: `${vars.shadow.glassInsetStrong}, 0 8px 24px rgb(0 0 0 / 18%)`,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  fontFamily: vars.font.body
});

export const navigationItem = style({
  width: 72,
  height: 56,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 2,
  boxSizing: 'border-box',
  flexShrink: 0,
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
  width: 32,
  height: 32,
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
