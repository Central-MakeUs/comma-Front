import { colors, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const gaugeContainer = style({
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 44px',
  alignItems: 'center',
  columnGap: 16
});

export const gaugeBar = style({
  backgroundColor: colors.lineSecondary,
  width: '100%',
  height: 4,
  borderRadius: 100
});

export const gaugeBarInner = style({
  backgroundColor: colors.textPrimary,
  height: 4,
  borderRadius: 100
});

export const gaugeText = style({
  ...typography.bodyNormalR,
  color: colors.textTertiary,
  textAlign: 'right',
  whiteSpace: 'nowrap'
});
