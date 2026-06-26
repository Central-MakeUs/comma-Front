import {
  colors,
  radii,
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
    <div className={themeClass} style={{ padding: 32, background: vars.color.background }}>
      <div style={tokenGroupStyle}>
        <section style={sectionStyle}>
          <h2 style={{ margin: 0, ...typography.heading1 }}>Colors</h2>
          <div style={gridStyle}>
            {Object.entries(colors).map(([name, value]) => (
              <div
                key={name}
                style={{
                  border: `1px solid ${vars.color.line}`,
                  borderRadius: radii.md,
                  overflow: 'hidden',
                  background: vars.color.surface
                }}
              >
                <div style={{ height: 72, background: value }} />
                <div style={{ display: 'grid', gap: 4, padding: 10 }}>
                  <strong style={typography.label1}>{name}</strong>
                  <span style={{ ...typography.caption, color: vars.color.textSecondary }}>
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, ...typography.heading1 }}>Typography</h2>
          <div style={sectionStyle}>
            {Object.entries(typography).map(([name, style]) => (
              <div key={name} style={{ color: vars.color.textPrimary, ...style }}>
                {name} · 빠른 갈색 여우가 게으른 개를 뛰어넘습니다.
              </div>
            ))}
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, ...typography.heading1 }}>Spacing / Radius / Shadow</h2>
          <div style={gridStyle}>
            {Object.entries(spacing).map(([name, value]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: value, height: 16, background: vars.color.accent }} />
                <span style={typography.caption}>
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
                  background: vars.color.surface,
                  boxShadow: value
                }}
              >
                <span style={typography.caption}>{name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
};
