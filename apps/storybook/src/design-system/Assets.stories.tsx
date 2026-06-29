import { designAssets, radii, themeClass, typography, vars } from '@comma/design-system';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Design System/Assets'
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const groups = Object.entries(designAssets);

export const Assets: Story = {
  render: () => (
    <div
      className={themeClass}
      style={{
        minHeight: '100vh',
        padding: 32,
        background: vars.color.backgroundPrimary,
        color: vars.color.textPrimary,
        fontFamily: vars.font.body
      }}
    >
      <div style={{ display: 'grid', gap: 32 }}>
        {groups.map(([groupName, assets]) => (
          <section key={groupName} style={{ display: 'grid', gap: 12 }}>
            <h2 style={{ margin: 0, ...typography.systemSection }}>{groupName}</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 12
              }}
            >
              {Object.entries(assets).map(([assetName, asset]) => (
                <article
                  key={assetName}
                  style={{
                    display: 'grid',
                    gap: 10,
                    padding: 12,
                    borderRadius: radii.md,
                    border: `1px solid ${vars.color.lineTertiary}`,
                    background: vars.color.backgroundFill
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      placeItems: 'center',
                      overflow: 'auto',
                      borderRadius: radii.sm,
                      background: vars.color.backgroundPrimary
                    }}
                  >
                    <img
                      src={asset.src}
                      alt={asset.description}
                      style={{
                        display: 'block',
                        width: asset.width,
                        height: asset.height,
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                  <div style={{ display: 'grid', gap: 4 }}>
                    <strong style={typography.labelNormalB}>{assetName}</strong>
                    <span style={{ ...typography.captionR, color: vars.color.textSecondary }}>
                      {asset.width}x{asset.height} · {asset.figmaNodeId}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
};
