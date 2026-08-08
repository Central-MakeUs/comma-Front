import { style } from '@vanilla-extract/css';
import { typography, vars } from '../theme.css';

export const feedCard = style({
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  rowGap: 16,
  background: vars.color.backgroundPrimary,
  color: vars.color.textPrimary
});

export const body = style({
  display: 'grid',
  gap: 12,
  padding: '0 32px'
});

export const summary = style({
  display: 'grid',
  gap: 4,
  minWidth: 0
});

export const metaRow = style({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: 16,
  minWidth: 0
});

export const metaText = style({
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: vars.color.textTertiary,
  fontFamily: vars.typography.bodyNormalR.fontFamily,
  fontSize: vars.typography.bodyNormalR.fontSize,
  fontWeight: vars.typography.bodyNormalR.fontWeight,
  lineHeight: vars.typography.bodyNormalR.lineHeight,
  letterSpacing: vars.typography.bodyNormalR.letterSpacing
});

export const myMetaText = style({
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: vars.color.textTertiary,
  fontFamily: vars.typography.labelNormalR.fontFamily,
  fontSize: vars.typography.labelNormalR.fontSize,
  fontWeight: vars.typography.labelNormalR.fontWeight,
  lineHeight: vars.typography.labelNormalR.lineHeight,
  letterSpacing: vars.typography.labelNormalR.letterSpacing
});

export const secondaryMetaText = style({
  flexShrink: 0,
  color: vars.color.textTertiary,
  fontFamily: vars.typography.labelNormalR.fontFamily,
  fontSize: vars.typography.labelNormalR.fontSize,
  fontWeight: vars.typography.labelNormalR.fontWeight,
  lineHeight: vars.typography.labelNormalR.lineHeight,
  letterSpacing: vars.typography.labelNormalR.letterSpacing
});

export const likeRow = style({
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'flex-start',
  gap: 4,
  color: vars.color.textPrimary,
  fontFamily: vars.typography.labelNormalR.fontFamily,
  fontSize: vars.typography.labelNormalR.fontSize,
  fontWeight: vars.typography.labelNormalR.fontWeight,
  lineHeight: vars.typography.labelNormalR.lineHeight,
  letterSpacing: vars.typography.labelNormalR.letterSpacing
});

export const contentText = style({
  margin: 0,
  color: vars.color.textPrimary,
  fontFamily: vars.typography.bodyNormalR.fontFamily,
  fontSize: vars.typography.bodyNormalR.fontSize,
  fontWeight: vars.typography.bodyNormalR.fontWeight,
  lineHeight: vars.typography.bodyNormalR.lineHeight,
  letterSpacing: vars.typography.bodyNormalR.letterSpacing,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
});

export const myContentText = style([
  contentText,
  {
    color: vars.color.textSecondary
  }
]);

export const footerRow = style({
  position: 'relative',
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12
});

export const tagsList = style({
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  overflow: 'hidden',
  whiteSpace: 'nowrap'
});

export const tag = style({
  flexShrink: 0,
  color: vars.color.textTertiary,
  fontFamily: vars.typography.bodyNormalB.fontFamily,
  fontSize: vars.typography.bodyNormalB.fontSize,
  fontWeight: vars.typography.bodyNormalB.fontWeight,
  lineHeight: vars.typography.bodyNormalB.lineHeight,
  letterSpacing: vars.typography.bodyNormalB.letterSpacing
});

export const actionMenuContainer = style({
  position: 'relative',
  flex: '0 0 24px',
  width: 24,
  height: 24
});

export const moreButton = style({
  flex: '0 0 24px',
  width: 24,
  height: 24,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  background: 'none',
  padding: 0,
  borderRadius: 4,
  color: 'inherit',
  cursor: 'pointer'
});

export const actionMenu = style({
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
});

export const actionMenuItem = style({
  ...typography.bodyNormalR,
  color: vars.color.textPrimary,
  width: '100%',
  height: 40,
  display: 'inline-flex',
  alignItems: 'center',
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  textAlign: 'left'
});
