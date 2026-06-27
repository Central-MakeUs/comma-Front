import type { StorybookConfig } from '@storybook/react-vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');

    return mergeConfig(config, {
      plugins: [vanillaExtractPlugin()],
      resolve: {
        dedupe: ['react', 'react-dom']
      },
      optimizeDeps: {
        include: ['react', 'react-dom', 'react/jsx-dev-runtime', 'react/jsx-runtime']
      }
    });
  }
};

export default config;
