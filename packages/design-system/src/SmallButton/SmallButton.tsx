import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { smallButton, smallButtonLabel, smallButtonState } from './SmallButton.css';

export type SmallButtonState = 'default' | 'pressed';

export type SmallButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'type'> & {
  children?: ReactNode;
  state?: SmallButtonState;
  type?: 'button' | 'submit' | 'reset';
};

export function SmallButton({
  children = '기분',
  state = 'default',
  type = 'button',
  className,
  ...buttonProps
}: SmallButtonProps) {
  const buttonClassName = [smallButton, smallButtonState[state], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={buttonClassName} type={type} {...buttonProps}>
      <span className={smallButtonLabel}>{children}</span>
    </button>
  );
}
