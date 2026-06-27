import {
  SelectButton,
  type SelectButtonState,
  themeClass,
  typography,
  vars
} from '@comma/design-system';
import type { Meta, StoryObj } from '@storybook/react-vite';

type SelectButtonStoryArgs = {
  children: string;
  state: SelectButtonState;
  selected: boolean;
};

const selectButtonStates = ['default', 'pressed', 'selected'] satisfies SelectButtonState[];

const meta = {
  title: 'Design System/SelectButton',
  argTypes: {
    state: {
      control: 'inline-radio',
      options: selectButtonStates
    },
    children: {
      control: 'text'
    },
    selected: {
      control: 'boolean'
    }
  },
  args: {
    children: '멍하고 싶어',
    state: 'default',
    selected: false
  }
} satisfies Meta<SelectButtonStoryArgs>;

export default meta;

type Story = StoryObj<SelectButtonStoryArgs>;

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
  render: ({ children, state, selected }) => (
    <div className={themeClass} style={storySurfaceStyle}>
      <SelectButton selected={selected} state={state}>
        {children}
      </SelectButton>
    </div>
  )
};

export const Variants: Story = {
  render: () => (
    <div className={themeClass} style={variantsSurfaceStyle}>
      <div style={variantGridStyle}>
        {selectButtonStates.map((state) => (
          <div key={state} style={{ display: 'grid', gap: 8, width: 329 }}>
            <h3 style={stateLabelStyle}>{state}</h3>
            <SelectButton state={state}>멍하고 싶어</SelectButton>
          </div>
        ))}
      </div>
    </div>
  )
};
