import { globalFontFace, globalStyle } from '@vanilla-extract/css';

globalStyle('*', {
  boxSizing: 'border-box'
});

globalStyle('html, body, #root', {
  minHeight: '100%',
  margin: 0
});

globalStyle(':root', {
  vars: {
    '--safe-area-top': 'env(safe-area-inset-top, 0px)',
    '--safe-area-bottom': 'env(safe-area-inset-bottom, 0px)',
    '--safe-area-left': 'env(safe-area-inset-left, 0px)',
    '--safe-area-right': 'env(safe-area-inset-right, 0px)'
  }
});

globalStyle('html, body', {
  touchAction: 'manipulation'
});

globalFontFace('Pretendard', {
  src: 'url("/fonts/PretendardVariable.woff2") format("woff2")',
  fontDisplay: 'swap',
  fontWeight: '100 900'
});

globalStyle('body', {
  fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
});
