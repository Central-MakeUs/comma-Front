import { designAssets, FeedBadook, themeClass, typography, vars } from '@comma/design-system';
import type { Meta, StoryObj } from '@storybook/react-vite';

type FeedBadookStoryArgs = {
  imageSrc?: string;
  liked: boolean;
  likeCount: number;
};

const meta = {
  title: 'Design System/FeedBadook',
  argTypes: {
    imageSrc: {
      control: 'text'
    },
    liked: {
      control: 'boolean'
    },
    likeCount: {
      control: 'number'
    }
  },
  args: {
    imageSrc: undefined,
    liked: true,
    likeCount: 12
  }
} satisfies Meta<FeedBadookStoryArgs>;

export default meta;

type Story = StoryObj<FeedBadookStoryArgs>;

const storySurfaceStyle: React.CSSProperties = {
  minHeight: 420,
  display: 'grid',
  placeItems: 'center',
  padding: 32,
  background: vars.color.backgroundPrimary,
  fontFamily: vars.font.body
};

const variantsSurfaceStyle: React.CSSProperties = {
  minHeight: 420,
  display: 'grid',
  alignContent: 'center',
  gap: 16,
  padding: 32,
  background: vars.color.backgroundPrimary,
  fontFamily: vars.font.body
};

const variantGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, 165px)',
  gap: 24
};

const labelStyle: React.CSSProperties = {
  margin: 0,
  color: vars.color.textTertiary,
  ...typography.captionB
};

export const Default: Story = {
  render: ({ imageSrc, liked, likeCount }) => (
    <div className={themeClass} style={storySurfaceStyle}>
      <FeedBadook imageSrc={imageSrc} likeCount={likeCount} liked={liked} />
    </div>
  )
};

export const CustomImage: Story = {
  args: {
    imageSrc: designAssets.feed.image.src
  },
  render: ({ imageSrc, liked, likeCount }) => (
    <div className={themeClass} style={storySurfaceStyle}>
      <FeedBadook imageAlt="한강 풍경" imageSrc={imageSrc} likeCount={likeCount} liked={liked} />
    </div>
  )
};

export const Variants: Story = {
  render: () => (
    <div className={themeClass} style={variantsSurfaceStyle}>
      <div style={variantGridStyle}>
        <div style={{ display: 'grid', gap: 8 }}>
          <h3 style={labelStyle}>placeholder</h3>
          <FeedBadook />
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          <h3 style={labelStyle}>custom image</h3>
          <FeedBadook imageAlt="한강 풍경" imageSrc={designAssets.feed.image.src} />
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          <h3 style={labelStyle}>unliked</h3>
          <FeedBadook likeCount={0} liked={false} tags={['산책', '저녁']} />
        </div>
      </div>
    </div>
  )
};
