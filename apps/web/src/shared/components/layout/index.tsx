import { NavigationBar } from '@comma/design-system';
import type {
  ComponentProps,
  ElementType,
  HTMLAttributes,
  ReactNode,
  Ref,
  UIEventHandler
} from 'react';
import { useNavigate } from 'react-router-dom';
import { navigateToNavigationItem } from '../../lib/navigation';
import * as styles from './layout.css';

type NavigationItem = ComponentProps<typeof NavigationBar>['active'];

const cx = (...classNames: Array<string | undefined | false>) =>
  classNames.filter(Boolean).join(' ');

type AppScreenProps<T extends ElementType = 'div'> = {
  as?: T;
  children: ReactNode;
  className?: string;
  scrollable?: boolean;
} & Omit<HTMLAttributes<HTMLElement>, 'children' | 'className'>;

export function AppScreen<T extends ElementType = 'div'>({
  as,
  children,
  className,
  scrollable = false,
  ...props
}: AppScreenProps<T>) {
  const Component = as ?? 'div';
  const shellClassName = scrollable ? styles.scrollScreen : styles.fullScreen;

  return (
    <Component className={cx(shellClassName, className)} {...props}>
      {children}
    </Component>
  );
}

export function TabShell({
  active,
  children,
  className,
  navigationClassName
}: {
  active: NavigationItem;
  children: ReactNode;
  className?: string;
  navigationClassName?: string;
}) {
  const navigate = useNavigate();

  return (
    <div className={cx(styles.tabShell, className)}>
      {children}
      <NavigationBar
        active={active}
        className={cx(styles.tabNavigation, navigationClassName)}
        onItemSelect={(item) => navigateToNavigationItem(navigate, item, active)}
      />
    </div>
  );
}

export function TabScrollArea({
  children,
  className,
  onScroll,
  scrollRef
}: {
  children: ReactNode;
  className?: string;
  onScroll?: UIEventHandler<HTMLDivElement>;
  scrollRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div className={cx(styles.tabScrollArea, className)} onScroll={onScroll} ref={scrollRef}>
      {children}
    </div>
  );
}

export function BackgroundImage({ className, src }: { className?: string; src: string }) {
  return (
    <img
      alt=""
      aria-hidden="true"
      className={cx(styles.absoluteFillImage, className)}
      decoding="async"
      draggable={false}
      fetchPriority="high"
      loading="eager"
      src={src}
    />
  );
}

export const foregroundClassName = styles.foreground;
