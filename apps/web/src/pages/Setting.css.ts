import { colors, shadows, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const leftArrow = style({
  transform: 'translateY(-50%) scaleX(-1)',
  position: 'absolute',
  left: 32,
  top: '50%'
});

export const container = style({
  background: 'linear-gradient(#11111166 0%, #11111100 100%), #322E29',
  width: '100%',
  height: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

export const header = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 'calc(16px + var(--safe-area-top)) 16px 16px',
  color: colors.textPrimary,
  ...typography.headlineB,
  position: 'relative'
});

export const rateContainer = style({
  width: 'calc(100% - 64px)',
  borderRadius: 24,
  backgroundColor: colors.backgroundFill,
  position: 'relative',
  boxSizing: 'border-box',
  padding: '20px 24px',
  margin: '0 auto'
});

export const rateType = style({
  color: colors.textPrimary,
  ...typography.labelNormalR,
  marginBottom: 8
});

export const ratePrice = style({
  color: colors.textPrimary,
  ...typography.headlineB,
  marginBottom: 4
});

export const rateDesc = style({
  color: colors.textTertiary,
  ...typography.labelNormalR
});

export const startBtn = style({
  width: 87,
  height: 36,
  marginTop: 8
});

export const planActionBtn = style({
  minWidth: 87,
  width: 'auto',
  height: 36,
  marginTop: 8
});

export const settingContainer = style({
  width: '100%',
  padding: '20px 32px',
  border: `1px solid ${colors.lineTertiary}`,
  color: colors.textPrimary,
  ...typography.bodyNormalB,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  fontFamily: 'inherit'
});

export const crownIcon = style({
  marginLeft: 4,
  color: colors.iconSecondary
});

export const confirmModal = style({
  width: '100%',
  boxShadow: shadows.glassInset,
  borderRadius: 36,
  backgroundColor: '#C2BFBC10',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxSizing: 'border-box',
  paddingLeft: 24,
  paddingRight: 24,
  paddingTop: 8,
  position: 'absolute',
  bottom: 'calc(-36px + var(--safe-area-bottom))',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)'
});

export const confirmTitle = style({
  color: colors.textPrimary,
  ...typography.headlineB,
  marginBottom: 16,
  marginTop: 24,
  width: '100%',
  textAlign: 'left'
});

export const confirmDesc = style({
  color: colors.textTertiary,
  ...typography.bodyReadingR,
  marginBottom: 32,
  whiteSpace: 'pre-line',
  width: '100%',
  textAlign: 'left'
});

export const cancelBtn = style({
  backgroundColor: 'transparent',
  border: '1px solid #CEBFBC66',
  marginBottom: 8,
  boxShadow: 'none'
});

export const confirmBtn = style({
  boxShadow: 'none',
  marginBottom: 'max(40px, var(--safe-area-bottom))'
});
