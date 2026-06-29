import {
  SecretToggle,
  type SecretToggleState,
  themeClass,
  typography,
  vars
} from '@comma/design-system';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';

type SecretToggleStoryArgs = {
  checked: boolean;
  disabled: boolean;
  state: SecretToggleState;
};

const secretToggleStates = ['default', 'pressed'] satisfies SecretToggleState[];

const meta = {
  title: 'Design System/SecretToggle',
  argTypes: {
    checked: {
      control: 'boolean'
    },
    disabled: {
      control: 'boolean'
    },
    state: {
      control: 'inline-radio',
      options: secretToggleStates
    }
  },
  args: {
    checked: false,
    disabled: false,
    state: 'default'
  }
} satisfies Meta<SecretToggleStoryArgs>;

export default meta;

type Story = StoryObj<SecretToggleStoryArgs>;

const storySurfaceStyle: React.CSSProperties = {
  minHeight: 240,
  display: 'grid',
  placeItems: 'center',
  padding: 32,
  background: vars.color.backgroundPrimary,
  fontFamily: vars.font.body
};

const variantsSurfaceStyle: React.CSSProperties = {
  minHeight: 240,
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
  gridTemplateColumns: 'repeat(auto-fit, 156px)',
  gap: 16
};

const variantItemStyle: React.CSSProperties = {
  width: 156,
  display: 'grid',
  gap: 8,
  alignItems: 'start'
};

const stateLabelStyle: React.CSSProperties = {
  margin: 0,
  color: vars.color.textTertiary,
  ...typography.captionB
};

export const Playground: Story = {
  render: ({ checked, disabled, state }) => {
    const [, updateArgs] = useArgs<SecretToggleStoryArgs>();

    return (
      <div className={themeClass} style={storySurfaceStyle}>
        <SecretToggle
          aria-label="알림 설정"
          checked={checked}
          disabled={disabled}
          state={state}
          onCheckedChange={(nextChecked) => updateArgs({ checked: nextChecked })}
        />
      </div>
    );
  }
};

export const Variants: Story = {
  render: () => (
    <div className={themeClass} style={variantsSurfaceStyle}>
      <div style={variantGridStyle}>
        <div style={variantItemStyle}>
          <h3 style={stateLabelStyle}>unchecked</h3>
          <SecretToggle aria-label="꺼짐 상태" />
        </div>
        <div style={variantItemStyle}>
          <h3 style={stateLabelStyle}>checked</h3>
          <SecretToggle aria-label="켜짐 상태" checked />
        </div>
        <div style={variantItemStyle}>
          <h3 style={stateLabelStyle}>pressed unchecked</h3>
          <SecretToggle aria-label="눌린 꺼짐 상태" state="pressed" />
        </div>
        <div style={variantItemStyle}>
          <h3 style={stateLabelStyle}>pressed checked</h3>
          <SecretToggle aria-label="눌린 켜짐 상태" checked state="pressed" />
        </div>
        <div style={variantItemStyle}>
          <h3 style={stateLabelStyle}>disabled unchecked</h3>
          <SecretToggle aria-label="비활성 꺼짐 상태" disabled />
        </div>
        <div style={variantItemStyle}>
          <h3 style={stateLabelStyle}>disabled checked</h3>
          <SecretToggle aria-label="비활성 켜짐 상태" checked disabled />
        </div>
      </div>
    </div>
  )
};
