import { colors, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';
import * as layoutStyles from '../../../shared/components/layout/layout.css';

export const container = style({
  isolation: 'isolate',
  background: colors.backgroundPrimary
});

export const backgroundImage = style([
  layoutStyles.absoluteFillImage,
  {
    zIndex: 0
  }
]);

export const backgroundBlur = style([
  layoutStyles.absoluteFill,
  {
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    zIndex: 1,
    backgroundColor: '#17151096'
  }
]);

export const foreground = style([
  layoutStyles.scrollScreen,
  {
    zIndex: 2,
    background: 'transparent'
  }
]);

export const header = style({
  width: '100%',
  color: colors.textPrimary,
  ...typography.headlineB,
  padding: 'calc(16px + var(--safe-area-top)) 16px 16px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative'
});

export const headerIconContainer = style({
  position: 'absolute',
  top: 'calc(50% + (var(--safe-area-top) / 2))',
  transform: 'translateY(-50%)',
  right: 22,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

export const settingsButton = style({
  border: 'none',
  background: 'transparent',
  width: 44,
  height: 44,
  color: colors.iconSecondary
});

export const profileRow = style({
  width: '100%',
  marginTop: 8,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '0 32px',
  marginBottom: 32
});

export const profileText = style({
  display: 'flex',
  flexDirection: 'column'
});

export const title = style({
  ...typography.titleR,
  color: colors.textPrimary
});

export const desc = style({
  ...typography.labelNormalR,
  color: colors.textTertiary,
  marginTop: 8
});

export const nicknameEditBtn = style({
  width: 104,
  height: 36
});

export const activitySection = style({
  position: 'relative'
});

export const carouselViewport = style({
  position: 'relative',
  overflow: 'hidden'
});

export const carouselTrack = style({
  display: 'flex',
  alignItems: 'center'
});

export const cardsLayer = style({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none'
});

export const navStyle = style({
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  backgroundColor: '#1A181310'
});

export const alertText = style({
  ...typography.bodyReadingR,
  color: colors.textTertiary,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center'
});

export const emptyReportOverlay = style([
  alertText,
  {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
    pointerEvents: 'none'
  }
]);
