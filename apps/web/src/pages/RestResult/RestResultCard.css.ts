import { style } from '@vanilla-extract/css';

export const imageUploadStyle = style({
  selectors: {
    '&::after': {
      content: '',
      position: 'absolute',
      inset: 0,
      borderRadius: 'inherit',
      zIndex: 1,
      background: 'linear-gradient(rgba(17, 17, 17, 0) 0%, rgba(17, 17, 17, 0.66) 100%)',
      boxShadow: 'inset 0 4px 10px 0 rgba(255, 255, 255, 0.2), 0 4px 40px 0 rgba(0, 0, 0, 0.2)'
    }
  }
});
