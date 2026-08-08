import { style } from '@vanilla-extract/css';

export const cardStyle = style({
  width: 320,
  height: 404,
  backgroundColor: 'white',
  boxShadow: 'inset 0 4px 10px 0 #FFFFFF20, 0 4px 40px #00000020',
  boxSizing: 'border-box',
  padding: 32,
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
});

export const cardBackgroundImage = style({
  position: 'absolute',
  inset: 0,
  zIndex: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover'
});

export const cardGradient = style({
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  background: 'linear-gradient(rgba(17, 17, 17, 0) 0%, #111111 100%)'
});

export const cardContent = style({
  position: 'relative',
  zIndex: 2
});
