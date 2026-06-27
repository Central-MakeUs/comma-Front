import {
  TextInput,
  type TextInputState,
  type TextInputVariant,
  themeClass,
  typography,
  vars
} from '@comma/design-system';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';

type TextInputStoryArgs = {
  variant: TextInputVariant;
  state: TextInputState;
  title: string;
  placeholder: string;
  value: string;
};

const variantOptions = ['bar', 'field', 'fieldNoTitle'] satisfies TextInputVariant[];
const stateOptions = [
  'default',
  'focus',
  'type',
  'filled',
  'filledPlus'
] satisfies TextInputState[];
const barStates = ['default', 'focus', 'type', 'filled', 'filledPlus'] satisfies TextInputState[];
const fieldStates = ['default', 'type'] satisfies TextInputState[];

const meta = {
  title: 'Design System/TextInput',
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: variantOptions
    },
    state: {
      control: 'inline-radio',
      options: stateOptions
    },
    title: {
      control: 'text'
    },
    placeholder: {
      control: 'text'
    },
    value: {
      control: 'text'
    }
  },
  args: {
    variant: 'bar',
    state: 'default',
    title: '한 줄 소감',
    placeholder: '예) 오랜만에 바람 쐬니 좋네요',
    value: ''
  }
} satisfies Meta<TextInputStoryArgs>;

export default meta;

type Story = StoryObj<TextInputStoryArgs>;

const storySurfaceStyle: React.CSSProperties = {
  minHeight: 280,
  display: 'grid',
  placeItems: 'center',
  padding: 32,
  background: vars.color.backgroundPrimary,
  fontFamily: vars.font.body
};

const groupTitleStyle: React.CSSProperties = {
  margin: 0,
  color: vars.color.textSecondary,
  ...typography.labelNormalB
};

const stateLabelStyle: React.CSSProperties = {
  margin: 0,
  color: vars.color.textTertiary,
  ...typography.captionB
};

function getSampleValue(variant: TextInputVariant, state: TextInputState) {
  if (state === 'default' || state === 'focus') {
    return '';
  }

  if ((variant === 'field' || variant === 'fieldNoTitle') && state === 'type') {
    return '';
  }

  return '하늘이 예뻐요';
}

function VariantGroup({
  title,
  variant,
  states
}: {
  title: string;
  variant: TextInputVariant;
  states: readonly TextInputState[];
}) {
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <h2 style={groupTitleStyle}>{title}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, 335px)', gap: 16 }}>
        {states.map((state) => (
          <div key={state} style={{ display: 'grid', gap: 8 }}>
            <h3 style={stateLabelStyle}>{state}</h3>
            <TextInput
              helperText={
                (variant === 'field' || variant === 'fieldNoTitle') && state === 'type'
                  ? '최대 20자까지 입력할 수 있어요'
                  : undefined
              }
              maxLength={
                (variant === 'field' || variant === 'fieldNoTitle') && state === 'type'
                  ? 20
                  : undefined
              }
              placeholder="예) 오랜만에 바람 쐬니 좋네요"
              state={state}
              title={variant === 'field' ? '한 줄 소감' : undefined}
              value={getSampleValue(variant, state)}
              variant={variant}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function PlaygroundView({ variant, state, title, placeholder, value }: TextInputStoryArgs) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className={themeClass} style={storySurfaceStyle}>
      <TextInput
        placeholder={placeholder}
        state={state}
        title={title}
        value={inputValue}
        variant={variant}
        onChange={setInputValue}
      />
    </div>
  );
}

export const Playground: Story = {
  render: (args) => <PlaygroundView {...args} />
};

export const InputBar: Story = {
  render: () => (
    <div
      className={themeClass}
      style={{
        minHeight: 520,
        padding: 32,
        background: vars.color.backgroundPrimary,
        fontFamily: vars.font.body
      }}
    >
      <VariantGroup states={barStates} title="input bar" variant="bar" />
    </div>
  )
};

export const Input: Story = {
  render: () => (
    <div
      className={themeClass}
      style={{
        minHeight: 360,
        padding: 32,
        background: vars.color.backgroundPrimary,
        fontFamily: vars.font.body
      }}
    >
      <VariantGroup states={fieldStates} title="input" variant="field" />
    </div>
  )
};

export const InputNoTitle: Story = {
  render: () => (
    <div
      className={themeClass}
      style={{
        minHeight: 320,
        padding: 32,
        background: vars.color.backgroundPrimary,
        fontFamily: vars.font.body
      }}
    >
      <VariantGroup states={fieldStates} title="input_no title" variant="fieldNoTitle" />
    </div>
  )
};
