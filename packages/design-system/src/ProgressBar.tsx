import {
  progressBarRoot,
  progressBarSegment,
  progressBarSegmentPosition,
  progressBarSegmentTone
} from './ProgressBar.css';

export type ProgressBarStep = 1 | 2 | 3;

export type ProgressBarProps = {
  step?: ProgressBarStep;
  className?: string;
  ariaLabel?: string;
};

const progressBarSteps = [1, 2, 3] satisfies ProgressBarStep[];
const progressBarPositions = ['first', 'middle', 'last'] as const;

export function ProgressBar({ step = 1, className, ariaLabel = '진행 단계' }: ProgressBarProps) {
  const rootClassName = [progressBarRoot, className].filter(Boolean).join(' ');

  return (
    <div
      aria-label={ariaLabel}
      aria-valuemax={3}
      aria-valuemin={1}
      aria-valuenow={step}
      className={rootClassName}
      role="progressbar"
    >
      {progressBarSteps.map((segmentStep, index) => {
        const segmentClassName = [
          progressBarSegment,
          progressBarSegmentTone[segmentStep <= step ? 'active' : 'inactive'],
          progressBarSegmentPosition[progressBarPositions[index]]
        ].join(' ');

        return <span aria-hidden="true" className={segmentClassName} key={segmentStep} />;
      })}
    </div>
  );
}
