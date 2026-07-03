import { globalFontFace, globalStyle } from '@vanilla-extract/css';

globalStyle('*', {
  boxSizing: 'border-box'
});

globalStyle('html, body, #root', {
  minHeight: '100%',
  margin: 0
});

globalFontFace('Pretendard', {
  src: 'url("/fonts/PretendardVariable.woff2") format("woff2")',
  fontDisplay: 'swap',
  fontWeight: '100 900'
});

globalStyle('body', {
  fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
});
