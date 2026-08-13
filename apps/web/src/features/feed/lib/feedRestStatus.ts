interface FeedRestPromptState {
  restedToday: boolean | undefined;
  isHeaderVisible: boolean;
  isSuccess: boolean;
  isFetching: boolean;
}

export const shouldShowFeedRestPrompt = ({
  restedToday,
  isHeaderVisible,
  isSuccess,
  isFetching
}: FeedRestPromptState) => isSuccess && !isFetching && restedToday === false && isHeaderVisible;
