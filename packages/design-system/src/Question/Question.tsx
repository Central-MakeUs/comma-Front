import { Icon } from '../Icon';
import { SelectButton } from '../SelectButton';
import {
  backButton,
  content,
  counter,
  counterCurrent,
  counterRest,
  options as optionsClass,
  question,
  titleBlock,
  title as titleClass,
  topArea
} from './Question.css';

const defaultOptions = ['완전 방전이야', '견딜 만해', '안 피곤해'];

export type QuestionProps = {
  backButton?: boolean;
  step?: number;
  totalSteps?: number;
  title?: string;
  options?: string[];
  selectedIndex?: number;
  onBackClick?: () => void;
  onOptionSelect?: (index: number, value: string) => void;
  className?: string;
};

export function Question({
  backButton: showBackButton = true,
  step = 2,
  totalSteps = 3,
  title = '몸은 얼마나 지쳐 있어요?',
  options = defaultOptions,
  selectedIndex,
  onBackClick,
  onOptionSelect,
  className
}: QuestionProps) {
  const rootClassName = [question, className].filter(Boolean).join(' ');

  return (
    <section className={rootClassName}>
      <div className={topArea}>
        {showBackButton ? (
          <button
            aria-label="이전으로 돌아가기"
            className={backButton}
            onClick={onBackClick}
            type="button"
          >
            <Icon aria-hidden name="backArrow" />
          </button>
        ) : null}
      </div>

      <div className={content}>
        <div className={titleBlock}>
          <p className={counter}>
            <span className={counterCurrent}>{step}</span>
            <span className={counterRest}> / {totalSteps}</span>
          </p>
          <h2 className={titleClass}>{title}</h2>
        </div>

        <div className={optionsClass}>
          {options.map((option, index) => (
            <SelectButton
              key={option}
              selected={selectedIndex === index}
              onClick={() => onOptionSelect?.(index, option)}
            >
              {option}
            </SelectButton>
          ))}
        </div>
      </div>
    </section>
  );
}
