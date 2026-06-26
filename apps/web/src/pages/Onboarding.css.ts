import { style } from "@vanilla-extract/css";

export const container = style({
    backgroundImage: 'url("/images/onboardingBackground.svg")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    width: '100vw',
    height: '100vh',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
})