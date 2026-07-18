import { colors, typography } from '@comma/design-system';
import { style, styleVariants } from '@vanilla-extract/css';

export const container = style({
  backgroundColor: '#1A1814',
  backgroundImage: 'url("/images/onboardingBackground_blur.png")',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  width: '100vw',
  height: '100dvh',
  backgroundPosition: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: 'var(--safe-area-top)',
  paddingBottom: 'var(--safe-area-bottom)',
  paddingLeft: 32,
  paddingRight: 32,
  boxSizing: 'border-box'
});

export const title = style({
  ...typography.titleR,
  color: colors.textPrimary
});

export const desc = style({
  ...typography.bodyReadingR,
  color: colors.textTertiary,
  marginTop: 16
});

export const agreementNotice = style({
  ...typography.captionR,
  color: colors.textTertiary,
  textAlign: 'center',
  marginBottom: 24
});

export const agreementAccent = style({
  color: colors.textSecondary,
  textDecoration: 'underline'
});

export const inputStyle = style({
  ...typography.bodyNormalR,
  color: colors.textTertiary,
  boxShadow: 'inset -2px 0 10px 0 rgba(255,255,255,0.33)',
  borderRadius: 100
});

export const ctaButtonStyle = styleVariants({
  default: {
    color: colors.textPrimary
  },
  pressed: {
    color: colors.textPrimary
  },
  disabled: {
    color: colors.textTertiary
  }
});

export const noticeText = style({
  ...typography.labelReadingR,
  color: colors.textSecondary
});

export const noticeAccent = style({
  ...typography.labelReadingB,
  color: colors.textPrimary
});
