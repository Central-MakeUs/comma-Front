import { colors, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const container = style({
  backgroundColor: '#1A1814',
  backgroundImage: 'url(/images/loading_background.png)',
  width: '100vw',
  height: '100dvh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  paddingTop: 'var(--safe-area-top)',
  paddingBottom: 'var(--safe-area-bottom)',
  paddingLeft: 32,
  paddingRight: 32,
  boxSizing: 'border-box'
});

export const title = style({
  ...typography.titleR,
  color: colors.textPrimary
});

export const desc = style({
  ...typography.bodyReadingR,
  color: colors.textTertiary,
  marginTop: 16
});
