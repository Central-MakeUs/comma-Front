import { style } from "@vanilla-extract/css";
import { typography, colors } from "@comma/design-system";

export const chipModal = style({
  position: 'fixed',
  width: 200,
  borderRadius: 20,
  backgroundColor: 'rgba(50, 46, 41, 0.66)',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  ...typography.bodyNormalR,
  color: colors.textTertiary,
  zIndex: 10
});