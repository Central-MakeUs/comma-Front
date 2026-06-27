import { actionButton, themeClass, vars } from '@comma/design-system';
import type { Meta, StoryObj } from '@storybook/react-vite';

type ButtonStoryArgs = {
  children: string;
  tone: 'primary' | 'secondary';
  disabled: boolean;
};

const meta = {
  title: 'Design System/Button',
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['primary', 'secondary']
    },
    disabled: {
      control: 'boolean'
    }
  },
  args: {
    children: '다음',
    tone: 'primary',
    disabled: false
  }
} satisfies Meta<ButtonStoryArgs>;

export default meta;

type Story = StoryObj<ButtonStoryArgs>;

export const Playground: Story = {
  render: ({ children, tone, disabled }) => (
    <div
      className={themeClass}
      style={{
        minHeight: 240,
        display: 'grid',
        placeItems: 'center',
        background: vars.color.backgroundPrimary,
        fontFamily: vars.font.body
      }}
    >
      <button className={actionButton({ tone })} disabled={disabled} type="button">
        {children}
      </button>
    </div>
  )
};

export const Variants: Story = {
  render: () => (
    <div
      className={themeClass}
      style={{
        minHeight: 240,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 32,
        background: vars.color.backgroundPrimary,
        fontFamily: vars.font.body
      }}
    >
      <button className={actionButton()} type="button">
        Primary
      </button>
      <button className={actionButton({ tone: 'secondary' })} type="button">
        Secondary
      </button>
      <button className={actionButton()} disabled type="button">
        Disabled
      </button>
    </div>
  )
};
