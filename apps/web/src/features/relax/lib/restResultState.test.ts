import { describe, expect, it } from 'vitest';
import type { RestResultLocationState } from '../model/relax.types';
import { getRestResultCarouselScale, isValidRestResultLocationState } from './restResultState';

const activity = {
  id: 1,
  name: '산책',
  description: '가볍게 걷기',
  activeMessage: '걷는 중',
  imageUrl: null,
  activeUserCount: 3
};

describe('isValidRestResultLocationState', () => {
  it('accepts recommendations with mood and time budget', () => {
    const state: RestResultLocationState = { data: [activity], mood: 'A', timeBudget: 'X' };

    expect(isValidRestResultLocationState(state)).toBe(true);
  });

  it.each([
    null,
    {},
    { data: [] },
    { data: [activity], mood: 'A' },
    { data: [activity], timeBudget: 'X' }
  ])('rejects incomplete route state', (state) => {
    expect(isValidRestResultLocationState(state as RestResultLocationState | null)).toBe(false);
  });
});

describe('getRestResultCarouselScale', () => {
  it.each([
    [650, 0.84],
    [700, 0.84],
    [701, 0.92],
    [760, 0.92],
    [761, 1]
  ])('uses viewport height %s to return scale %s', (viewportHeight, expected) => {
    expect(getRestResultCarouselScale(viewportHeight)).toBe(expected);
  });
});
