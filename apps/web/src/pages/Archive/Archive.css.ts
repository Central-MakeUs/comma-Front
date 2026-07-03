import { colors, radii, typography } from '@comma/design-system';
import { globalStyle, style, styleVariants } from '@vanilla-extract/css';

export const page = style({
  width: '100vw',
  minHeight: '100vh',
  overflowX: 'hidden',
  background: colors.backgroundPrimary
});

export const screen = style({
  position: 'relative',
  width: '100%',
  minHeight: '100dvh',
  overflowX: 'hidden',
  color: colors.textPrimary,
  background: colors.backgroundPrimary,
  paddingTop: 48,
  paddingBottom: 140
});

export const header = style({
  position: 'sticky',
  top: 0,
  zIndex: 2,
  width: '100%',
  height: 60,
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr',
  alignItems: 'center',
  padding: '0 32px',
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
  gap: 40
});

export const listCard = style({
  width: '100% !important'
});

globalStyle(`${listCard} > div:first-child`, {
  width: '100% !important'
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

export const navigation = style({
  position: 'fixed',
  left: '50%',
  bottom: 40,
  zIndex: 3,
  transform: 'translateX(-50%)'
});
