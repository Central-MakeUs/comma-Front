import { colors } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const appScreen = style({
  position: 'relative',
  width: '100%',
  height: '100dvh',
  boxSizing: 'border-box',
  background: colors.backgroundPrimary
});

export const fullScreen = style([
  appScreen,
  {
    overflow: 'hidden'
  }
]);

export const scrollScreen = style([
  appScreen,
  {
    overflowY: 'auto',
    overflowX: 'hidden',
    overscrollBehaviorY: 'contain',
    touchAction: 'pan-y',
    WebkitOverflowScrolling: 'touch'
  }
]);

export const tabShell = style([
  appScreen,
  {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    color: colors.textPrimary
  }
]);

export const tabNavigation = style({
  position: 'fixed',
  left: '50%',
  bottom: 'max(40px, var(--safe-area-bottom))',
  zIndex: 3,
  transform: 'translateX(-50%)'
});

export const tabScrollArea = style({
  width: '100%',
  boxSizing: 'border-box',
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  overflowX: 'hidden',
  overscrollBehaviorY: 'contain',
  touchAction: 'pan-y',
  WebkitOverflowScrolling: 'touch',
  paddingBottom: 'calc(144px + var(--safe-area-bottom))'
});

export const absoluteFillImage = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover'
});

export const absoluteFill = style({
  position: 'absolute',
  inset: 0
});

export const fixedBottomAction = style({
  position: 'fixed',
  width: '100%',
  maxWidth: 'var(--app-max-width)',
  right: 'auto',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 3,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding:
    '64px calc(32px + var(--safe-area-right)) max(32px, var(--safe-area-bottom)) calc(32px + var(--safe-area-left))',
  background: 'linear-gradient(to bottom, rgba(26, 24, 20, 0) 0%, #1A1814 46.767%, #1A1814 100%)',
  pointerEvents: 'none'
});

export const safeAreaHeaderX = style({
  position: 'relative',
  zIndex: 2,
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  padding:
    'calc(20px + var(--safe-area-top)) calc(32px + var(--safe-area-right)) 20px calc(32px + var(--safe-area-left))'
});

export const visuallyHidden = style({
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap'
});

export const foreground = style({
  position: 'relative',
  zIndex: 1
});
