import {
  BIG_HEIGHT,
  BIG_PATH,
  BIG_WIDTH,
  CARD_COUNT,
  GAP,
  SMALL_HEIGHT,
  SMALL_PATH,
  SMALL_WIDTH
} from '../data/cardInfo';

export const lerp = (a: number, b: number, t: number) => {
  return a + (b - a) * t;
};

export const interpolatePath = (smallPath: string, bigPath: string, progress: number) => {
  const regex = /-?\d*\.?\d+/g;

  const small = smallPath.match(regex)?.map(Number) ?? [];
  const big = bigPath.match(regex)?.map(Number) ?? [];

  let index = 0;

  return bigPath.replace(regex, () => {
    const value = lerp(small[index] ?? 0, big[index] ?? 0, progress);

    index++;

    return value.toFixed(3);
  });
};

export const computeLoopedLayout = (
  scrollSnaps: number[],
  scrollProgress: number,
  viewportWidth: number
) => {
  const offsets = scrollSnaps.map((snap) => {
    let diff = snap - scrollProgress;
    if (diff > 0.5) diff -= 1;
    if (diff < -0.5) diff += 1;
    return diff * CARD_COUNT;
  });
  const scales = offsets.map((o) => Math.max(0, 1 - Math.abs(o)));
  const widths = scales.map((s) => lerp(SMALL_WIDTH, BIG_WIDTH, s));
  const heights = scales.map((s) => lerp(SMALL_HEIGHT, BIG_HEIGHT, s));

  const order = offsets.map((_, i) => i).sort((a, b) => offsets[a] - offsets[b]);

  const lefts: number[] = new Array(CARD_COUNT);
  order.forEach((i, k) => {
    if (k === 0) {
      lefts[i] = 0;
    } else {
      const prev = order[k - 1];
      lefts[i] = lefts[prev] + widths[prev] + GAP;
    }
  });
  const centerOf = (i: number) => lefts[i] + widths[i] / 2;

  let lowerIdxInOrder = 0;
  for (let k = 0; k < order.length - 1; k++) {
    if (offsets[order[k]] <= 0) lowerIdxInOrder = k;
  }
  const lowerI = order[lowerIdxInOrder];
  const upperI = order[Math.min(lowerIdxInOrder + 1, order.length - 1)];
  const span = offsets[upperI] - offsets[lowerI];
  const frac = span !== 0 ? (0 - offsets[lowerI]) / span : 0;
  const focalCenter = lerp(centerOf(lowerI), centerOf(upperI), frac);
  const virtualScrollLeft = focalCenter - viewportWidth / 2;

  return {
    paths: scales.map((s) => interpolatePath(SMALL_PATH, BIG_PATH, s)),
    sizes: widths.map((w, i) => ({ width: w, height: heights[i] })),
    xs: lefts.map((l) => l - virtualScrollLeft)
  };
};
