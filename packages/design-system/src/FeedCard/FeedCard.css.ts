import { style } from '@vanilla-extract/css';
import { typography, vars } from '../theme.css';

export const feedCard = style({
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  background: vars.color.backgroundPrimary,
  color: vars.color.textPrimary
});

export const body = style({
  display: 'grid',
  gap: 8,
  padding: '24px 32px 0'
});

export const metaRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  minWidth: 0
});

export const metaText = style({
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontFamily: vars.typography.labelNormalB.fontFamily,
  fontSize: vars.typography.labelNormalB.fontSize,
  fontWeight: vars.typography.labelNormalB.fontWeight,
  lineHeight: vars.typography.labelNormalB.lineHeight,
  letterSpacing: vars.typography.labelNormalB.letterSpacing
});

export const secondaryMetaText = style({
  flexShrink: 0,
  color: vars.color.textTertiary,
  fontFamily: vars.typography.captionR.fontFamily,
  fontSize: vars.typography.captionR.fontSize,
  fontWeight: vars.typography.captionR.fontWeight,
  lineHeight: vars.typography.captionR.lineHeight,
  letterSpacing: vars.typography.captionR.letterSpacing
});

export const likeRow = style({
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  color: vars.color.textPrimary,
  fontFamily: vars.typography.captionB.fontFamily,
  fontSize: vars.typography.captionB.fontSize,
  fontWeight: vars.typography.captionB.fontWeight,
  lineHeight: vars.typography.captionB.lineHeight,
  letterSpacing: vars.typography.captionB.letterSpacing
});

export const contentText = style({
  margin: 0,
  color: vars.color.textPrimary,
  fontFamily: vars.typography.bodyNormalR.fontFamily,
  fontSize: vars.typography.bodyNormalR.fontSize,
  fontWeight: vars.typography.bodyNormalR.fontWeight,
  lineHeight: vars.typography.bodyNormalR.lineHeight,
  letterSpacing: vars.typography.bodyNormalR.letterSpacing
});

export const tagsText = style({
  margin: 0,
  color: vars.color.textTertiary,
  fontFamily: vars.typography.labelNormalR.fontFamily,
  fontSize: vars.typography.labelNormalR.fontSize,
  fontWeight: vars.typography.labelNormalR.fontWeight,
  lineHeight: vars.typography.labelNormalR.lineHeight,
  letterSpacing: vars.typography.labelNormalR.letterSpacing
});

export const modal = style({
  width: 80,
  height: 88,
  borderRadius: 20,
  backgroundColor: '#322E2966',
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: 16,
  boxSizing: 'border-box',
  position: 'absolute',
  top: '100%',
  right: 0,
  zIndex: 2,
  backdropFilter: 'blur(4px)'
})

export const modalText = style({
  ...typography.bodyNormalR,
  color: vars.color.textPrimary,
  width: '100%',
  height: 40,
  display: 'inline-flex',
  alignItems: 'center'
})

export const modalOverlay = style({
  position: 'fixed',
  inset: 0,
  zIndex: 1
})