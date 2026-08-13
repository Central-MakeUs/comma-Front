import { describe, expect, it } from 'vitest';
import { shouldShowFeedRestPrompt } from './feedRestStatus';

describe('shouldShowFeedRestPrompt', () => {
  it('shows the prompt after a settled successful response says the user has not rested', () => {
    expect(
      shouldShowFeedRestPrompt({
        restedToday: false,
        isHeaderVisible: true,
        isSuccess: true,
        isFetching: false
      })
    ).toBe(true);
  });

  it.each([
    {
      name: 'initial loading',
      state: { restedToday: undefined, isHeaderVisible: true, isSuccess: false, isFetching: true }
    },
    {
      name: 'cached false value during refetch',
      state: { restedToday: false, isHeaderVisible: true, isSuccess: true, isFetching: true }
    },
    {
      name: 'cached false value after refetch error',
      state: { restedToday: false, isHeaderVisible: true, isSuccess: false, isFetching: false }
    },
    {
      name: 'already rested',
      state: { restedToday: true, isHeaderVisible: true, isSuccess: true, isFetching: false }
    },
    {
      name: 'scrolled header',
      state: { restedToday: false, isHeaderVisible: false, isSuccess: true, isFetching: false }
    }
  ])('hides the prompt for $name', ({ state }) => {
    expect(shouldShowFeedRestPrompt(state)).toBe(false);
  });
});
