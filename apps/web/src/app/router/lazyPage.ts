import type { ComponentType } from 'react';

type PageModule = {
  default: ComponentType;
};

export const lazyPage = (loadPage: () => Promise<PageModule>) => async () => ({
  Component: (await loadPage()).default
});
