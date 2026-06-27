import { CtaButton, type CtaButtonState, themeClass, typography, vars } from '@comma/design-system';
import type { Meta, StoryObj } from '@storybook/react-vite';

type CtaButtonStoryArgs = {
  children: string;
  state: CtaButtonState;
  disabled: boolean;
};

const ctaButtonStates = ['default', 'pressed', 'disabled'] satisfies CtaButtonState[];

const meta = {
  title: 'Design System/CtaButton',
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ctaButtonStates
    },
    children: {
      control: 'text'
    },
    disabled: {
      control: 'boolean'
    }
  },
  args: {
    children: '시작하기',
    state: 'default',
    disabled: false
  }
} satisfies Meta<CtaButtonStoryArgs>;

export default meta;

type Story = StoryObj<CtaButtonStoryArgs>;

const storySurfaceStyle: React.CSSProperties = {
  minHeight: 280,
  display: 'grid',
  placeItems: 'center',
  padding: 32,
  background: vars.color.backgroundPrimary,
  fontFamily: vars.font.body
};

const variantsSurfaceStyle: React.CSSProperties = {
  minHeight: 280,
  display: 'grid',
  gap: 16,
  alignContent: 'center',
  justifyContent: 'start',
  padding: 32,
  background: vars.color.backgroundPrimary,
  fontFamily: vars.font.body
};

const variantGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, 329px)',
  gap: 16
};

const stateLabelStyle: React.CSSProperties = {
  margin: 0,
  color: vars.color.textTertiary,
  ...typography.captionB
};

export const Playground: Story = {
  render: ({ children, state, disabled }) => (
    <div className={themeClass} style={storySurfaceStyle}>
      <CtaButton disabled={disabled} state={state}>
        {children}
      </CtaButton>
    </div>
  )
};

export const Variants: Story = {
  render: () => (
    <div className={themeClass} style={variantsSurfaceStyle}>
      <div style={variantGridStyle}>
        {ctaButtonStates.map((state) => (
          <div key={state} style={{ display: 'grid', gap: 8, width: 329 }}>
            <h3 style={stateLabelStyle}>{state === 'disabled' ? 'Disabled' : state}</h3>
            <CtaButton state={state}>시작하기</CtaButton>
          </div>
        ))}
      </div>
    </div>
  )
};
