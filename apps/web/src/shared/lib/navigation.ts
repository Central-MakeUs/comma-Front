import type { NavigationBarItem } from '@comma/design-system';
import type { NavigateFunction } from 'react-router-dom';

const navigationPaths: Record<NavigationBarItem, string> = {
  rest: '/rest/checklist',
  feed: '/feed',
  archive: '/archive',
  mypage: '/mypage'
};

export const navigateToNavigationItem = (
  navigate: NavigateFunction,
  item: NavigationBarItem,
  active?: NavigationBarItem
) => {
  if (item === active) return;

  void navigate(navigationPaths[item], { replace: true });
};
