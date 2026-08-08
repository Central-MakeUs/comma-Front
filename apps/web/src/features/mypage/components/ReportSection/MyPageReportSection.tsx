import { QueryFeedback } from '../../../../shared/components/QueryFeedback';
import type { MoodRatio, TimeBudgetRatio } from '../../model/mypage.types';
import MyPageAnswerContainer from './MyPageAnswerContainer';
import * as styles from './MyPageReportSection.css';

interface ReportAnswer {
  key: string;
  label: string;
  ratio: number;
}

interface ReportQuestionProps {
  answers: ReportAnswer[];
  isFollowing?: boolean;
  number: number;
  title: string;
}

function ReportQuestion({ answers, isFollowing = false, number, title }: ReportQuestionProps) {
  if (answers.length === 0) return null;

  return (
    <section className={isFollowing ? styles.followingQuestion : undefined}>
      <div className={styles.questionContainer}>
        <span className={styles.questionNum}>Q{number}.</span>
        {title}
      </div>
      <div>
        {answers.map((answer, index) => (
          <MyPageAnswerContainer
            key={answer.key}
            num={index + 1}
            text={answer.label}
            percent={answer.ratio}
          />
        ))}
      </div>
    </section>
  );
}

interface MyPageReportSectionProps {
  hasNoFeed: boolean;
  isError: boolean;
  isLoading: boolean;
  moodRatio: MoodRatio[];
  onRetry: () => void;
  timeBudgetRatio: TimeBudgetRatio[];
}

export function MyPageReportSection({
  hasNoFeed,
  isError,
  isLoading,
  moodRatio,
  onRetry,
  timeBudgetRatio
}: MyPageReportSectionProps) {
  const hasContent = isLoading || isError || moodRatio.length > 0 || timeBudgetRatio.length > 0;
  const sectionClassName = `${styles.reportSection} ${
    hasContent ? styles.reportSectionWithContent : ''
  }`;

  return (
    <div className={sectionClassName}>
      {isLoading ? (
        <QueryFeedback message="리포트를 불러오고 있어요..." state="loading" />
      ) : isError ? (
        <QueryFeedback message="리포트를 불러오지 못했어요." onRetry={onRetry} state="error" />
      ) : hasNoFeed ? null : (
        <>
          <ReportQuestion
            answers={moodRatio.map((mood) => ({
              key: mood.mood,
              label: mood.label,
              ratio: mood.ratio
            }))}
            number={1}
            title="지금 기분이 어때요?"
          />
          <ReportQuestion
            answers={timeBudgetRatio.map((timeBudget) => ({
              key: timeBudget.timeBudget,
              label: timeBudget.label,
              ratio: timeBudget.ratio
            }))}
            isFollowing={moodRatio.length > 0}
            number={2}
            title="어느정도 시간이 있어요?"
          />
        </>
      )}
    </div>
  );
}
