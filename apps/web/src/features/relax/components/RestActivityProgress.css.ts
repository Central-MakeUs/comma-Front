import { colors, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';
import * as layoutStyles from '../../../shared/components/layout/layout.css';

export const header = style([
  layoutStyles.safeAreaHeaderX,
  {
    height: 'calc(112px + var(--safe-area-top))',
    alignItems: 'flex-start'
  }
]);

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
  padding: '0 32px'
});

export const participantRow = style({
  width: '100%',
  display: 'flex',
  alignItems: 'baseline',
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
  color: colors.textTertiary,
  whiteSpace: 'nowrap'
});

export const footer = style([
  layoutStyles.fixedBottomAction,
  {
    gap: 8
  }
]);

export const footerMessage = style({
  ...typography.bodyReadingR,
  width: '100%',
  margin: 0,
  color: colors.textSecondary,
  textAlign: 'center'
});
