export const shouldShowFeedRestPrompt = (
  restedToday: boolean | undefined,
  isHeaderVisible: boolean
) => restedToday === false && isHeaderVisible;
