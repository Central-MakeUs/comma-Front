import { colors, typography } from '@comma/design-system';
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

export const navStyle = style({
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: 40,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    backgroundColor: '#1A181310',
})