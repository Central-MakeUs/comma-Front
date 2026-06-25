import { createTheme } from '@vanilla-extract/css';

export const colors = {
  background: '#f5f5f2',
  foreground: '#171717',
  muted: '#6b6b63',
  body: '#3d3d38',
  inverse: '#ffffff'
} as const;

export const spacing = {
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px'
} as const;

export const radii = {
  control: '8px'
} as const;

export const [themeClass, vars] = createTheme({
  color: colors,
  space: spacing,
  radius: radii,
  font: {
    body: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  }
});
