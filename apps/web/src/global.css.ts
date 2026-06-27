import { globalFontFace, globalStyle } from '@vanilla-extract/css';

globalStyle('*', {
  boxSizing: 'border-box'
});

globalStyle('body', {
  margin: 0
});

globalFontFace('Pretendard', {
  src: 'url("/fonts/PretendardVariable.woff2") format("woff2")',
  fontDisplay: 'swap',
  fontWeight: '100 900'
});

globalStyle('body', {
  margin: 0,
  fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
});
