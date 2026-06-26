import { createTheme } from '@vanilla-extract/css';

export const primitiveColors = {
  grayscale50: '#FDFCFC',
  grayscale300: '#DBD8D7',
  grayscale400: '#C2BFBC',
  grayscale700: '#58514C',
  grayscale800: '#423D38',
  grayscale900: '#322E29',
  grayscaleBlack: '#1A1814',
  error: '#FF6557'
} as const;

export const semanticColors = {
  backgroundPrimary: primitiveColors.grayscale900,
  backgroundFill: primitiveColors.grayscale800,
  textPrimary: primitiveColors.grayscale50,
  textSecondary: primitiveColors.grayscale300,
  textTertiary: primitiveColors.grayscale400,
  textBlack: primitiveColors.grayscale900,
  textBlackSecondary: primitiveColors.grayscale700,
  iconPrimary: primitiveColors.grayscale50,
  iconSecondary: primitiveColors.grayscale400,
  iconBlack: primitiveColors.grayscale900,
  linePrimary: primitiveColors.grayscale400,
  lineSecondary: primitiveColors.grayscale700,
  lineTertiary: primitiveColors.grayscale800,
  error: primitiveColors.error
} as const;

export const colors = semanticColors;

export const grid = {
  columnCount: '4',
  margin: '32px',
  gutter: '12px'
} as const;

export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  10: '40px',
  12: '48px',
  15: '60px'
} as const;

export const radii = {
  xs: '2.5px',
  sm: '4px',
  md: '5px',
  lg: '8px',
  pill: '999px',
  control: '5px'
} as const;

const pretendardFont =
  'Pretendard, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const outfitFont =
  'Outfit, Pretendard, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const keplerCondensedFont = '"Kepler Std", Pretendard, ui-serif, Georgia, serif';

export const typography = {
  titleR: {
    fontFamily: pretendardFont,
    fontSize: '32px',
    lineHeight: '43.2px',
    fontWeight: '200',
    letterSpacing: '-1.28px'
  },
  headingB: {
    fontFamily: pretendardFont,
    fontSize: '24px',
    lineHeight: '33.6px',
    fontWeight: '500',
    letterSpacing: '-0.96px'
  },
  headingR: {
    fontFamily: pretendardFont,
    fontSize: '24px',
    lineHeight: '33.6px',
    fontWeight: '300',
    letterSpacing: '-0.96px'
  },
  headlineB: {
    fontFamily: pretendardFont,
    fontSize: '20px',
    lineHeight: '28px',
    fontWeight: '500',
    letterSpacing: '-0.8px'
  },
  headlineR: {
    fontFamily: pretendardFont,
    fontSize: '20px',
    lineHeight: '28px',
    fontWeight: '300',
    letterSpacing: '-0.8px'
  },
  bodyNormalB: {
    fontFamily: pretendardFont,
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: '600',
    letterSpacing: '-0.32px'
  },
  bodyNormalR: {
    fontFamily: pretendardFont,
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: '400',
    letterSpacing: '-0.32px'
  },
  bodyReadingB: {
    fontFamily: pretendardFont,
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: '600',
    letterSpacing: '-0.32px'
  },
  bodyReadingR: {
    fontFamily: pretendardFont,
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: '400',
    letterSpacing: '-0.32px'
  },
  labelNormalB: {
    fontFamily: pretendardFont,
    fontSize: '14px',
    lineHeight: '21px',
    fontWeight: '600',
    letterSpacing: '-0.28px'
  },
  labelNormalR: {
    fontFamily: pretendardFont,
    fontSize: '14px',
    lineHeight: '21px',
    fontWeight: '400',
    letterSpacing: '-0.28px'
  },
  labelReadingB: {
    fontFamily: pretendardFont,
    fontSize: '14px',
    lineHeight: '21px',
    fontWeight: '600',
    letterSpacing: '-0.28px'
  },
  labelReadingR: {
    fontFamily: pretendardFont,
    fontSize: '14px',
    lineHeight: '21px',
    fontWeight: '400',
    letterSpacing: '-0.28px'
  },
  captionB: {
    fontFamily: pretendardFont,
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: '600',
    letterSpacing: '-0.24px'
  },
  captionR: {
    fontFamily: pretendardFont,
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: '500',
    letterSpacing: '-0.24px'
  },
  engNum: {
    fontFamily: keplerCondensedFont,
    fontSize: '48px',
    lineHeight: '48px',
    fontWeight: '400',
    letterSpacing: '-0.96px'
  },
  systemEyebrow: {
    fontFamily: outfitFont,
    fontSize: '24px',
    lineHeight: '32.4px',
    fontWeight: '500',
    letterSpacing: '-0.24px'
  },
  systemSection: {
    fontFamily: outfitFont,
    fontSize: '20px',
    lineHeight: '27px',
    fontWeight: '500',
    letterSpacing: '-0.2px'
  }
} as const;

export const shadows = {
  card: '0 2px 4px rgb(0 0 0 / 15%)',
  overlay: '0 0 4px rgb(0 0 0 / 15%)',
  glassInset: 'inset -2px 0 10px rgb(255 255 255 / 33%)',
  glassInsetStrong: 'inset -2px 0 10px rgb(255 255 255 / 50%)'
} as const;

export const [themeClass, vars] = createTheme({
  color: colors,
  grid,
  space: spacing,
  radius: radii,
  typography,
  shadow: shadows,
  font: {
    body: pretendardFont,
    display: keplerCondensedFont,
    label: outfitFont
  }
});
