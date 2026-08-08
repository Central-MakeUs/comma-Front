import type { RestResultLocationState } from '../model/relax.types';

export type ValidRestResultLocationState = RestResultLocationState &
  Required<Pick<RestResultLocationState, 'data' | 'mood' | 'timeBudget'>>;

export const isValidRestResultLocationState = (
  state: RestResultLocationState | null
): state is ValidRestResultLocationState =>
  Boolean(state?.data?.length && state.mood && state.timeBudget);

export const getRestResultCarouselScale = (viewportHeight: number) => {
  if (viewportHeight <= 700) return 0.84;
  if (viewportHeight <= 760) return 0.92;
  return 1;
};
