import { type ChangeEvent, type ReactElement, type SVGProps, useId } from 'react';
import {
  textInputCaret,
  textInputControl,
  textInputControlType,
  textInputControlVariant,
  textInputCounter,
  textInputCounterCurrent,
  textInputElement,
  textInputElementBarType,
  textInputElementState,
  textInputElementVariant,
  textInputFocusCaret,
  textInputHelper,
  textInputHelperText,
  textInputLabel,
  textInputPlusButton,
  textInputPlusIcon,
  textInputRoot,
  textInputRootState,
  textInputRootVariant,
  textInputTypeOverlay,
  textInputTypeText
} from './TextInput.css';

export type TextInputVariant = 'bar' | 'field' | 'fieldNoTitle';
export type TextInputState = 'default' | 'focus' | 'type' | 'filled' | 'filledPlus';

export type TextInputProps = {
  variant: TextInputVariant;
  state?: TextInputState;
  title?: string;
  placeholder?: string;
  value?: string;
  helperText?: string;
  maxLength?: number;
  className?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
};

function PlusIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
      <path d="M12 2.25v19.5M2.25 12h19.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function TextInput({
  variant,
  state = 'default',
  title,
  placeholder,
  value,
  helperText,
  maxLength,
  className,
  disabled = false,
  onChange
}: TextInputProps) {
  const inputId = useId();
  const hasVisibleLabel = variant === 'field' && Boolean(title);
  const isBarType = variant === 'bar' && state === 'type';
  const isBarFocus = variant === 'bar' && state === 'focus';
  const showsFieldTypeCaret =
    (variant === 'field' || variant === 'fieldNoTitle') && state === 'type';
  const shouldShowFieldFooter =
    (variant === 'field' || variant === 'fieldNoTitle') && state === 'type';
  const normalizedState = state === 'filledPlus' && variant !== 'bar' ? 'filled' : state;
  const rootClassName = [
    textInputRoot,
    textInputRootVariant[variant],
    textInputRootState[normalizedState],
    className
  ]
    .filter(Boolean)
    .join(' ');
  const controlClassName = [
    textInputControl,
    textInputControlVariant[variant],
    textInputControlType.singleLine
  ].join(' ');
  const elementClassName = [
    textInputElement,
    textInputElementVariant[variant],
    textInputElementState[normalizedState],
    isBarType ? textInputElementBarType : undefined
  ]
    .filter(Boolean)
    .join(' ');
  const inputValue = value ?? '';
  const ariaLabel = hasVisibleLabel ? undefined : title || placeholder || 'Text input';
  const handleChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    onChange?.(event.currentTarget.value);
  };

  return (
    <div className={rootClassName}>
      {hasVisibleLabel ? (
        <label className={textInputLabel} htmlFor={inputId}>
          {title}
        </label>
      ) : null}
      <span className={controlClassName}>
        <input
          aria-label={ariaLabel}
          className={elementClassName}
          disabled={disabled}
          id={inputId}
          maxLength={maxLength}
          onChange={handleChange}
          placeholder={placeholder}
          type="text"
          value={inputValue}
        />
        {isBarFocus || showsFieldTypeCaret ? <span className={textInputFocusCaret} /> : null}
        {isBarType ? (
          <span className={textInputTypeOverlay}>
            <span className={textInputTypeText}>{inputValue}</span>
            <span className={textInputCaret} />
          </span>
        ) : null}
        {normalizedState === 'filledPlus' ? (
          <button
            aria-label="추가"
            className={textInputPlusButton}
            disabled={disabled}
            type="button"
          >
            <PlusIcon className={textInputPlusIcon} />
          </button>
        ) : null}
      </span>
      {helperText || shouldShowFieldFooter ? (
        <span className={textInputHelper}>
          <span className={textInputHelperText}>
            {helperText || '최대 20자까지 입력할 수 있어요'}
          </span>
          {shouldShowFieldFooter ? (
            <span className={textInputCounter}>
              <span className={textInputCounterCurrent}>{inputValue.length}</span>
              <span>/</span>
              <span>{maxLength ?? 20}</span>
            </span>
          ) : null}
        </span>
      ) : null}
    </div>
  );
}
