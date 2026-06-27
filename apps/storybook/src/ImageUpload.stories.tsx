import {
  ImageUpload,
  type ImageUploadState,
  themeClass,
  typography,
  vars
} from '@comma/design-system';
import type { Meta, StoryObj } from '@storybook/react-vite';

type ImageUploadStoryArgs = {
  state: ImageUploadState;
  disabled: boolean;
  imageSrc?: string;
};

const imageUploadStates = ['none', 'select', 'exist'] satisfies ImageUploadState[];

const sampleImage =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 345 438"%3E%3Cdefs%3E%3ClinearGradient id="sky" x1="0" y1="0" x2="1" y2="1"%3E%3Cstop offset="0%25" stop-color="%23fdfcfc"/%3E%3Cstop offset="42%25" stop-color="%23c2bfbc"/%3E%3Cstop offset="100%25" stop-color="%2358514c"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="345" height="438" fill="url(%23sky)"/%3E%3Ccircle cx="252" cy="126" r="46" fill="%23fdfcfc" fill-opacity=".78"/%3E%3Cpath d="M0 306c44-50 85-72 123-66 48 8 74 67 126 71 39 3 70-24 96-54v181H0z" fill="%23322e29" fill-opacity=".82"/%3E%3Cpath d="M0 360c36-28 73-41 111-37 56 6 94 50 151 49 30-1 58-14 83-33v99H0z" fill="%231a1814" fill-opacity=".7"/%3E%3C/svg%3E';

const meta = {
  title: 'Design System/ImageUpload',
  argTypes: {
    state: {
      control: 'inline-radio',
      options: imageUploadStates
    },
    disabled: {
      control: 'boolean'
    },
    imageSrc: {
      control: 'text'
    }
  },
  args: {
    state: 'none',
    disabled: false,
    imageSrc: sampleImage
  }
} satisfies Meta<ImageUploadStoryArgs>;

export default meta;

type Story = StoryObj<ImageUploadStoryArgs>;

const storySurfaceStyle: React.CSSProperties = {
  minHeight: 560,
  display: 'grid',
  placeItems: 'center',
  padding: 32,
  background: vars.color.backgroundPrimary,
  fontFamily: vars.font.body
};

const variantsSurfaceStyle: React.CSSProperties = {
  minHeight: 560,
  display: 'grid',
  gap: 16,
  alignContent: 'center',
  justifyContent: 'start',
  boxSizing: 'border-box',
  width: '100%',
  padding: 32,
  background: vars.color.backgroundPrimary,
  fontFamily: vars.font.body
};

const variantGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, 345px)',
  gap: 16
};

const stateLabelStyle: React.CSSProperties = {
  margin: 0,
  color: vars.color.textTertiary,
  ...typography.captionB
};

export const Playground: Story = {
  render: ({ state, disabled, imageSrc }) => (
    <div className={themeClass} style={storySurfaceStyle}>
      <ImageUpload disabled={disabled} imageSrc={imageSrc} state={state} />
    </div>
  )
};

export const Variants: Story = {
  render: () => (
    <div className={themeClass} style={variantsSurfaceStyle}>
      <div style={variantGridStyle}>
        <div style={{ display: 'grid', gap: 8 }}>
          <h3 style={stateLabelStyle}>none</h3>
          <ImageUpload state="none" />
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          <h3 style={stateLabelStyle}>select</h3>
          <ImageUpload state="select" />
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          <h3 style={stateLabelStyle}>exist</h3>
          <ImageUpload imageSrc={sampleImage} state="exist" />
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          <h3 style={stateLabelStyle}>exist empty</h3>
          <ImageUpload state="exist" />
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          <h3 style={stateLabelStyle}>disabled</h3>
          <ImageUpload disabled state="select" />
        </div>
      </div>
    </div>
  )
};
