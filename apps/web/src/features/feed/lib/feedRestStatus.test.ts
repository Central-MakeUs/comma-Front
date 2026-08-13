import { describe, expect, it } from 'vitest';
import { shouldShowFeedRestPrompt } from './feedRestStatus';

describe('shouldShowFeedRestPrompt', () => {
  it.each([
    [false, true, true],
    [false, false, false],
    [true, true, false],
    [undefined, true, false]
  ])('restedToday=%s and isHeaderVisible=%s returns %s', (restedToday, isHeaderVisible, expected) => {
    expect(shouldShowFeedRestPrompt(restedToday, isHeaderVisible)).toBe(expected);
  });
});
