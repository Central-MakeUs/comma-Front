import {
  grid,
  primitiveColors,
  radii,
  semanticColors,
  shadows,
  spacing,
  themeClass,
  typography,
  vars
} from '@comma/design-system';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Design System/Tokens'
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const typographyTokenNames = [
  'titleR',
  'headingB',
  'headingR',
  'headlineB',
  'headlineR',
  'bodyNormalB',
  'bodyNormalR',
  'bodyReadingB',
  'bodyReadingR',
  'labelNormalB',
  'labelNormalR',
  'labelReadingB',
  'labelReadingR',
  'captionB',
  'captionR',
  'engNum',
  'systemEyebrow',
  'systemSection'
] as const;

const tokenGroupStyle: React.CSSProperties = {
  display: 'grid',
  gap: 24,
  color: vars.color.textPrimary,
  fontFamily: vars.font.body
};

const sectionStyle: React.CSSProperties = {
  display: 'grid',
  gap: 12
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
  gap: 12
};

export const Tokens: Story = {
  render: () => (
    <div className={themeClass} style={{ padding: 32, background: vars.color.backgroundPrimary }}>
      <div style={tokenGroupStyle}>
        <section style={sectionStyle}>
          <h2 style={{ margin: 0, ...typography.systemSection }}>Colors</h2>
          <h3 style={{ margin: 0, ...typography.labelNormalB }}>Primitive</h3>
          <div style={gridStyle}>
            {Object.entries(primitiveColors).map(([name, value]) => (
              <div
                key={name}
                style={{
                  border: `1px solid ${vars.color.linePrimary}`,
                  borderRadius: radii.md,
                  overflow: 'hidden',
                  background: vars.color.backgroundFill
                }}
              >
                <div style={{ height: 72, background: value }} />
                <div style={{ display: 'grid', gap: 4, padding: 10 }}>
                  <strong style={typography.labelNormalB}>{name}</strong>
                  <span style={{ ...typography.captionR, color: vars.color.textSecondary }}>
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <h3 style={{ margin: 0, ...typography.labelNormalB }}>Semantic</h3>
          <div style={gridStyle}>
            {Object.entries(semanticColors).map(([name, value]) => (
              <div
                key={name}
                style={{
                  border: `1px solid ${vars.color.linePrimary}`,
                  borderRadius: radii.md,
                  overflow: 'hidden',
                  background: vars.color.backgroundFill
                }}
              >
                <div style={{ height: 72, background: value }} />
                <div style={{ display: 'grid', gap: 4, padding: 10 }}>
                  <strong style={typography.labelNormalB}>{name}</strong>
                  <span style={{ ...typography.captionR, color: vars.color.textSecondary }}>
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, ...typography.systemSection }}>Typography</h2>
          <div style={sectionStyle}>
            {typographyTokenNames.map((name) => (
              <div key={name} style={{ color: vars.color.textPrimary, ...typography[name] }}>
                {name} · 빠른 갈색 여우가 게으른 개를 뛰어넘습니다.
              </div>
            ))}
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, ...typography.systemSection }}>
            Grid / Spacing / Radius / Shadow
          </h2>
          <div style={gridStyle}>
            {Object.entries(grid).map(([name, value]) => (
              <div
                key={name}
                style={{
                  padding: 16,
                  borderRadius: radii.md,
                  background: vars.color.backgroundFill,
                  border: `1px solid ${vars.color.lineTertiary}`
                }}
              >
                <strong style={typography.labelNormalB}>{name}</strong>
                <div style={{ ...typography.captionR, color: vars.color.textSecondary }}>
                  {value}
                </div>
              </div>
            ))}
            {Object.entries(spacing).map(([name, value]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{ width: value, height: 16, background: vars.color.textBlackSecondary }}
                />
                <span style={typography.captionR}>
                  {name}: {value}
                </span>
              </div>
            ))}
            {Object.entries(shadows).map(([name, value]) => (
              <div
                key={name}
                style={{
                  padding: 16,
                  borderRadius: radii.md,
                  background: vars.color.backgroundFill,
                  boxShadow: value
                }}
              >
                <span style={typography.captionR}>{name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
};
