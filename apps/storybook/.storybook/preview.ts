import type { Preview } from '@storybook/react-vite';
import '../src/preview.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    backgrounds: {
      default: 'Surface',
      values: [
        { name: 'Surface', value: '#FDFCFC' },
        { name: 'Accent', value: '#5375B1' },
        { name: 'Dark', value: '#302C2C' }
      ]
    }
  }
};

export default preview;
