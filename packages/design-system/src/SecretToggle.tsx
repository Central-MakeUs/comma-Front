import type { ComponentPropsWithoutRef, MouseEvent } from 'react';
import {
  secretToggle,
  secretToggleSegment,
  secretToggleSegmentState,
  secretToggleThumb,
  secretToggleThumbInteraction,
  secretToggleThumbState
} from './SecretToggle.css';

export type SecretToggleState = 'default' | 'pressed';

export type SecretToggleProps = Omit<ComponentPropsWithoutRef<'button'>, 'type'> & {
  checked?: boolean;
  uncheckedLabel?: string;
  checkedLabel?: string;
  state?: SecretToggleState;
  type?: 'button' | 'submit' | 'reset';
  onCheckedChange?: (checked: boolean) => void;
};

export function SecretToggle({
  checked = false,
  uncheckedLabel = '공개',
  checkedLabel = '비공개',
  state = 'default',
  disabled = false,
  type = 'button',
  className,
  onClick,
  onCheckedChange,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...buttonProps
}: SecretToggleProps) {
  const buttonClassName = [secretToggle, className].filter(Boolean).join(' ');
  const thumbClassName = [
    secretToggleThumb,
    secretToggleThumbState[checked ? 'checked' : 'unchecked'],
    secretToggleThumbInteraction[state]
  ].join(' ');
  const uncheckedClassName = [
    secretToggleSegment,
    secretToggleSegmentState[checked ? 'idle' : 'selected']
  ].join(' ');
  const checkedClassName = [
    secretToggleSegment,
    secretToggleSegmentState[checked ? 'selected' : 'idle']
  ].join(' ');

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      onCheckedChange?.(!checked);
      onClick?.(event);
    }
  };

  return (
    <button
      {...buttonProps}
      aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : '공개 여부')}
      aria-checked={checked}
      aria-labelledby={ariaLabelledBy}
      className={buttonClassName}
      disabled={disabled}
      onClick={handleClick}
      role="switch"
      type={type}
    >
      <span aria-hidden="true" className={thumbClassName} />
      <span className={uncheckedClassName}>{uncheckedLabel}</span>
      <span className={checkedClassName}>{checkedLabel}</span>
    </button>
  );
}
