import { createTheme } from '@vanilla-extract/css';

export const colors = {
  textPrimary: '#302C2C',
  textSecondary: '#6A6262',
  accent: '#5375B1',
  highlight: '#5375B14D',
  surface: '#FDFCFC',
  surfaceGlass: '#FDFCFCA8',
  surfaceSubtle: '#FDFCFC1A',
  line: '#C2BFBC',
  lineSubtle: '#C2BFBC1A',
  disabled: '#DBD8D7',
  neutral: '#58514C',
  neutralSubtle: '#58514C1A',
  error: '#FF6557',
  black: '#000000',
  white: '#FFFFFF',
  background: '#FDFCFC',
  foreground: '#302C2C',
  muted: '#6A6262',
  body: '#6A6262',
  inverse: '#FDFCFC'
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

export const typography = {
  display: {
    fontSize: '18px',
    lineHeight: '26px',
    fontWeight: '400'
  },
  heading1: {
    fontSize: '16px',
    lineHeight: '22px',
    fontWeight: '600'
  },
  heading2: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '400'
  },
  body1: {
    fontSize: '11px',
    lineHeight: '18px',
    fontWeight: '400'
  },
  body2: {
    fontSize: '9px',
    lineHeight: '16px',
    fontWeight: '400'
  },
  label1: {
    fontSize: '10px',
    lineHeight: '14px',
    fontWeight: '500'
  },
  label2: {
    fontSize: '9px',
    lineHeight: '14px',
    fontWeight: '500'
  },
  label3: {
    fontSize: '8px',
    lineHeight: '12px',
    fontWeight: '500'
  },
  caption: {
    fontSize: '8px',
    lineHeight: '12px',
    fontWeight: '400'
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
  space: spacing,
  radius: radii,
  typography,
  shadow: shadows,
  font: {
    body: 'Pretendard, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: '"Kepler Std Condensed Display", Pretendard, ui-serif, Georgia, serif'
  }
});
