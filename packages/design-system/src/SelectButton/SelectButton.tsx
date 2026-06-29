import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { selectButton, selectButtonState } from './SelectButton.css';

export type SelectButtonState = 'default' | 'pressed' | 'selected';

export type SelectButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'type'> & {
  children?: ReactNode;
  state?: SelectButtonState;
  selected?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

export function SelectButton({
  children = '멍하고 싶어',
  state = 'default',
  selected = false,
  type = 'button',
  className,
  'aria-pressed': ariaPressed,
  ...buttonProps
}: SelectButtonProps) {
  const isSelected = selected || state === 'selected';
  const visualState: SelectButtonState = isSelected ? 'selected' : state;
  const buttonClassName = [selectButton, selectButtonState[visualState], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      aria-pressed={ariaPressed ?? (isSelected ? true : undefined)}
      className={buttonClassName}
      type={type}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
