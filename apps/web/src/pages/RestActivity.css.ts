import { colors, radii, typography } from '@comma/design-system';
import { createVar, style } from '@vanilla-extract/css';

export const backgroundImageVar = createVar();

export const page = style({
  width: '100vw',
  minHeight: '100vh',
  overflowX: 'hidden',
  background: colors.backgroundPrimary
});

export const screen = style({
  position: 'relative',
  width: '100vw',
  minHeight: '100dvh',
  overflowX: 'hidden',
  color: colors.textPrimary,
  background: colors.backgroundPrimary,
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      background: backgroundImageVar,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }
  }
});

export const photoPickerScreen = style({
  position: 'relative',
  width: '100vw',
  minHeight: '100dvh',
  overflowX: 'hidden',
  color: colors.textPrimary,
  background: colors.backgroundPrimary
});

export const dimOverlay = style({
  position: 'absolute',
  inset: 0,
  zIndex: 0,
  display: 'none',
  background: 'rgba(26, 24, 20, 0.5)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)'
});

export const dimOverlayVisible = style({
  display: 'block'
});

export const topGradient = style({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 0,
  height: 120,
  background: 'linear-gradient(rgba(17, 17, 17, 0.66) 0%, rgba(17, 17, 17, 0) 100%)',
  pointerEvents: 'none'
});

export const bottomGradient = style({
  position: 'absolute',
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 0,
  height: 600,
  background: 'linear-gradient(to top, rgba(17, 17, 17, 0.66) 0%, rgba(17, 17, 17, 0) 100%)',
  pointerEvents: 'none'
});

export const header = style({
  position: 'relative',
  zIndex: 2,
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '20px 32px'
});

export const progressHeader = style({
  position: 'relative',
  zIndex: 2,
  width: '100%',
  height: 112,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  padding: '68px 32px 20px'
});

export const photoPickerHeader = style({
  position: 'relative',
  zIndex: 2,
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  padding: '20px 32px'
});

export const iconButton = style({
  width: 32,
  height: 32,
  display: 'inline-grid',
  placeItems: 'center',
  border: 0,
  borderRadius: radii.pill,
  padding: 4,
  background: 'transparent',
  color: colors.iconPrimary,
  cursor: 'pointer'
});

export const content = style({
  position: 'relative',
  zIndex: 2,
  width: '100%',
  minHeight: 'calc(100dvh - 112px)',
  display: 'flex',
  flexDirection: 'column',
  padding: '0 0 188px'
});

export const heroText = style({
  width: '100%',
  padding: '0 36px'
});

export const title = style({
  ...typography.titleR,
  margin: 0,
  color: colors.textPrimary
});

export const description = style({
  ...typography.bodyReadingR,
  margin: '4px 0 0',
  color: colors.textTertiary
});

export const progressContent = style({
  position: 'relative',
  zIndex: 2,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 32
});

export const progressHeroText = style({
  width: '100%',
  padding: '0 36px'
});

export const participantRow = style({
  width: '100%',
  display: 'flex',
  alignItems: 'flex-end',
  gap: 4,
  padding: '0 32px'
});

export const participantCount = style({
  ...typography.engNum,
  fontSize: 80,
  lineHeight: '80px',
  letterSpacing: '-1.6px',
  color: colors.textPrimary,
  whiteSpace: 'nowrap'
});

export const participantLabel = style({
  ...typography.headlineR,
  flex: 1,
  minWidth: 0,
  height: 45,
  paddingBottom: 7,
  color: colors.textTertiary
});

export const uploadArea = style({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  marginTop: 32,
  padding: '0 24px'
});

export const upload = style({
  width: 'min(345px, calc(100vw - 48px))',
  height: 'min(438px, calc((100vw - 48px) * 1.27))',
  borderRadius: 100
});

export const photoPickerContent = style({
  position: 'relative',
  zIndex: 2,
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  padding: '32px 24px 0'
});

export const photoGrid = style({
  position: 'relative',
  zIndex: 2,
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gridAutoRows: 'calc((100vw - 6px) / 3)',
  gap: 3,
  marginTop: 28,
  paddingBottom: 40
});

export const cameraTile = style({
  width: '100%',
  height: '100%',
  display: 'grid',
  placeItems: 'center',
  border: 0,
  padding: 0,
  background: 'rgba(26, 24, 20, 0.33)',
  backdropFilter: 'blur(2px)',
  WebkitBackdropFilter: 'blur(2px)',
  color: colors.iconPrimary,
  cursor: 'pointer'
});

export const photoTile = style({
  width: '100%',
  height: '100%',
  border: 0,
  padding: 0,
  overflow: 'hidden',
  background: colors.backgroundPrimary,
  cursor: 'pointer'
});

export const photoTileImage = style({
  width: '100%',
  height: '100%',
  display: 'block',
  objectFit: 'cover'
});

export const emptyPhotoTile = style({
  width: '100%',
  height: '100%',
  background: colors.backgroundPrimary
});

export const hiddenInput = style({
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap'
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
  width: 'calc(100vw - 64px)',
  maxWidth: 329
});

export const tagSection = style({
  width: 'calc(100vw - 64px)',
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
  color: colors.textPrimary,
  whiteSpace: 'nowrap'
});

export const visibilityRow = style({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  padding: 0,
  pointerEvents: 'auto'
});

export const visibilityLabel = style({
  display: 'none'
});

export const footer = style({
  position: 'fixed',
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 3,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 24,
  justifyContent: 'center',
  padding: '64px 32px max(32px, env(safe-area-inset-bottom))',
  background: 'linear-gradient(to bottom, rgba(26, 24, 20, 0) 0%, #1A1814 46.767%, #1A1814 100%)',
  pointerEvents: 'none'
});

export const progressFooter = style({
  position: 'fixed',
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 3,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
  padding: '64px 32px max(32px, env(safe-area-inset-bottom))',
  background: 'linear-gradient(to bottom, rgba(26, 24, 20, 0) 0%, #1A1814 46.767%, #1A1814 100%)',
  pointerEvents: 'none'
});

export const doneButton = style({
  width: '100%',
  maxWidth: 329,
  pointerEvents: 'auto'
});

export const modalOverlay = style({
  position: 'fixed',
  inset: 0,
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 32,
  background: 'rgba(26, 24, 20, 0.66)',
  boxShadow: '0 4px 4px rgba(0, 0, 0, 0.25)'
});

export const modal = style({
  width: 'min(329px, calc(100vw - 64px))',
  minHeight: 284,
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  borderRadius: 36,
  padding: '24px 20px',
  background: 'rgba(194, 191, 188, 0.1)',
  boxShadow: 'inset -2px 0 40px rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)'
});

export const modalHeader = style({
  display: 'flex',
  justifyContent: 'flex-end'
});

export const modalText = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  marginTop: 8,
  marginBottom: 32
});

export const modalTitle = style({
  ...typography.headlineB,
  margin: 0,
  color: colors.textPrimary
});

export const modalDescription = style({
  ...typography.bodyNormalR,
  margin: 0,
  color: colors.textPrimary
});

export const modalActions = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  marginTop: 'auto'
});

const modalButton = style({
  width: '100%',
  height: 60
});

export const cancelButton = style([
  modalButton,
  {
    border: '1px solid rgba(194, 191, 188, 0.66)',
    background: 'transparent',
    boxShadow: 'none'
  }
]);

export const confirmButton = style([
  modalButton,
  {
    boxShadow: 'none'
  }
]);
