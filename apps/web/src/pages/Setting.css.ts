import { colors, shadows, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const leftArrow = style({
  width: 24,
  height: 24,
  transform: 'scaleX(-1)',
  color: colors.iconSecondary
});

export const backButton = style({
  position: 'absolute',
  left: 22,
  bottom: 8,
  width: 44,
  height: 44,
  padding: 0,
  border: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  cursor: 'pointer'
});

export const container = style({
  background: 'linear-gradient(#11111166 0%, #11111100 100%), #322E29',
  width: '100%',
  minHeight: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflowX: 'hidden'
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

export const content = style({
  width: '100%',
  marginTop: 24
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

export const planActionBtn = style({
  minWidth: 118,
  width: 'auto',
  height: 36,
  marginTop: 8
});

export const settingsList = style({
  width: '100%',
  marginTop: 32
});

export const settingContainer = style({
  width: '100%',
  padding: '20px 32px',
  border: 0,
  borderTop: `1px solid ${colors.lineTertiary}`,
  color: colors.textPrimary,
  ...typography.bodyNormalB,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  fontFamily: 'inherit',
  textAlign: 'left'
});

export const crownIcon = style({
  marginLeft: 4,
  color: colors.iconSecondary
});

export const modalOverlay = style({
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: '50%',
  width: '100%',
  maxWidth: 'var(--app-max-width)',
  transform: 'translateX(-50%)',
  zIndex: 10
});

export const backdropButton = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  border: 0,
  padding: 0,
  background: 'rgba(26, 24, 20, 0.66)',
  cursor: 'default'
});

export const footer = style({
  width: '100%',
  marginTop: 'auto',
  padding: '8px 32px calc(8px + var(--safe-area-bottom))',
  boxSizing: 'border-box',
  color: colors.textTertiary,
  ...typography.labelNormalR,
  textAlign: 'center',
  whiteSpace: 'nowrap'
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
  zIndex: 1,
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

export const premiumAlertSheet = style({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
  width: '100%',
  maxHeight: '100dvh',
  padding: '8px 24px calc(8px + var(--safe-area-bottom))',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflowY: 'auto',
  borderRadius: '36px 36px 0 0',
  background: 'rgba(194, 191, 188, 0.1)',
  boxShadow: shadows.glassInset,
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)'
});

export const sheetHandle = style({
  width: 36,
  height: 4,
  flexShrink: 0,
  borderRadius: 100,
  background: colors.iconSecondary
});

export const premiumAlertHeader = style({
  width: '100%',
  marginTop: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 16
});

export const premiumAlertTitle = style({
  margin: 0,
  color: colors.textPrimary,
  ...typography.headlineB
});

export const premiumAlertDescription = style({
  margin: 0,
  color: colors.textTertiary,
  ...typography.bodyReadingR
});

export const premiumAlertForm = style({
  width: '100%',
  marginTop: 32,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

export const contactTypeToggle = style({
  margin: 0,
  padding: 4,
  border: 0,
  minInlineSize: 0,
  display: 'flex',
  gap: 4,
  borderRadius: 100,
  background: 'rgba(119, 111, 105, 0.15)',
  backdropFilter: 'blur(5px)',
  WebkitBackdropFilter: 'blur(5px)'
});

export const contactTypeButton = style({
  width: 72,
  height: 36,
  padding: '6px 0',
  border: 0,
  borderRadius: 100,
  background: 'transparent',
  color: colors.textTertiary,
  ...typography.bodyNormalR,
  cursor: 'pointer'
});

export const contactTypeSelected = style([
  contactTypeButton,
  {
    background: 'rgba(194, 191, 188, 0.1)',
    color: colors.textPrimary,
    boxShadow: shadows.glassInset,
    fontWeight: 600
  }
]);

export const premiumAlertInput = style({
  width: '100%',
  marginTop: 16
});

export const premiumAlertSubmit = style({
  width: '100%',
  marginTop: 32
});
