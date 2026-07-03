import {
  type ChangeEvent,
  type FocusEventHandler,
  type KeyboardEventHandler,
  type ReactElement,
  type SVGProps,
  useId
} from 'react';
import {
  textInputCaret,
  textInputControl,
  textInputControlType,
  textInputControlVariant,
  textInputCounter,
  textInputCounterCurrent,
  textInputCounterCurrentTone,
  textInputElement,
  textInputElementBarType,
  textInputElementState,
  textInputElementVariant,
  textInputElementVisualCaret,
  textInputFocusCaret,
  textInputHelper,
  textInputHelperText,
  textInputHelperTone,
  textInputLabel,
  textInputPlusButton,
  textInputPlusControl,
  textInputPlusIcon,
  textInputRoot,
  textInputRootState,
  textInputRootVariant,
  textInputTypeOverlay,
  textInputTypeText
} from './TextInput.css';

export type TextInputVariant = 'bar' | 'field' | 'fieldNoTitle';
export type TextInputState = 'default' | 'focus' | 'type' | 'filled' | 'filledPlus';
export type TextInputHelperTone = 'default' | 'error';

export type TextInputProps = {
  variant: TextInputVariant;
  state?: TextInputState;
  title?: string;
  placeholder?: string;
  value?: string;
  helperText?: string;
  helperTone?: TextInputHelperTone;
  maxLength?: number;
  enforceMaxLength?: boolean;
  showFooter?: boolean;
  className?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onPlusClick?: () => void;
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
  helperTone = 'default',
  maxLength,
  enforceMaxLength = true,
  showFooter = false,
  className,
  disabled = false,
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  onPlusClick
}: TextInputProps) {
  const inputId = useId();
  const helperId = useId();
  const hasVisibleLabel = variant === 'field' && Boolean(title);
  const isBarType = variant === 'bar' && state === 'type';
  const isBarFocus = variant === 'bar' && state === 'focus';
  const inputValue = value ?? '';
  const showsFieldTypeCaret =
    (variant === 'field' || variant === 'fieldNoTitle') &&
    state === 'type' &&
    inputValue.length === 0;
  const shouldShowFieldFooter =
    (variant === 'field' || variant === 'fieldNoTitle') && (state === 'type' || showFooter);
  const effectiveMaxLength = shouldShowFieldFooter ? (maxLength ?? 20) : maxLength;
  const displayedValue =
    !enforceMaxLength || effectiveMaxLength === undefined
      ? inputValue
      : inputValue.slice(0, effectiveMaxLength);
  const hasHelper = Boolean(helperText) || shouldShowFieldFooter;
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
    isBarType ? textInputElementBarType : undefined,
    showsFieldTypeCaret ? textInputElementVisualCaret : undefined
  ]
    .filter(Boolean)
    .join(' ');
  const ariaLabel = hasVisibleLabel ? undefined : title || placeholder || 'Text input';
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue =
      !enforceMaxLength || effectiveMaxLength === undefined
        ? event.currentTarget.value
        : event.currentTarget.value.slice(0, effectiveMaxLength);
    onChange?.(nextValue);
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
          aria-describedby={hasHelper ? helperId : undefined}
          className={elementClassName}
          disabled={disabled}
          id={inputId}
          maxLength={enforceMaxLength ? effectiveMaxLength : undefined}
          onBlur={onBlur}
          onChange={handleChange}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          type="text"
          value={displayedValue}
        />
        {isBarFocus || showsFieldTypeCaret ? <span className={textInputFocusCaret} /> : null}
        {isBarType ? (
          <span className={textInputTypeOverlay}>
            <span className={textInputTypeText}>{inputValue}</span>
            <span className={textInputCaret} />
          </span>
        ) : null}
        {normalizedState === 'filledPlus' ? (
          onPlusClick ? (
            <button
              aria-label="추가"
              className={textInputPlusButton}
              disabled={disabled}
              onClick={onPlusClick}
              type="button"
            >
              <PlusIcon className={textInputPlusIcon} />
            </button>
          ) : (
            <span aria-hidden="true" className={textInputPlusControl}>
              <PlusIcon className={textInputPlusIcon} />
            </span>
          )
        ) : null}
      </span>
      {hasHelper ? (
        <span
          className={[textInputHelper, textInputHelperTone[helperTone]].join(' ')}
          id={helperId}
        >
          <span className={textInputHelperText}>
            {helperText || '최대 20자까지 입력할 수 있어요'}
          </span>
          {shouldShowFieldFooter ? (
            <span className={textInputCounter}>
              <span
                className={[textInputCounterCurrent, textInputCounterCurrentTone[helperTone]].join(
                  ' '
                )}
              >
                {displayedValue.length}
              </span>
              <span>/</span>
              <span>{effectiveMaxLength}</span>
            </span>
          ) : null}
        </span>
      ) : null}
    </div>
  );
}
