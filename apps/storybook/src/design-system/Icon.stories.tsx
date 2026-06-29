import { Icon, type IconName, themeClass, typography, vars } from '@comma/design-system';
import type { Meta, StoryObj } from '@storybook/react-vite';

type StoryVariant = 'badook' | 'list' | 'on' | 'off';
type ToggleStoryIconName = Extract<IconName, 'compass' | 'mypage' | 'heart' | 'coffee' | 'book'>;

type IconStoryArgs = {
  name: IconName;
  variant: StoryVariant;
  color: string;
};

const staticIconNames = [
  'x',
  'plus',
  'backArrow',
  'camera',
  'check',
  'rightArrow',
  'downArrow',
  'crown',
  'setting'
] satisfies IconName[];

const toggleIconNames = [
  'compass',
  'mypage',
  'heart',
  'coffee',
  'book'
] satisfies ToggleStoryIconName[];
const iconNames = [...staticIconNames, 'array', ...toggleIconNames] satisfies IconName[];
const variants = ['badook', 'list', 'on', 'off'] satisfies StoryVariant[];

const meta = {
  title: 'Design System/Icon',
  argTypes: {
    name: {
      control: 'select',
      options: iconNames
    },
    variant: {
      control: 'inline-radio',
      options: variants
    },
    color: {
      control: 'color'
    }
  },
  args: {
    name: 'heart',
    variant: 'on',
    color: vars.color.iconPrimary
  }
} satisfies Meta<IconStoryArgs>;

export default meta;

type Story = StoryObj<IconStoryArgs>;

const storySurfaceStyle: React.CSSProperties = {
  minHeight: 280,
  display: 'grid',
  placeItems: 'center',
  padding: 32,
  background: vars.color.backgroundPrimary,
  fontFamily: vars.font.body
};

const gallerySurfaceStyle: React.CSSProperties = {
  minHeight: 280,
  display: 'grid',
  gap: 28,
  alignContent: 'start',
  padding: 32,
  background: vars.color.backgroundPrimary,
  fontFamily: vars.font.body
};

const sectionStyle: React.CSSProperties = {
  display: 'grid',
  gap: 12
};

const galleryGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
  gap: 12,
  maxWidth: 720
};

const tileStyle: React.CSSProperties = {
  minHeight: 88,
  display: 'grid',
  justifyItems: 'center',
  alignContent: 'center',
  gap: 10,
  padding: 12,
  border: `1px solid ${vars.color.lineTertiary}`,
  borderRadius: 8,
  color: vars.color.iconPrimary,
  background: vars.color.backgroundFill
};

const headingStyle: React.CSSProperties = {
  margin: 0,
  color: vars.color.textPrimary,
  ...typography.labelNormalB
};

const labelStyle: React.CSSProperties = {
  margin: 0,
  color: vars.color.textTertiary,
  textAlign: 'center',
  ...typography.captionR
};

function isToggleIconName(name: IconName): name is ToggleStoryIconName {
  return toggleIconNames.includes(name as ToggleStoryIconName);
}

function renderPlaygroundIcon({ name, variant, color }: IconStoryArgs) {
  if (name === 'array') {
    const arrayVariant = variant === 'list' ? 'list' : 'badook';
    return (
      <Icon color={color} name={name} title={`${name} ${arrayVariant}`} variant={arrayVariant} />
    );
  }

  if (isToggleIconName(name)) {
    const toggleVariant = variant === 'off' ? 'off' : 'on';
    return (
      <Icon color={color} name={name} title={`${name} ${toggleVariant}`} variant={toggleVariant} />
    );
  }

  return <Icon color={color} name={name} title={name} />;
}

function IconTile({
  name,
  variant
}: {
  name: IconName;
  variant?: 'badook' | 'list' | 'on' | 'off';
}) {
  const label = variant === undefined ? name : `${name} / ${variant}`;

  if (name === 'array') {
    return (
      <div style={tileStyle}>
        <Icon name={name} title={label} variant={variant === 'list' ? 'list' : 'badook'} />
        <p style={labelStyle}>{label}</p>
      </div>
    );
  }

  if (isToggleIconName(name)) {
    return (
      <div style={tileStyle}>
        <Icon name={name} title={label} variant={variant === 'off' ? 'off' : 'on'} />
        <p style={labelStyle}>{label}</p>
      </div>
    );
  }

  return (
    <div style={tileStyle}>
      <Icon name={name} title={label} />
      <p style={labelStyle}>{label}</p>
    </div>
  );
}

export const Playground: Story = {
  render: (args) => (
    <div className={themeClass} style={storySurfaceStyle}>
      <div style={{ color: args.color }}>{renderPlaygroundIcon(args)}</div>
    </div>
  )
};

export const Gallery: Story = {
  render: () => (
    <div className={themeClass} style={gallerySurfaceStyle}>
      <section style={sectionStyle}>
        <h3 style={headingStyle}>Static</h3>
        <div style={galleryGridStyle}>
          {staticIconNames.map((name) => (
            <IconTile key={name} name={name} />
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <h3 style={headingStyle}>Array</h3>
        <div style={galleryGridStyle}>
          <IconTile name="array" variant="badook" />
          <IconTile name="array" variant="list" />
        </div>
      </section>

      <section style={sectionStyle}>
        <h3 style={headingStyle}>Toggle</h3>
        <div style={galleryGridStyle}>
          {toggleIconNames.flatMap((name) =>
            (['on', 'off'] satisfies ('on' | 'off')[]).map((variant) => (
              <IconTile key={`${name}-${variant}`} name={name} variant={variant} />
            ))
          )}
        </div>
      </section>
    </div>
  )
};
