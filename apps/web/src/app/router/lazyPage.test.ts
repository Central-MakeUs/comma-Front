import { describe, expect, it } from 'vitest';
import { lazyPage } from './lazyPage';

describe('lazyPage', () => {
  it('maps a page default export to a React Router Component', async () => {
    const Page = () => null;

    await expect(lazyPage(async () => ({ default: Page }))()).resolves.toEqual({
      Component: Page
    });
  });
});
