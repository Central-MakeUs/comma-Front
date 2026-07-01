export type DesignAsset = {
  src: string;
  width: number;
  height: number;
  figmaNodeId: string;
  description: string;
};

export const designAssets = {
  feed: {
    image: {
      src: new URL('../assets/feed/feed-image.svg', import.meta.url).href,
      width: 393,
      height: 499,
      figmaNodeId: '1:13781',
      description: 'Feed image'
    }
  },
  logos: {
    symbolDefault: {
      src: new URL('../assets/logos/symbol-default.png', import.meta.url).href,
      width: 200,
      height: 200,
      figmaNodeId: '3211:100',
      description: 'Symbol logo, default'
    },
    symbolGlass: {
      src: new URL('../assets/logos/symbol-glass.png', import.meta.url).href,
      width: 200,
      height: 200,
      figmaNodeId: '3211:106',
      description: 'Symbol logo, glass'
    },
    typeDefault: {
      src: new URL('../assets/logos/type-default.png', import.meta.url).href,
      width: 292,
      height: 64,
      figmaNodeId: '3211:113',
      description: 'Logo type, default'
    },
    typeGlass: {
      src: new URL('../assets/logos/type-glass.png', import.meta.url).href,
      width: 292,
      height: 64,
      figmaNodeId: '3211:119',
      description: 'Logo type, glass'
    }
  }
} as const satisfies Record<string, Record<string, DesignAsset>>;
