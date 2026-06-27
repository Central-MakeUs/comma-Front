import {
  NavigationBar,
  type NavigationBarItem,
  themeClass,
  typography,
  vars
} from '@comma/design-system';
import type { Meta, StoryObj } from '@storybook/react-vite';

type NavigationBarStoryArgs = {
  active: NavigationBarItem;
};

const activeOptions = ['rest', 'feed', 'archive', 'mypage'] satisfies NavigationBarItem[];

const meta = {
  title: 'Design System/NavigationBar',
  argTypes: {
    active: {
      control: 'inline-radio',
      options: activeOptions
    }
  },
  args: {
    active: 'rest'
  }
} satisfies Meta<NavigationBarStoryArgs>;

export default meta;

type Story = StoryObj<NavigationBarStoryArgs>;

const storySurfaceStyle: React.CSSProperties = {
  minHeight: 240,
  display: 'grid',
  placeItems: 'center',
  padding: 32,
  background: vars.color.backgroundPrimary,
  fontFamily: vars.font.body
};

export const Playground: Story = {
  render: ({ active }) => (
    <div className={themeClass} style={storySurfaceStyle}>
      <NavigationBar active={active} onItemSelect={(item) => console.info('select', item)} />
    </div>
  )
};

export const Variants: Story = {
  render: () => (
    <div
      className={themeClass}
      style={{
        minHeight: 520,
        display: 'grid',
        alignContent: 'center',
        gap: 24,
        padding: 32,
        background: vars.color.backgroundPrimary,
        fontFamily: vars.font.body
      }}
    >
      {activeOptions.map((active) => (
        <section
          key={active}
          style={{
            display: 'grid',
            justifyItems: 'center',
            gap: 8
          }}
        >
          <h2
            style={{
              margin: 0,
              color: vars.color.textSecondary,
              ...typography.captionB
            }}
          >
            {active}
          </h2>
          <NavigationBar active={active} />
        </section>
      ))}
    </div>
  )
};
