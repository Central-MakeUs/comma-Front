import { keyframes, style } from '@vanilla-extract/css';

const toastEnter = keyframes({
  from: {
    opacity: 0,
    transform: 'translate(-50%, 8px)'
  },
  to: {
    opacity: 1,
    transform: 'translate(-50%, 0)'
  }
});

export const toastLayer = style({
  position: 'fixed',
  left: '50%',
  bottom: 'max(120px, calc(var(--safe-area-bottom) + 24px))',
  zIndex: 200,
  width: 329,
  maxWidth: 'calc(100% - 32px)',
  pointerEvents: 'auto',
  animation: `${toastEnter} 220ms cubic-bezier(0.16, 1, 0.3, 1)`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none'
    }
  }
});

export const toast = style({
  width: '100%'
});
