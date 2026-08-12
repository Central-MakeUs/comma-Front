import { style } from '@vanilla-extract/css';
import { shadows } from '../theme.css';

export const sheet = style({
  position: 'absolute',
  right: 0,
  bottom: 0,
  left: 0,
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: '36px 36px 0 0',
  background: 'rgba(194, 191, 188, 0.1)',
  boxShadow: shadows.glassInset,
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)'
});
