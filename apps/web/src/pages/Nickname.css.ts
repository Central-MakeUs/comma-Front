import { style } from '@vanilla-extract/css';

export const container = style({
  backgroundImage: 'url("/images/onboardingBackground_blur.svg")',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  width: '100vw',
  height: '100vh',
  backgroundPosition: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: 32,
  paddingRight: 32,
  boxSizing: 'border-box'
});

export const title = style({
    fontSize: 32,
    fontWeight: 200,
    fontFamily: 'Pretendard, sans-serif',
    lineHeight: '135%',
    color: '#FDFCFC',
})

export const desc = style({
    fontSize: 16,
    fontWeight: 500,
    fontFamily: 'Pretendard, sans-serif',
    lineHeight: '150%',
    color: '#C2BFBC',
    marginTop: 16,
})

export const agreementNotice = style({
  color: '#C2BFBC',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: 12,
  fontWeight: 500,
  textAlign: 'center',
  marginBottom: 24,
});

export const agreementAccent = style({
  color: '#DBD8D7',
  textDecoration: 'underline',
  fontWeight: 600
});