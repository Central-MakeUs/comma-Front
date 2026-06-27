export const brand = {
  name: 'Comma'
} as const;

export type { DesignAsset } from './assets';
export { designAssets } from './assets';
export type { ActionButtonVariants } from './components.css';
export { actionButton, description, eyebrow, panel, screen, title } from './components.css';
export {
  colors,
  grid,
  primitiveColors,
  radii,
  semanticColors,
  shadows,
  spacing,
  themeClass,
  typography,
  vars
} from './theme.css';
