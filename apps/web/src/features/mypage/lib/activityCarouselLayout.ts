import {
  BIG_HEIGHT,
  BIG_PATH,
  BIG_WIDTH,
  GAP,
  SMALL_HEIGHT,
  SMALL_PATH,
  SMALL_WIDTH
} from '../../../shared/lib/carousel.constants';
import { interpolatePath, lerp } from '../../../shared/lib/computeLayout';

const MIN_CARD_SCALE = 0.78;
const MAX_CARD_SCALE = 1;

export const activityBackgrounds = [
  '/images/rest_1.png',
  '/images/rest_5.png',
  '/images/feed-image.svg',
  '/images/feed-image.svg',
  '/images/rest_2.png'
] as const;

const scalePath = (path: string, scale: number) => {
  const numberPattern = /-?\d*\.?\d+/g;
  return path.replace(numberPattern, (value) => (Number(value) * scale).toFixed(3));
};

export interface ActivityCarouselLayout {
  layoutScale: number;
  paths: string[];
  sizes: Array<{ width: number; height: number }>;
  xs: number[];
}

export const computeActivityCarouselLayout = (
  virtualIndex: number,
  viewportWidth: number,
  cardCount: number
): ActivityCarouselLayout => {
  const layoutScale = Math.max(
    MIN_CARD_SCALE,
    Math.min(MAX_CARD_SCALE, (viewportWidth - 64) / BIG_WIDTH)
  );
  const bigWidth = BIG_WIDTH * layoutScale;
  const bigHeight = BIG_HEIGHT * layoutScale;
  const smallWidth = SMALL_WIDTH * layoutScale;
  const smallHeight = SMALL_HEIGHT * layoutScale;
  const gap = GAP * layoutScale;

  if (cardCount <= 1) {
    return {
      paths: cardCount === 0 ? [] : [scalePath(BIG_PATH, layoutScale)],
      sizes: cardCount === 0 ? [] : [{ width: bigWidth, height: bigHeight }],
      xs: cardCount === 0 ? [] : [(viewportWidth - bigWidth) / 2],
      layoutScale
    };
  }

  const scales = Array.from({ length: cardCount }, (_, index) =>
    Math.max(0, 1 - Math.abs(virtualIndex - index))
  );
  const widths = scales.map((scale) => lerp(smallWidth, bigWidth, scale));
  const heights = scales.map((scale) => lerp(smallHeight, bigHeight, scale));
  const lefts: number[] = [];
  let cursor = 0;

  widths.forEach((width) => {
    lefts.push(cursor);
    cursor += width + gap;
  });

  const centers = widths.map((width, index) => lefts[index] + width / 2);
  const lowerIndex = Math.max(0, Math.min(cardCount - 2, Math.floor(virtualIndex)));
  const progress = virtualIndex - lowerIndex;
  const focalCenter = lerp(centers[lowerIndex], centers[lowerIndex + 1], progress);
  const virtualScrollLeft = focalCenter - viewportWidth / 2;

  return {
    paths: scales.map((scale) =>
      scalePath(interpolatePath(SMALL_PATH, BIG_PATH, scale), layoutScale)
    ),
    sizes: widths.map((width, index) => ({ width, height: heights[index] })),
    xs: lefts.map((left) => left - virtualScrollLeft),
    layoutScale
  };
};

export const getActivityBackground = (index: number) =>
  activityBackgrounds[index % activityBackgrounds.length];
