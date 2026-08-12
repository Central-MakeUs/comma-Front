import { colors, typography } from '@comma/design-system';
import { style } from '@vanilla-extract/css';

export const questionNum = style({
  ...typography.engNum,
  color: colors.textTertiary,
  fontSize: 32,
  marginRight: 4
});

export const questionContainer = style({
  ...typography.bodyNormalB,
  color: colors.textTertiary,
  marginBottom: 20
});

export const reportSection = style({
  width: '100%',
  padding: '0 32px calc(155px + var(--safe-area-bottom))'
});

export const reportSectionWithContent = style({
  marginTop: 48
});

export const followingQuestion = style({
  marginTop: 40
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
