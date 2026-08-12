import { colors, radii, typography } from '@comma/design-system';
import { style, styleVariants } from '@vanilla-extract/css';

export const screen = style({
  background: colors.backgroundPrimary
});

export const header = style({
  position: 'sticky',
  top: 0,
  zIndex: 2,
  width: '100%',
  height: 'calc(60px + var(--safe-area-top))',
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr',
  alignItems: 'center',
  padding: 'var(--safe-area-top) 32px 0',
  background: colors.backgroundPrimary
});

export const title = style({
  ...typography.headlineB,
  gridColumn: 2,
  margin: 0,
  color: colors.textPrimary,
  textAlign: 'center'
});

export const viewControls = style({
  gridColumn: 3,
  justifySelf: 'end',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 10,
  minInlineSize: 0,
  border: 0,
  margin: 0,
  padding: 0
});

export const viewButton = style({
  width: 24,
  height: 24,
  display: 'inline-grid',
  placeItems: 'center',
  border: 0,
  borderRadius: radii.control,
  padding: 0,
  background: 'transparent',
  color: colors.iconSecondary,
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${colors.textPrimary}`,
      outlineOffset: 3
    }
  }
});

export const viewButtonState = styleVariants({
  active: {
    color: colors.iconPrimary
  },
  inactive: {
    color: colors.iconSecondary
  }
});

export const list = style({
  width: '100%',
  display: 'grid',
  justifyItems: 'stretch',
  gap: 'clamp(24px, 4.69dvh, 40px)',
  paddingBottom: 0
});

export const listCard = style({
  width: '100%'
});

export const listImage = style({
  width: '100%'
});

export const grid = style({
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 165px)',
  justifyContent: 'center',
  columnGap: 15,
  rowGap: 32,
  padding: '0 24px'
});

export const scrollContainer = style({
  height: 'calc(100dvh - 60px - var(--safe-area-top))',
  paddingBottom: 'calc(140px + var(--safe-area-bottom))'
});

export const loadingWrapper = style({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

export const alertText = style({
  ...typography.bodyReadingR,
  color: colors.textTertiary
});
