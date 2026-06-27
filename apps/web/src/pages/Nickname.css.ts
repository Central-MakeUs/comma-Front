import { style } from '@vanilla-extract/css';
import { typography, colors } from "@comma/design-system";

export const container = style({
  backgroundImage: 'url("/images/onboardingBackground_blur.svg")',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  width: '100vw',
  height: '100vh',
  backgroundPosition: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: 32,
  paddingRight: 32,
  boxSizing: 'border-box'
});

export const title = style({
    ...typography.titleR,
    color: colors.textPrimary,
})

export const desc = style({
    ...typography.bodyReadingR,
    color: colors.textTertiary,
    marginTop: 16,
})

export const agreementNotice = style({
  ...typography.captionR,
  color: colors.textTertiary,
  textAlign: 'center',
  marginBottom: 24,
});

export const agreementAccent = style({
  color: colors.textSecondary,
  textDecoration: 'underline',
});