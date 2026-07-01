import { FeedImage, themeClass, typography, vars } from '@comma/design-system';
import type { Meta, StoryObj } from '@storybook/react-vite';

type FeedImageStoryArgs = {
  heart: boolean;
  imageSrc?: string;
};

const meta = {
  title: 'Design System/FeedImage',
  argTypes: {
    heart: {
      control: 'boolean'
    },
    imageSrc: {
      control: 'text'
    }
  },
  args: {
    heart: false
  }
} satisfies Meta<FeedImageStoryArgs>;

export default meta;

type Story = StoryObj<FeedImageStoryArgs>;

const storySurfaceStyle: React.CSSProperties = {
  minHeight: 620,
  display: 'grid',
  placeItems: 'center',
  padding: 32,
  background: vars.color.backgroundPrimary,
  fontFamily: vars.font.body
};

const variantsSurfaceStyle: React.CSSProperties = {
  minHeight: 620,
  display: 'grid',
  alignContent: 'center',
  gap: 16,
  padding: 32,
  background: vars.color.backgroundPrimary,
  fontFamily: vars.font.body
};

const variantGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 393px))',
  gap: 16
};

const labelStyle: React.CSSProperties = {
  margin: 0,
  color: vars.color.textTertiary,
  ...typography.captionB
};

export const HeartOff: Story = {
  render: ({ heart, imageSrc }) => (
    <div className={themeClass} style={storySurfaceStyle}>
      <FeedImage heart={heart} imageSrc={imageSrc} />
    </div>
  )
};

export const HeartOn: Story = {
  args: {
    heart: true
  },
  render: ({ heart, imageSrc }) => (
    <div className={themeClass} style={storySurfaceStyle}>
      <FeedImage heart={heart} imageSrc={imageSrc} />
    </div>
  )
};

export const Variants: Story = {
  render: () => (
    <div className={themeClass} style={variantsSurfaceStyle}>
      <div style={variantGridStyle}>
        <div style={{ display: 'grid', gap: 8 }}>
          <h3 style={labelStyle}>heart off</h3>
          <FeedImage />
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          <h3 style={labelStyle}>heart on</h3>
          <FeedImage heart />
        </div>
      </div>
    </div>
  )
};
