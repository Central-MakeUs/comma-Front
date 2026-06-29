import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../theme.css';

export const textInputRoot = style({
  width: 335,
  display: 'grid',
  gap: 8,
  boxSizing: 'border-box',
  color: vars.color.textPrimary,
  fontFamily: vars.font.body
});

export const textInputRootVariant = styleVariants({
  bar: {
    height: 48,
    gap: 0
  },
  field: {
    minHeight: 84,
    gap: 12
  },
  fieldNoTitle: {
    minHeight: 48,
    gap: 12
  }
});

export const textInputRootState = styleVariants({
  default: {},
  focus: {},
  type: {},
  filled: {},
  filledPlus: {}
});

export const textInputLabel = style({
  minHeight: 24,
  display: 'block',
  overflow: 'hidden',
  padding: '0 4px',
  color: vars.color.textSecondary,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: vars.typography.bodyNormalB.fontSize,
  fontWeight: vars.typography.bodyNormalB.fontWeight,
  lineHeight: vars.typography.bodyNormalB.lineHeight,
  letterSpacing: vars.typography.bodyNormalB.letterSpacing
});

export const textInputControl = style({
  position: 'relative',
  width: '100%',
  minWidth: 0,
  display: 'block'
});

export const textInputControlVariant = styleVariants({
  bar: {
    height: 48
  },
  field: {
    height: 48
  },
  fieldNoTitle: {
    height: 48
  }
});

export const textInputControlType = styleVariants({
  singleLine: {},
  fieldMultiLine: {},
  fieldNoTitleMultiLine: {}
});

export const textInputElement = style({
  width: '100%',
  height: '100%',
  display: 'block',
  boxSizing: 'border-box',
  border: '1px solid transparent',
  margin: 0,
  background: 'rgb(194 191 188 / 10%)',
  color: vars.color.textPrimary,
  fontFamily: vars.font.body,
  fontSize: vars.typography.bodyNormalR.fontSize,
  fontWeight: vars.typography.bodyNormalR.fontWeight,
  lineHeight: vars.typography.bodyNormalR.lineHeight,
  letterSpacing: vars.typography.bodyNormalR.letterSpacing,
  outline: 'none',
  boxShadow: vars.shadow.glassInset,
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  transition: 'border-color 0.18s ease-out, box-shadow 0.18s ease-out, color 0.18s ease-out',
  selectors: {
    '&::placeholder': {
      color: vars.color.textTertiary,
      opacity: 1
    },
    '&:focus-visible': {
      borderColor: vars.color.linePrimary,
      boxShadow: vars.shadow.glassInsetStrong
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.56
    }
  }
});

export const textInputElementVariant = styleVariants({
  bar: {
    borderRadius: 100,
    padding: '11px 15px 11px 19px'
  },
  field: {
    borderRadius: 100,
    padding: '11px 15px 11px 19px'
  },
  fieldNoTitle: {
    borderRadius: 100,
    padding: '11px 15px 11px 19px'
  }
});

export const textInputElementState = styleVariants({
  default: {
    borderColor: 'transparent',
    color: vars.color.textPrimary
  },
  focus: {
    borderColor: vars.color.linePrimary,
    color: vars.color.textPrimary,
    background: 'rgb(88 81 76 / 10%)',
    boxShadow: vars.shadow.glassInsetStrong
  },
  type: {
    borderColor: vars.color.linePrimary,
    color: vars.color.textPrimary,
    background: 'rgb(88 81 76 / 10%)',
    boxShadow: vars.shadow.glassInsetStrong
  },
  filled: {
    borderColor: 'transparent',
    color: vars.color.textPrimary,
    background: 'rgb(194 191 188 / 10%)'
  },
  filledPlus: {
    borderColor: 'transparent',
    color: vars.color.textPrimary,
    background: 'rgb(194 191 188 / 10%)',
    paddingRight: 49
  }
});

export const textInputElementBarType = style({
  color: 'transparent',
  caretColor: 'transparent',
  selectors: {
    '&::placeholder': {
      color: 'transparent'
    }
  }
});

export const textInputElementVisualCaret = style({
  caretColor: 'transparent'
});

export const textInputTypeOverlay = style({
  position: 'absolute',
  left: 20,
  top: 12,
  maxWidth: 299,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  overflow: 'hidden',
  pointerEvents: 'none'
});

export const textInputTypeText = style({
  display: 'block',
  overflow: 'hidden',
  color: vars.color.textPrimary,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: vars.typography.bodyNormalR.fontSize,
  fontWeight: vars.typography.bodyNormalR.fontWeight,
  lineHeight: vars.typography.bodyNormalR.lineHeight,
  letterSpacing: vars.typography.bodyNormalR.letterSpacing
});

export const textInputCaret = style({
  width: 0,
  height: 18,
  borderLeft: `1.5px solid ${vars.color.textPrimary}`,
  flexShrink: 0
});

export const textInputFocusCaret = style([
  textInputCaret,
  {
    position: 'absolute',
    left: 18,
    top: 15,
    pointerEvents: 'none'
  }
]);

export const textInputHelper = style({
  display: 'flex',
  minHeight: 21,
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '0 4px',
  overflow: 'hidden',
  marginTop: -4,
  color: vars.color.textSecondary,
  fontSize: vars.typography.labelReadingR.fontSize,
  fontWeight: vars.typography.labelReadingR.fontWeight,
  lineHeight: vars.typography.labelReadingR.lineHeight,
  letterSpacing: vars.typography.labelReadingR.letterSpacing
});

export const textInputHelperText = style({
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
});

export const textInputCounter = style({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  flexShrink: 0,
  color: vars.color.textSecondary,
  fontSize: vars.typography.labelReadingR.fontSize,
  fontWeight: vars.typography.labelReadingR.fontWeight,
  lineHeight: vars.typography.labelReadingR.lineHeight,
  letterSpacing: vars.typography.labelReadingR.letterSpacing
});

export const textInputCounterCurrent = style({
  minWidth: 9,
  color: vars.color.textPrimary,
  textAlign: 'right',
  fontWeight: vars.typography.labelReadingB.fontWeight
});

export const textInputPlusControl = style({
  position: 'absolute',
  top: '50%',
  right: 16,
  width: 24,
  height: 24,
  display: 'grid',
  placeItems: 'center',
  border: 0,
  borderRadius: 0,
  padding: 0,
  background: 'transparent',
  color: vars.color.iconPrimary,
  transform: 'translateY(-50%)',
  cursor: 'default',
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${vars.color.textPrimary}`,
      outlineOffset: 2
    }
  }
});

export const textInputPlusButton = style([
  textInputPlusControl,
  {
    cursor: 'pointer'
  }
]);

export const textInputPlusIcon = style({
  width: 24,
  height: 24,
  display: 'block',
  flexShrink: 0
});
