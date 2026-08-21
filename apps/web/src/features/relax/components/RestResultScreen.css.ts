import { colors, typography } from '@comma/design-system';
import { globalStyle, style } from '@vanilla-extract/css';
import * as layoutStyles from '../../../shared/components/layout/layout.css';

export const container = style({
  position: 'relative',
  isolation: 'isolate',
  background: colors.backgroundPrimary
});

globalStyle(`:where(${container} > :not([aria-hidden="true"]))`, {
  position: 'relative',
  zIndex: 2
});

export const backgroundImage = style({
  zIndex: 0,
  objectFit: 'cover'
});

export const backgroundOverlay = style([
  layoutStyles.absoluteFill,
  {
    zIndex: 1,
    background: 'rgba(26, 24, 20, 0.6)',
    backdropFilter: 'blur(80px)',
    WebkitBackdropFilter: 'blur(80px)'
  }
]);

export const title = style({
  ...typography.titleR,
  color: colors.textPrimary,
  marginBottom: 4
});

export const subTitle = style({
  ...typography.bodyReadingR,
  color: colors.textTertiary,
  marginBottom: 64
});

export const imageUploadStyle = style({
  selectors: {
    '&::after': {
      content: '',
      position: 'absolute',
      inset: 0,
      borderRadius: 'inherit',
      zIndex: 1,
      background: 'linear-gradient(rgba(17, 17, 17, 0) 0%, rgba(17, 17, 17, 0.66) 100%)',
      boxShadow: 'inset 0 4px 10px 0 rgba(255, 255, 255, 0.2), 0 4px 40px 0 rgba(0, 0, 0, 0.2)'
    }
  }
});

export const dot = style({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: 'rgba(252, 252, 252, 0.15)'
});

export const ctaButtonStyle = style({
  width: '100%',
  maxWidth: 329,
  color: colors.textPrimary,
  pointerEvents: 'auto'
});

export const footer = layoutStyles.fixedBottomAction;

export const imageNumStyle = style({
  ...typography.engNum,
  color: colors.textPrimary
});

export const imageText = style({
  ...typography.headlineR,
  color: colors.textSecondary
});

export const modalContainer = style({
  width: 'calc(100% - 64px)',
  height: 284,
  backgroundColor: 'rgba(194, 191, 188, 0.1)',
  boxShadow: 'inset -2px 0 40px 0 rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  boxSizing: 'border-box',
  padding: '24px 20px',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 36
});

export const modalTitle = style({
  ...typography.headlineB,
  color: colors.textPrimary,
  marginBottom: 8
});

export const modalDesc = style({
  ...typography.bodyNormalR,
  color: colors.textPrimary
});

const buttonBase = style({
  width: '100%',
  height: 60
});

export const cancleBtn = style([
  buttonBase,
  {
    marginBottom: 8,
    background: 'transparent',
    border: '1px solid rgba(194, 191, 188, 0.66)',
    boxShadow: 'none'
  }
]);

export const confirmBtn = style([
  buttonBase,
  {
    boxShadow: 'none'
  }
]);
