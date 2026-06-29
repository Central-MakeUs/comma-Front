import { Question, themeClass, vars } from '@comma/design-system';
import type { Meta, StoryObj } from '@storybook/react-vite';

type QuestionStoryArgs = {
  backButton: boolean;
  step: number;
  totalSteps: number;
  title: string;
  options: string[];
  selectedIndex?: number;
};

const meta = {
  title: 'Design System/Question',
  argTypes: {
    backButton: {
      control: 'boolean'
    },
    step: {
      control: { type: 'number', min: 1 }
    },
    totalSteps: {
      control: { type: 'number', min: 1 }
    },
    title: {
      control: 'text'
    },
    options: {
      control: 'object'
    },
    selectedIndex: {
      control: { type: 'number', min: 0 }
    }
  },
  args: {
    backButton: true,
    step: 2,
    totalSteps: 3,
    title: '몸은 얼마나 지쳐 있어요?',
    options: ['완전 방전이야', '견딜 만해', '안 피곤해'],
    selectedIndex: undefined
  }
} satisfies Meta<QuestionStoryArgs>;

export default meta;

type Story = StoryObj<QuestionStoryArgs>;

const storySurfaceStyle: React.CSSProperties = {
  minHeight: 520,
  display: 'grid',
  placeItems: 'start center',
  boxSizing: 'border-box',
  padding: 32,
  background: vars.color.backgroundPrimary,
  fontFamily: vars.font.body
};

function renderQuestion(args: QuestionStoryArgs) {
  return (
    <div className={themeClass} style={storySurfaceStyle}>
      <Question
        {...args}
        onBackClick={() => console.info('back')}
        onOptionSelect={(index, value) => console.info('select', index, value)}
      />
    </div>
  );
}

export const BackButtonOn: Story = {
  args: {
    backButton: true
  },
  render: renderQuestion
};

export const BackButtonOff: Story = {
  args: {
    backButton: false
  },
  render: renderQuestion
};

export const SelectedOption: Story = {
  args: {
    selectedIndex: 1
  },
  render: renderQuestion
};

export const Playground: Story = {
  render: renderQuestion
};
