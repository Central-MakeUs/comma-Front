import { colors, radii, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const container = style({
  width: '100%',
  minHeight: 120,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
  padding: 20,
  textAlign: 'center'
});

export const message = style({
  ...typography.bodyReadingR,
  color: colors.textTertiary,
  whiteSpace: 'pre-line'
});

export const retryButton = style({
  minWidth: 96,
  height: 40,
  padding: '0 16px',
  border: `1px solid ${colors.linePrimary}`,
  borderRadius: radii.md,
  background: colors.backgroundFill,
  color: colors.textPrimary,
  ...typography.labelNormalB
});
