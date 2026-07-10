import { style } from '@vanilla-extract/css';

export const cardStyle = style({
  width: 320,
  height: 404,
  backgroundColor: 'white',
  boxShadow: 'inset 0 4px 10px 0 #FFFFFF20, 0 4px 40px #00000020',
  boxSizing: 'border-box',
  padding: 32,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
});
