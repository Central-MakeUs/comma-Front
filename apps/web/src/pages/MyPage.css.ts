import { colors, shadows, typography } from '@comma/design-system';
import { style, createVar } from '@vanilla-extract/css';

export const backgroundImageVar = createVar();

export const container = style({
    width: '100vw',
    minHeight: '100dvh',
    position: 'relative',
    selectors: {
        '&::before': {
            content: '',
            position: 'absolute',
            inset: 0,
            background: backgroundImageVar,
            zIndex: -10,
        },
        '&::after': {
            content: '',
            position: 'absolute',
            inset: 0,
            backdropFilter: 'blur(40px)',
            zIndex: -1,
            backgroundColor: '#1A181450',
        }
    }
})

export const header = style({
    width: '100%',
    color: colors.textPrimary,
    ...typography.headlineB,
    padding: 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
})

export const headerIconContainer = style({
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: 22,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
})

export const title = style({
    ...typography.titleR,
    color: colors.textPrimary,
})

export const desc = style({
    ...typography.labelNormalR,
    color: colors.textTertiary,
    marginTop: 8,
})

export const nicknameEditBtn = style({
    width: 104,
    height: 36,
})

export const questionNum = style({
    ...typography.engNum,
    color: colors.textTertiary,
    fontSize: 32,
    marginRight: 4,
})

export const questionContainer = style({
    ...typography.bodyNormalB,
    color: colors.textTertiary,
    marginBottom: 20,
})

export const answerNum = style({
    ...typography.engNum,
    color: colors.textPrimary,
    fontSize: 24,
    marginRight: 6,
})

export const answerContainer = style({
    ...typography.labelNormalR,
    color: colors.textPrimary,
})

export const gaugeBar = style({
    backgroundColor: colors.lineSecondary,
    width: 120,
    height: 4,
    borderRadius: 100,
})

export const gaugeBarInner = style({
    backgroundColor: colors.textPrimary,
    height: 4,
    borderRadius: 100,
})

export const gaugeText = style({
    ...typography.bodyNormalR,
    color: colors.textTertiary,
    marginLeft: 16,
})

export const navStyle = style({
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: 40,
})

export const cardStyle = style({
    width: 320,
    height: 404,
    backgroundColor: 'white',
    boxShadow: 'inset 0 4px 10px 0 #FFFFFF20, 0 4px 40px #00000020',
    boxSizing: 'border-box',
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
})