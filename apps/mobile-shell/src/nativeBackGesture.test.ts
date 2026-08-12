import { describe, expect, it } from 'vitest';
import { shouldCaptureIosBackGesture, shouldCompleteIosBackGesture } from './nativeBackGesture';

const createGesture = (overrides: Partial<Parameters<typeof shouldCaptureIosBackGesture>[0]>) => ({
  dx: 80,
  dy: 8,
  moveX: 96,
  vx: 0.4,
  ...overrides
});

describe('iOS native back gesture', () => {
  it('captures a right swipe that starts at the left edge', () => {
    expect(shouldCaptureIosBackGesture(createGesture({}))).toBe(true);
    expect(shouldCompleteIosBackGesture(createGesture({}))).toBe(true);
  });

  it('ignores a swipe that starts away from the left edge', () => {
    expect(shouldCaptureIosBackGesture(createGesture({ moveX: 180 }))).toBe(false);
  });

  it('ignores vertical movement', () => {
    expect(shouldCaptureIosBackGesture(createGesture({ dy: 70 }))).toBe(false);
  });

  it('ignores a left swipe', () => {
    expect(shouldCaptureIosBackGesture(createGesture({ dx: -80, moveX: 16 }))).toBe(false);
  });

  it('requires enough distance and velocity to complete', () => {
    expect(shouldCompleteIosBackGesture(createGesture({ dx: 60, moveX: 76 }))).toBe(false);
    expect(shouldCompleteIosBackGesture(createGesture({ vx: 0.01 }))).toBe(false);
  });
});
