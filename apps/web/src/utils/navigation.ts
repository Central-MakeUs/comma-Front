import type { NavigationBarItem } from '@comma/design-system';
import type { NavigateFunction } from 'react-router-dom';

const navigationPaths: Record<NavigationBarItem, string> = {
  rest: '/rest/checklist',
  feed: '/feed',
  archive: '/archive',
  mypage: '/mypage'
};

export const navigateToNavigationItem = (navigate: NavigateFunction, item: NavigationBarItem) => {
  void navigate(navigationPaths[item]);
};
