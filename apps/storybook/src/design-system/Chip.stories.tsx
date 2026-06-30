import { Chip, type ChipState, themeClass, typography, vars } from '@comma/design-system';
import type { Meta, StoryObj } from '@storybook/react-vite';

type ChipStoryArgs = {
  children: string;
  state: ChipState;
  selected: boolean;
};

const chipStates = [
  'default',
  'defaultPressed',
  'selected',
  'selectedPressed'
] satisfies ChipState[];

const meta = {
  title: 'Design System/Chip',
  argTypes: {
    state: {
      control: 'inline-radio',
      options: chipStates
    },
    children: {
      control: 'text'
    },
    selected: {
      control: 'boolean'
    }
  },
  args: {
    children: '기분',
    state: 'default',
    selected: false
  }
} satisfies Meta<ChipStoryArgs>;

export default meta;

type Story = StoryObj<ChipStoryArgs>;

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
  gridTemplateColumns: 'repeat(auto-fit, 80px)',
  gap: 16
};

const stateLabelStyle: React.CSSProperties = {
  margin: 0,
  color: vars.color.textTertiary,
  ...typography.captionB
};

export const Playground: Story = {
  render: ({ children, state, selected }) => (
    <div className={themeClass} style={storySurfaceStyle}>
      <Chip selected={selected} state={state}>
        {children}
      </Chip>
    </div>
  )
};

export const Variants: Story = {
  render: () => (
    <div className={themeClass} style={variantsSurfaceStyle}>
      <div style={variantGridStyle}>
        {chipStates.map((state) => (
          <div key={state} style={{ display: 'grid', gap: 8, width: 80 }}>
            <h3 style={stateLabelStyle}>{state}</h3>
            <Chip state={state}>기분</Chip>
          </div>
        ))}
      </div>
    </div>
  )
};
