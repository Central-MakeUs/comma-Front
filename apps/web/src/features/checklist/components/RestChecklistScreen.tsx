import { FEED_MOODS, FEED_TIME_BUDGETS, type FeedMood, type FeedTimeBudget } from '@comma/bridge';
import { ProgressBar, Question } from '@comma/design-system';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useFunnel } from '@use-funnel/react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnalyticsFailureReason, trackEvent } from '../../../shared/analytics/events';
import { useAppToast } from '../../../shared/components/AppToast';
import { TabShell } from '../../../shared/components/layout';
import { useNativeBackHandler } from '../../../shared/components/NativeBack';
import { QueryFeedback } from '../../../shared/components/QueryFeedback';
import { recommend } from '../../relax/api/relax.api';
import { checklistQueryOptions } from '../api/checklist.queries';
import * as styles from './RestChecklistScreen.css';

type RestChecklistFunnel = {
  Mood: { mood?: string };
  Time: { mood: string; time?: string };
};

function useSelectedOption() {
  const [selectedKey, setSelectedKey] = useState<string>();

  const selectThenMove = (key: string, move: () => void) => {
    setSelectedKey(key);
    window.setTimeout(move, 120);
  };

  return { selectedKey, setSelectedKey, selectThenMove };
}

function isFeedMood(value: string): value is FeedMood {
  return (FEED_MOODS as readonly string[]).includes(value);
}

function isFeedTimeBudget(value: string): value is FeedTimeBudget {
  return (FEED_TIME_BUDGETS as readonly string[]).includes(value);
}

function RestChecklistSkeleton() {
  return (
    <div
      aria-hidden="true"
      className={styles.skeletonContainer}
      data-testid="rest-checklist-skeleton"
    >
      <div className={styles.skeletonProgress}>
        <div className={styles.skeletonProgressFill} />
        <div className={styles.skeletonProgressTrack} />
      </div>
      <div className={styles.skeletonQuestion}>
        <div className={styles.skeletonTopArea} />
        <div className={styles.skeletonContent}>
          <div className={styles.skeletonTitleBlock}>
            <div className={styles.skeletonStep} />
            <div className={styles.skeletonTitle} />
          </div>
          <div className={styles.skeletonOptions}>
            <div className={styles.skeletonOption} />
            <div className={styles.skeletonOption} />
            <div className={styles.skeletonOption} />
          </div>
        </div>
      </div>
    </div>
  );
}

function RestChecklistScreen() {
  const navigate = useNavigate();
  const { showToast } = useAppToast();
  const { selectedKey, setSelectedKey, selectThenMove } = useSelectedOption();
  const checklistQuery = useQuery(checklistQueryOptions);
  const recommendMutation = useMutation({ mutationFn: recommend });
  const questionInfo = checklistQuery.data;
  const hasTrackedChecklistStartRef = useRef(false);

  const funnel = useFunnel<RestChecklistFunnel>({
    id: 'rest-checklist',
    initial: {
      step: 'Mood',
      context: {}
    }
  });

  useNativeBackHandler(() => {
    if (recommendMutation.isPending) {
      showToast('휴식을 추천하고 있어요.');
      return true;
    }
    if (funnel.step !== 'Time') return false;

    setSelectedKey(undefined);
    void funnel.history.replace('Mood', {});
    return true;
  });

  useEffect(() => {
    if (!questionInfo || hasTrackedChecklistStartRef.current) return;

    hasTrackedChecklistStartRef.current = true;
    trackEvent('checklist_started');
  }, [questionInfo]);

  return (
    <TabShell active="rest" className={styles.screen} navigationClassName={styles.navigation}>
      <img
        alt=""
        aria-hidden="true"
        className={styles.backgroundImage}
        decoding="async"
        fetchPriority="high"
        loading="eager"
        src="/images/Home.png"
      />
      <div aria-hidden="true" className={styles.dimOverlay} />
      <div aria-hidden="true" className={styles.topGradient} />
      <div aria-hidden="true" className={styles.bottomGradient} />

      <div className={styles.content} data-clarity-unmask="true">
        <header className={styles.header}>
          <img alt="comma" className={styles.logo} src="/images/logo_glass.svg" />
        </header>

        {checklistQuery.isPending ? (
          <RestChecklistSkeleton />
        ) : checklistQuery.isError ? (
          <QueryFeedback
            message="체크리스트를 불러오지 못했어요."
            onRetry={() => void checklistQuery.refetch()}
            state="error"
          />
        ) : !questionInfo ? null : (
          <funnel.Render
            Mood={({ history }) => (
              <>
                <ProgressBar className={styles.progress} step={1} />
                <Question
                  backButton={false}
                  className={styles.question}
                  options={[...questionInfo[0].options.map((o) => o.label)]}
                  selectedIndex={questionInfo[0].options
                    .map((o) => o.label)
                    .findIndex((option) => selectedKey === `Mood:${option}`)}
                  step={questionInfo[0].order}
                  title={questionInfo[0].title}
                  onOptionSelect={(index, mood) => {
                    const moodCode = questionInfo[0].options[index]?.code;
                    if (isFeedMood(moodCode)) {
                      trackEvent('checklist_step_completed', { mood_code: moodCode, step: 1 });
                    }
                    selectThenMove(`Mood:${mood}`, () => {
                      setSelectedKey(undefined);
                      void history.push('Time', { mood });
                    });
                  }}
                />
              </>
            )}
            Time={({ context, history }) => (
              <>
                <ProgressBar className={styles.progress} step={2} />
                <Question
                  className={styles.question}
                  options={[...questionInfo[1].options.map((o) => `${o.label} (${o.description})`)]}
                  selectedIndex={questionInfo[1].options
                    .map((o) => `${o.label} (${o.description})`)
                    .findIndex((option) => selectedKey === `Time:${option}`)}
                  step={questionInfo[1].order}
                  title={questionInfo[1].title}
                  onBackClick={() => {
                    setSelectedKey(undefined);
                    void history.back();
                  }}
                  onOptionSelect={async (index, time) => {
                    if (recommendMutation.isPending) return;
                    let selectedMoodCode: FeedMood | undefined;
                    let selectedTimeBudgetCode: FeedTimeBudget | undefined;
                    try {
                      const moodCode = questionInfo[0].options.filter(
                        (o) => context.mood === o.label
                      )[0].code;
                      const timeCode = questionInfo[1].options[index].code;
                      if (!isFeedMood(moodCode) || !isFeedTimeBudget(timeCode)) {
                        throw new Error();
                      }
                      selectedMoodCode = moodCode;
                      selectedTimeBudgetCode = timeCode;
                      trackEvent('checklist_step_completed', {
                        mood_code: selectedMoodCode,
                        step: 2,
                        time_code: selectedTimeBudgetCode
                      });
                      trackEvent('recommendation_requested', {
                        mood_code: selectedMoodCode,
                        time_code: selectedTimeBudgetCode
                      });
                      const recommendations = await recommendMutation.mutateAsync({
                        mood: selectedMoodCode,
                        time: selectedTimeBudgetCode
                      });
                      trackEvent('recommendation_received', {
                        mood_code: selectedMoodCode,
                        result_count: recommendations.length,
                        time_code: selectedTimeBudgetCode
                      });
                      selectThenMove(`Time:${time}`, async () => {
                        setSelectedKey(undefined);
                        void history.replace('Time', { ...context, time });
                        void navigate('/rest/loading', {
                          state: {
                            data: recommendations,
                            mood: selectedMoodCode,
                            timeBudget: selectedTimeBudgetCode
                          }
                        });
                      });
                    } catch (error) {
                      trackEvent('recommendation_failed', {
                        failure_reason:
                          selectedMoodCode && selectedTimeBudgetCode
                            ? getAnalyticsFailureReason(error)
                            : 'invalid_state',
                        mood_code: selectedMoodCode,
                        time_code: selectedTimeBudgetCode
                      });
                      console.log(error);
                    }
                  }}
                />
              </>
            )}
          />
        )}
        {recommendMutation.isError ? (
          <QueryFeedback message="휴식을 추천하지 못했어요. 다시 선택해주세요." state="error" />
        ) : null}
      </div>
    </TabShell>
  );
}

export default RestChecklistScreen;
