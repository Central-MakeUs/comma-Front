import { describe, expect, it } from 'vitest';
import {
  BIG_HEIGHT,
  BIG_WIDTH,
  SMALL_HEIGHT,
  SMALL_WIDTH
} from '../../../shared/lib/carousel.constants';
import {
  activityBackgrounds,
  computeActivityCarouselLayout,
  getActivityBackground
} from './activityCarouselLayout';

describe('computeActivityCarouselLayout', () => {
  it('returns empty layout data when there are no cards', () => {
    const layout = computeActivityCarouselLayout(0, 390, 0);

    expect(layout.paths).toEqual([]);
    expect(layout.sizes).toEqual([]);
    expect(layout.xs).toEqual([]);
  });

  it('centers a single card and uses the large card size', () => {
    const viewportWidth = 390;
    const layout = computeActivityCarouselLayout(0, viewportWidth, 1);

    expect(layout.layoutScale).toBe(1);
    expect(layout.sizes).toEqual([{ width: BIG_WIDTH, height: BIG_HEIGHT }]);
    expect(layout.xs[0] + layout.sizes[0].width / 2).toBe(viewportWidth / 2);
  });

  it('keeps the focused card centered at an integer index', () => {
    const viewportWidth = 390;
    const focusedIndex = 1;
    const layout = computeActivityCarouselLayout(focusedIndex, viewportWidth, 3);

    expect(layout.sizes[focusedIndex]).toEqual({ width: BIG_WIDTH, height: BIG_HEIGHT });
    expect(layout.sizes[0]).toEqual({ width: SMALL_WIDTH, height: SMALL_HEIGHT });
    expect(layout.xs[focusedIndex] + layout.sizes[focusedIndex].width / 2).toBe(viewportWidth / 2);
  });

  it('clamps the layout scale on narrow viewports', () => {
    const layout = computeActivityCarouselLayout(0, 240, 1);

    expect(layout.layoutScale).toBe(0.78);
    expect(layout.sizes[0].width).toBeCloseTo(BIG_WIDTH * 0.78);
    expect(layout.sizes[0].height).toBeCloseTo(BIG_HEIGHT * 0.78);
  });
});

describe('getActivityBackground', () => {
  it('cycles through the configured backgrounds', () => {
    expect(getActivityBackground(activityBackgrounds.length)).toBe(activityBackgrounds[0]);
    expect(getActivityBackground(activityBackgrounds.length + 1)).toBe(activityBackgrounds[1]);
  });
});
