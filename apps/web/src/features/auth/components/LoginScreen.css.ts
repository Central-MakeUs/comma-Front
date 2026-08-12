import { colors, typography } from '@comma/design-system';
import { globalStyle, keyframes, style } from '@vanilla-extract/css';

export const container = style({
  isolation: 'isolate',
  backgroundColor: '#1A1814',
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

globalStyle(`${container} > :not([aria-hidden="true"]):not([data-overlay="true"])`, {
  position: 'relative',
  zIndex: 1
});

export const backgroundImage = style({
  zIndex: 0
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
  textAlign: 'center'
});

export const agreementAccent = style({
  color: colors.textSecondary,
  textDecoration: 'underline'
});

const buttonBase = style({
  width: '100%',
  height: 60,
  borderRadius: 100,
  fontFamily: 'Pretendard, sans-serif',
  fontWeight: 500,
  fontSize: 20,
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '5px'
});

export const kakaoBtn = style([
  buttonBase,
  {
    backgroundColor: '#FEE500',
    color: '#322E29',
    marginBottom: 8
  }
]);

export const appleBtn = style([
  buttonBase,
  {
    backgroundColor: '#1A1814',
    color: '#FDFCFC',
    marginBottom: 8
  }
]);

export const googleBtn = style([
  buttonBase,
  {
    backgroundColor: '#FDFCFC',
    color: '#322E29',
    marginBottom: 24
  }
]);

const toastEnter = keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(8px)'
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)'
  }
});

export const toastLayer = style({
  position: 'fixed',
  left: '50%',
  bottom: 'max(24px, calc(var(--safe-area-bottom) + 24px))',
  width: 329,
  maxWidth: 'calc(100% - 32px)',
  transform: 'translateX(-50%)',
  zIndex: 2
});

export const loginToast = style({
  width: '100%',
  animation: `${toastEnter} 220ms cubic-bezier(0.16, 1, 0.3, 1)`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none'
    }
  }
});
