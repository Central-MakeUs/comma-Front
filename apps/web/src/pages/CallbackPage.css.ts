import { style } from '@vanilla-extract/css';

export const container = style({
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: '#1A1814',
  width: '100%',
  height: '100vh'
});

export const backgroundImage = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover'
});
