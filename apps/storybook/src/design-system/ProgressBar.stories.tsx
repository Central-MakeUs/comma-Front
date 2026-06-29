import {
  ProgressBar,
  type ProgressBarStep,
  themeClass,
  typography,
  vars
} from '@comma/design-system';
import type { Meta, StoryObj } from '@storybook/react-vite';

type ProgressBarStoryArgs = {
  step: ProgressBarStep;
  ariaLabel: string;
};

const progressBarSteps = [1, 2, 3] satisfies ProgressBarStep[];

const meta = {
  title: 'Design System/ProgressBar',
  argTypes: {
    step: {
      control: 'inline-radio',
      options: progressBarSteps
    },
    ariaLabel: {
      control: 'text'
    }
  },
  args: {
    step: 1,
    ariaLabel: '진행 단계'
  }
} satisfies Meta<ProgressBarStoryArgs>;

export default meta;

type Story = StoryObj<ProgressBarStoryArgs>;

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

const stateLabelStyle: React.CSSProperties = {
  margin: 0,
  color: vars.color.textTertiary,
  ...typography.captionB
};

export const Playground: Story = {
  render: ({ step, ariaLabel }) => (
    <div className={themeClass} style={storySurfaceStyle}>
      <ProgressBar ariaLabel={ariaLabel} step={step} />
    </div>
  )
};

export const Variants: Story = {
  render: () => (
    <div className={themeClass} style={variantsSurfaceStyle}>
      {progressBarSteps.map((step) => (
        <div key={step} style={{ display: 'grid', gap: 8, width: 329 }}>
          <h3 style={stateLabelStyle}>step {step}</h3>
          <ProgressBar step={step} />
        </div>
      ))}
    </div>
  )
};
