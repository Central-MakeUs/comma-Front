import { colors } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const page = style({
  minHeight: '100vh',
  width: '100vw',
  overflow: 'hidden',
  background: colors.backgroundPrimary
});

export const screen = style({
  position: 'relative',
  width: '100vw',
  minHeight: '100vh',
  overflow: 'hidden',
  color: colors.textPrimary,
  backgroundImage: 'url(/images/Home.png)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover'
});

export const dimOverlay = style({
  position: 'absolute',
  inset: 0,
  zIndex: 0,
  background: 'rgb(26 24 20 / 50%)',
  backdropFilter: 'blur(5px)',
  WebkitBackdropFilter: 'blur(5px)'
});

export const topGradient = style({
  display: 'none'
});

export const bottomGradient = style({
  position: 'absolute',
  top: 254,
  left: 0,
  right: 0,
  bottom: -2,
  zIndex: 1,
  background: 'linear-gradient(0deg, rgb(17 17 17 / 66%) 0%, rgb(17 17 17 / 0%) 100%)',
  pointerEvents: 'none'
});

export const content = style({
  position: 'relative',
  zIndex: 2,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: 48,
  paddingBottom: 132
});

export const header = style({
  width: '100%',
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

export const logo = style({
  width: 110,
  height: 24,
  display: 'block'
});

export const progress = style({
  marginTop: 36
});

export const question = style({
  marginTop: 64
});

export const navigation = style({
  position: 'absolute',
  left: '50%',
  bottom: 40,
  zIndex: 3,
  transform: 'translateX(-50%)'
});
