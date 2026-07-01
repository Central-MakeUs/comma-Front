import { FeedCard, type FeedCardVariant, themeClass, typography, vars } from '@comma/design-system';
import type { Meta, StoryObj } from '@storybook/react-vite';

type FeedCardStoryArgs = {
  variant: FeedCardVariant;
  imageHeart: boolean;
  liked: boolean;
  likeCount: number;
};

const meta = {
  title: 'Design System/FeedCard',
  argTypes: {
    variant: {
      control: 'radio',
      options: ['others', 'my']
    },
    imageHeart: {
      control: 'boolean'
    },
    liked: {
      control: 'boolean'
    },
    likeCount: {
      control: 'number'
    }
  },
  args: {
    variant: 'others',
    imageHeart: false,
    liked: true,
    likeCount: 12
  }
} satisfies Meta<FeedCardStoryArgs>;

export default meta;

type Story = StoryObj<FeedCardStoryArgs>;

const storySurfaceStyle: React.CSSProperties = {
  minHeight: 720,
  display: 'grid',
  placeItems: 'center',
  padding: 32,
  background: vars.color.backgroundPrimary,
  fontFamily: vars.font.body
};

const variantsSurfaceStyle: React.CSSProperties = {
  minHeight: 720,
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
  gap: 24
};

const labelStyle: React.CSSProperties = {
  margin: 0,
  color: vars.color.textTertiary,
  ...typography.captionB
};

export const Others: Story = {
  render: ({ imageHeart }) => (
    <div className={themeClass} style={storySurfaceStyle}>
      <FeedCard imageHeart={imageHeart} variant="others" />
    </div>
  )
};

export const My: Story = {
  args: {
    variant: 'my',
    imageHeart: true
  },
  render: ({ imageHeart, liked, likeCount }) => (
    <div className={themeClass} style={storySurfaceStyle}>
      <FeedCard imageHeart={imageHeart} likeCount={likeCount} liked={liked} variant="my" />
    </div>
  )
};

export const Variants: Story = {
  render: () => (
    <div className={themeClass} style={variantsSurfaceStyle}>
      <div style={variantGridStyle}>
        <div style={{ display: 'grid', gap: 8 }}>
          <h3 style={labelStyle}>others</h3>
          <FeedCard variant="others" />
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          <h3 style={labelStyle}>my</h3>
          <FeedCard imageHeart likeCount={12} variant="my" />
        </div>
      </div>
    </div>
  )
};
