import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { chip, chipIcon, chipLabel, chipState } from './Chip.css';

export type ChipState = 'default' | 'defaultPressed' | 'selected' | 'selectedPressed';

export type ChipProps = Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'type'> & {
  children?: ReactNode;
  label?: ReactNode;
  state?: ChipState;
  selected?: boolean;
  type?: 'button' | 'submit' | 'reset';
};

function ChipArrow({ selected }: { selected: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={chipIcon}
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      {selected ? (
        <path
          d="M3.95312 9.61914L8.00063 5.57164L12.0481 9.61914"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.2"
        />
      ) : (
        <path
          d="M3.95312 6.38086L8.00063 10.4284L12.0481 6.38086"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.2"
        />
      )}
    </svg>
  );
}

export function Chip({
  children,
  label = '기분',
  state = 'default',
  selected,
  type = 'button',
  className,
  'aria-pressed': ariaPressed,
  ...buttonProps
}: ChipProps) {
  const isPressedState = state === 'defaultPressed' || state === 'selectedPressed';
  const isSelected =
    selected === undefined ? state === 'selected' || state === 'selectedPressed' : selected;
  const visualState: ChipState = isSelected
    ? isPressedState
      ? 'selectedPressed'
      : 'selected'
    : isPressedState
      ? 'defaultPressed'
      : 'default';
  const buttonClassName = [chip, chipState[visualState], className].filter(Boolean).join(' ');

  return (
    <button
      aria-pressed={ariaPressed ?? (isSelected ? true : undefined)}
      className={buttonClassName}
      type={type}
      {...buttonProps}
    >
      <span className={chipLabel}>{children ?? label}</span>
      <ChipArrow selected={isSelected} />
    </button>
  );
}
