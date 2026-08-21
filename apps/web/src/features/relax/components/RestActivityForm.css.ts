import { colors, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';
import * as layoutStyles from '../../../shared/components/layout/layout.css';

export const header = layoutStyles.safeAreaHeaderX;

export const content = style({
  position: 'relative',
  zIndex: 2,
  width: '100%',
  minHeight: '100svh',
  display: 'flex',
  flexDirection: 'column',
  touchAction: 'pan-y',
  padding: '0 0 220px'
});

export const heroText = style({
  width: '100%',
  padding: '0 36px'
});

export const uploadArea = style({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  flexShrink: 0,
  marginTop: 32,
  padding: '0 24px'
});

export const formStack = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 32,
  marginTop: 24
});

export const input = style({
  width: 'calc(var(--app-width) - 64px)',
  maxWidth: 329
});

export const tagSection = style({
  width: 'calc(var(--app-width) - 64px)',
  maxWidth: 329,
  display: 'flex',
  flexDirection: 'column',
  gap: 10
});

export const tagList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
  width: '100%',
  padding: '0 4px'
});

export const tag = style({
  ...typography.bodyNormalB,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  color: colors.textPrimary,
  whiteSpace: 'nowrap'
});

export const tagRemoveButton = style({
  width: 20,
  height: 20,
  display: 'inline-grid',
  placeItems: 'center',
  flexShrink: 0,
  border: 0,
  borderRadius: '50%',
  padding: 1,
  background: 'transparent',
  color: colors.iconSecondary,
  cursor: 'pointer',
  lineHeight: 0,
  transform: 'translateY(-1px)'
});

export const tagRemoveIcon = style({
  width: 18,
  height: 18,
  display: 'block'
});

export const visibilityRow = style({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  padding: 0,
  pointerEvents: 'auto'
});

export const visibilityLabel = layoutStyles.visuallyHidden;

export const footer = style([
  layoutStyles.fixedBottomAction,
  {
    gap: 24,
    justifyContent: 'center'
  }
]);
