import {
  SmallButton,
  type SmallButtonState,
  themeClass,
  typography,
  vars
} from '@comma/design-system';
import type { Meta, StoryObj } from '@storybook/react-vite';

type SmallButtonStoryArgs = {
  label: string;
  state: SmallButtonState;
};

const smallButtonStates = ['default', 'pressed'] satisfies SmallButtonState[];

const meta = {
  title: 'Design System/SmallButton',
  argTypes: {
    state: {
      control: 'inline-radio',
      options: smallButtonStates
    },
    label: {
      control: 'text'
    }
  },
  args: {
    label: '기분',
    state: 'default'
  }
} satisfies Meta<SmallButtonStoryArgs>;

export default meta;

type Story = StoryObj<SmallButtonStoryArgs>;

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
  gridTemplateColumns: 'repeat(auto-fit, 60px)',
  gap: 16
};

const stateLabelStyle: React.CSSProperties = {
  margin: 0,
  color: vars.color.textTertiary,
  ...typography.captionB
};

export const Default: Story = {
  render: ({ label }) => (
    <div className={themeClass} style={storySurfaceStyle}>
      <SmallButton label={label} />
    </div>
  )
};

export const Pressed: Story = {
  args: {
    state: 'pressed'
  },
  render: ({ label }) => (
    <div className={themeClass} style={storySurfaceStyle}>
      <SmallButton label={label} state="pressed" />
    </div>
  )
};

export const Variants: Story = {
  render: () => (
    <div className={themeClass} style={variantsSurfaceStyle}>
      <div style={variantGridStyle}>
        {smallButtonStates.map((state) => (
          <div key={state} style={{ display: 'grid', gap: 8, width: 60 }}>
            <h3 style={stateLabelStyle}>{state}</h3>
            <SmallButton label="기분" state={state} />
          </div>
        ))}
      </div>
    </div>
  )
};
