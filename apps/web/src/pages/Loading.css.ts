import { style } from "@vanilla-extract/css";

export const container = style({
    backgroundImage: 'url(/images/loading_background.svg)',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    paddingLeft: 32,
    paddingRight: 32,
    boxSizing: 'border-box',
})

export const title = style({
    fontFamily: 'Pretendard, sans-serif',
    fontSize: 32,
    fontWeight: 200,
    color: '#FDFCFC',
})

export const desc = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: 16,
  fontWeight: 400,
  color: '#C2BFBC',
  marginTop: 16,
});