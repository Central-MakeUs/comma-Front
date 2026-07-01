import { style } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const feedBadook = style({
  width: 165,
  display: 'grid',
  gap: 8,
  color: vars.color.textPrimary
});

export const imageFrame = style({
  width: 165,
  height: 137,
  borderRadius: vars.radius.sm,
  overflow: 'hidden',
  background: '#d9d9d9'
});

export const image = style({
  width: '100%',
  height: '100%',
  display: 'block',
  objectFit: 'cover'
});

export const body = style({
  display: 'grid',
  gap: 6
});

export const metaRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  minWidth: 0,
  color: vars.color.textTertiary
});

export const dateText = style({
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
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
  color: vars.color.textTertiary,
  fontFamily: vars.typography.captionB.fontFamily,
  fontSize: vars.typography.captionB.fontSize,
  fontWeight: vars.typography.captionB.fontWeight,
  lineHeight: vars.typography.captionB.lineHeight,
  letterSpacing: vars.typography.captionB.letterSpacing
});

export const contentText = style({
  margin: 0,
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  color: vars.color.textPrimary,
  fontFamily: vars.typography.labelReadingR.fontFamily,
  fontSize: vars.typography.labelReadingR.fontSize,
  fontWeight: vars.typography.labelReadingR.fontWeight,
  lineHeight: vars.typography.labelReadingR.lineHeight,
  letterSpacing: vars.typography.labelReadingR.letterSpacing
});

export const tagsRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  columnGap: 4,
  rowGap: 2,
  color: vars.color.textTertiary,
  fontFamily: vars.typography.labelReadingB.fontFamily,
  fontSize: vars.typography.labelReadingB.fontSize,
  fontWeight: vars.typography.labelReadingB.fontWeight,
  lineHeight: vars.typography.labelReadingB.lineHeight,
  letterSpacing: vars.typography.labelReadingB.letterSpacing
});
