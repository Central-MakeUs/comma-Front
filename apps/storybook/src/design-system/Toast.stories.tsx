import { Toast, type ToastVariant, themeClass, typography, vars } from '@comma/design-system';
import type { Meta, StoryObj } from '@storybook/react-vite';

type ToastStoryArgs = {
  variant: ToastVariant;
};

const toastVariants = ['login', 'open', 'lock', 'edit'] satisfies ToastVariant[];

const meta = {
  title: 'Design System/Toast',
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: toastVariants
    }
  },
  args: {
    variant: 'login'
  }
} satisfies Meta<ToastStoryArgs>;

export default meta;

type Story = StoryObj<ToastStoryArgs>;

const storySurfaceStyle: React.CSSProperties = {
  minHeight: 240,
  display: 'grid',
  placeItems: 'center',
  padding: 32,
  background: vars.color.backgroundFill,
  fontFamily: vars.font.body
};

const variantsSurfaceStyle: React.CSSProperties = {
  minHeight: 360,
  display: 'grid',
  gap: 16,
  alignContent: 'center',
  justifyContent: 'start',
  padding: 32,
  background: vars.color.backgroundFill,
  fontFamily: vars.font.body
};

const stateLabelStyle: React.CSSProperties = {
  margin: 0,
  color: vars.color.textTertiary,
  ...typography.captionB
};

export const Playground: Story = {
  render: ({ variant }) => (
    <div className={themeClass} style={storySurfaceStyle}>
      <Toast variant={variant} onClose={() => console.info('close toast')} />
    </div>
  )
};

export const Variants: Story = {
  render: () => (
    <div className={themeClass} style={variantsSurfaceStyle}>
      {toastVariants.map((variant) => (
        <section key={variant} style={{ display: 'grid', gap: 8 }}>
          <h3 style={stateLabelStyle}>{variant}</h3>
          <Toast variant={variant} />
        </section>
      ))}
    </div>
  )
};
