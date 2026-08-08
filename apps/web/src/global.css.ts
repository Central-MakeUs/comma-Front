import { globalFontFace, globalStyle } from '@vanilla-extract/css';

globalStyle('*', {
  boxSizing: 'border-box',
  overscrollBehavior: 'none'
});

globalStyle('html, body, #root', {
  height: '100%',
  margin: 0
});

globalStyle(':root', {
  vars: {
    '--app-max-width': '430px',
    '--app-width': 'min(100vw, var(--app-max-width))',
    '--safe-area-top': 'env(safe-area-inset-top, 0px)',
    '--safe-area-bottom': 'env(safe-area-inset-bottom, 0px)',
    '--safe-area-left': 'env(safe-area-inset-left, 0px)',
    '--safe-area-right': 'env(safe-area-inset-right, 0px)'
  }
});

globalStyle('html, body', {
  overflow: 'hidden',
  overscrollBehavior: 'none',
  touchAction: 'manipulation'
});

globalFontFace('Pretendard', {
  src: 'url("/fonts/PretendardVariable.woff2") format("woff2")',
  fontDisplay: 'swap',
  fontWeight: '100 900'
});

globalStyle('body', {
  background: '#F4F4F4',
  fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
});

globalStyle('#root', {
  width: '100%',
  maxWidth: 'var(--app-max-width)',
  height: '100dvh',
  margin: '0 auto',
  overflow: 'hidden',
  overscrollBehavior: 'none',
  position: 'relative',
  background: '#1A1814'
});
