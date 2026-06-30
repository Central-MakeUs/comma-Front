import { style } from '@vanilla-extract/css';
import { colors, radii, shadows, typography } from '@comma/design-system';

export const container = style({
    width: '100vw',
    height: '100vh',
    boxSizing: 'border-box',
    paddingTop: 48,
    selectors: {
        '&::before': {
            content: '',
            position: 'absolute',
            inset: 0,
            background: `url('/images/rest_1.svg') center / cover no-repeat`,
            zIndex: -10,

        },
        '&::after': {
            content: '',
            position: 'absolute',
            background: `rgba(26, 24, 20, 0.5)`,
            backdropFilter: 'blur(40px)',
            inset: 0,
            zIndex: -1,
        }
    }
})

export const title = style({
    ...typography.titleR,
    color: colors.textPrimary,
    marginBottom: 4,
})

export const subTitle = style({
    ...typography.bodyReadingR,
    color: colors.textTertiary,
    marginBottom: 30,
})

export const rowScrollContainer = style({
    width: '100%',
    height: 354,
    overflowX: 'auto',
    scrollSnapType: 'x mandatory',
    '::-webkit-scrollbar': {
        display: 'none',
    }
})

export const rowScrollWrapper = style({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 'max-content',
    paddingLeft: 'calc((100vw - 280px) / 2)',
    paddingRight: 'calc((100vw - 280px) / 2)',
})

export const imageUploadStyle = style({
    selectors: {
        '&::after': {
            content: '',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            zIndex: 1,
            background: 'linear-gradient(rgba(17, 17, 17, 0) 0%, rgba(17, 17, 17, 0.66) 100%)',
            boxShadow: 'inset 0 4px 10px 0 rgba(255, 255, 255, 0.2), 0 4px 40px 0 rgba(0, 0, 0, 0.2)'
        }
    }
})

export const dot = style({
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'rgba(252, 252, 252, 0.15)',
})

export const ctaButtonStyle = style({
    margin: '0 auto',
    color: colors.textPrimary,
    marginBottom: 37,
})

export const navStyle = style({
    position: 'absolute',
    bottom: 40,
    left: '50%',
    transform: 'translateX(-50%)',
    borderRadius: radii.pill,
    boxShadow: `${shadows.glassInsetStrong}, 0 8px 24px rgb(0 0 0 / 18%)`,
    fontFamily: typography.bodyNormalR.fontFamily,
})

export const imageNumStyle = style({
    ...typography.engNum,
    color: colors.textPrimary,
})

export const imageText = style({
    ...typography.headlineR,
    color: colors.textSecondary,
})