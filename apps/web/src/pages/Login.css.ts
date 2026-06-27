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
  fontFamily: 'Pretendard, sans-serif',
  fontSize: 32,
  fontWeight: 200,
  color: '#FDFCFC',
  lineHeight: '135%',
});

export const desc = style({
  fontFamily: 'Pretendard, sans-serif',
  fontSize: 16,
  fontWeight: 400,
  color: '#C2BFBC',
  marginTop: 16
});

export const agreementNotice = style({
  color: '#C2BFBC',
  fontFamily: 'Pretendard, sans-serif',
  fontSize: 12,
  fontWeight: 500,
  textAlign: 'center'
});

export const agreementAccent = style({
  color: '#DBD8D7',
  textDecoration: 'underline',
  fontWeight: 600
});

const buttonBase = style({
  width: '100%',
  height: 60,
  borderRadius: 100,
  fontFamily: 'Pretendard, sans-serif',
  fontWeight: 500,
  fontSize: 20,
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '5px'
});

export const kakaoBtn = style([
  buttonBase,
  {
    backgroundColor: '#FEE500',
    color: '#322E29',
    marginBottom: 8
  }
]);

export const appleBtn = style([
  buttonBase,
  {
    backgroundColor: '#1A1814',
    color: '#FDFCFC',
    marginBottom: 8
  }
]);

export const googleBtn = style([
  buttonBase,
  {
    backgroundColor: '#FDFCFC',
    color: '#322E29',
    marginBottom: 24
  }
]);
