import { colors, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const container = style({
  width: '100%',
  minHeight: '100dvh',
  position: 'relative',
  isolation: 'isolate',
  background: colors.backgroundPrimary
});

export const backgroundImage = style({
  position: 'absolute',
  inset: 0,
  zIndex: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover'
});

export const backgroundBlur = style({
  position: 'absolute',
  inset: 0,
  backdropFilter: 'blur(40px)',
  WebkitBackdropFilter: 'blur(40px)',
  zIndex: 1,
  backgroundColor: '#1A181450'
});

export const foreground = style({
  position: 'relative',
  zIndex: 2,
  width: '100%',
  minHeight: '100dvh'
});

export const header = style({
  width: '100%',
  color: colors.textPrimary,
  ...typography.headlineB,
  padding: 'calc(16px + var(--safe-area-top)) 16px 16px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative'
});

export const headerIconContainer = style({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  right: 22,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

export const title = style({
  ...typography.titleR,
  color: colors.textPrimary
});

export const desc = style({
  ...typography.labelNormalR,
  color: colors.textTertiary,
  marginTop: 8
});

export const nicknameEditBtn = style({
  width: 104,
  height: 36
});

export const questionNum = style({
  ...typography.engNum,
  color: colors.textTertiary,
  fontSize: 32,
  marginRight: 4
});

export const questionContainer = style({
  ...typography.bodyNormalB,
  color: colors.textTertiary,
  marginBottom: 20
});

export const navStyle = style({
  position: 'fixed',
  left: '50%',
  transform: 'translateX(-50%)',
  bottom: 'max(40px, var(--safe-area-bottom))',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  backgroundColor: '#1A181310'
});

export const alertText = style({
  ...typography.bodyReadingR,
  color: colors.textTertiary,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center'
});
