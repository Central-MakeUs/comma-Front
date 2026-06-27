import type { MouseEventHandler, ReactNode } from 'react';
import { ctaButton, ctaButtonState } from './CtaButton.css';

export type CtaButtonState = 'default' | 'pressed' | 'disabled';

export type CtaButtonProps = {
  children?: ReactNode;
  state?: CtaButtonState;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export function CtaButton({
  children = '시작하기',
  state = 'default',
  disabled = false,
  type = 'button',
  className,
  onClick
}: CtaButtonProps) {
  const isDisabled = disabled || state === 'disabled';
  const visualState: CtaButtonState = isDisabled ? 'disabled' : state;
  const buttonClassName = [ctaButton, ctaButtonState[visualState], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={buttonClassName} disabled={isDisabled} onClick={onClick} type={type}>
      {children}
    </button>
  );
}
