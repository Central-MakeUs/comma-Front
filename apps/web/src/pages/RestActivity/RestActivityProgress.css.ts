import { colors, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const header = style({
  position: 'relative',
  zIndex: 2,
  width: '100%',
  height: 112,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  padding: '20px 32px 20px'
});

export const content = style({
  position: 'relative',
  zIndex: 2,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 32
});

export const heroText = style({
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
  color: colors.textTertiary,
  display: 'inline-flex',
  alignItems: 'flex-end'
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
  gap: 8,
  padding: '64px 32px max(32px, env(safe-area-inset-bottom))',
  background: 'linear-gradient(to bottom, rgba(26, 24, 20, 0) 0%, #1A1814 46.767%, #1A1814 100%)',
  pointerEvents: 'none'
});
