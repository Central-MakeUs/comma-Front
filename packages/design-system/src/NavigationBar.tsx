import type { ReactElement } from 'react';
import {
  navigationBar,
  navigationIcon,
  navigationItem,
  navigationItemTone,
  navigationLabel,
  navigationLabelTone
} from './NavigationBar.css';
import type { NavigationBarIconProps } from './NavigationBarIcons';
import { ArchiveIcon, FeedIcon, MyPageIcon, RestIcon } from './NavigationBarIcons';

export type NavigationBarItem = 'rest' | 'feed' | 'archive' | 'mypage';

export type NavigationBarProps = {
  active: NavigationBarItem;
  className?: string;
  onItemSelect?: (item: NavigationBarItem) => void;
};

type NavigationItemConfig = {
  id: NavigationBarItem;
  label: string;
  Icon: (props: NavigationBarIconProps) => ReactElement;
};

const navigationItems = [
  {
    id: 'rest',
    label: '휴식하기',
    Icon: RestIcon
  },
  {
    id: 'feed',
    label: '피드',
    Icon: FeedIcon
  },
  {
    id: 'archive',
    label: '아카이브',
    Icon: ArchiveIcon
  },
  {
    id: 'mypage',
    label: '마이페이지',
    Icon: MyPageIcon
  }
] as const satisfies readonly NavigationItemConfig[];

export function NavigationBar({ active, className, onItemSelect }: NavigationBarProps) {
  const rootClassName = className ? `${navigationBar} ${className}` : navigationBar;

  return (
    <nav aria-label="주요 메뉴" className={rootClassName}>
      {navigationItems.map(({ id, label, Icon }) => {
        const isActive = active === id;
        const tone = isActive ? 'active' : 'inactive';

        return (
          <button
            aria-current={isActive ? 'page' : undefined}
            className={`${navigationItem} ${navigationItemTone[tone]}`}
            key={id}
            onClick={() => onItemSelect?.(id)}
            type="button"
          >
            <Icon active={isActive} className={navigationIcon} />
            <span className={`${navigationLabel} ${navigationLabelTone[tone]}`}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
