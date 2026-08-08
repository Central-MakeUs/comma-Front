import { colors, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const answerRow = style({
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(148px, 180px)',
  alignItems: 'start',
  columnGap: 12,
  marginBottom: 16
});

export const answerNum = style({
  ...typography.engNum,
  color: colors.textPrimary,
  fontSize: 24,
  lineHeight: '24px',
  flexShrink: 0,
  marginRight: 6
});

export const answerContainer = style({
  ...typography.labelNormalR,
  color: colors.textPrimary,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
  minWidth: 0
});

export const answerText = style({
  minWidth: 0,
  overflowWrap: 'break-word',
  wordBreak: 'keep-all',
  lineHeight: '21px'
});
