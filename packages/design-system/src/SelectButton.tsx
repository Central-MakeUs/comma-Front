import type { MouseEventHandler, ReactNode } from 'react';
import { selectButton, selectButtonState } from './SelectButton.css';

export type SelectButtonState = 'default' | 'pressed' | 'selected';

export type SelectButtonProps = {
  children?: ReactNode;
  state?: SelectButtonState;
  selected?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export function SelectButton({
  children = '멍하고 싶어',
  state = 'default',
  selected = false,
  type = 'button',
  className,
  onClick
}: SelectButtonProps) {
  const visualState: SelectButtonState = selected ? 'selected' : state;
  const buttonClassName = [selectButton, selectButtonState[visualState], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={buttonClassName} onClick={onClick} type={type}>
      {children}
    </button>
  );
}
