import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const progressBarRoot = style({
  width: 329,
  height: 2,
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 4,
  overflow: 'hidden'
});

export const progressBarSegment = style({
  minWidth: 0,
  height: '100%'
});

export const progressBarSegmentTone = styleVariants({
  active: {
    background: vars.color.linePrimary
  },
  inactive: {
    background: vars.color.lineSecondary
  }
});

export const progressBarSegmentPosition = styleVariants({
  first: {
    borderTopLeftRadius: vars.radius.pill,
    borderBottomLeftRadius: vars.radius.pill
  },
  middle: {},
  last: {
    borderTopRightRadius: vars.radius.pill,
    borderBottomRightRadius: vars.radius.pill
  }
});
