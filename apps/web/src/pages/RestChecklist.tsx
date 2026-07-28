import { FEED_MOODS, FEED_TIME_BUDGETS, type FeedMood, type FeedTimeBudget } from '@comma/bridge';
import { NavigationBar, ProgressBar, Question } from '@comma/design-system';
import { useQuery } from '@tanstack/react-query';
import { useFunnel } from '@use-funnel/react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checklistQueryKey, getChecklistQuestions } from '../apis/checklist';
import { recommend } from '../apis/relax';
import { navigateToNavigationItem } from '../utils/navigation';
import * as styles from './RestChecklist.css';

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

function RestChecklist() {
  const navigate = useNavigate();
  const { selectedKey, setSelectedKey, selectThenMove } = useSelectedOption();
  const [recommendLoading, setRecommendLoading] = useState(false);
  const checklistQuery = useQuery({
    queryKey: checklistQueryKey,
    queryFn: getChecklistQuestions,
    staleTime: 1000 * 60 * 10
  });
  const questionInfo = checklistQuery.data;

  const funnel = useFunnel<RestChecklistFunnel>({
    id: 'rest-checklist',
    initial: {
      step: 'Mood',
      context: {}
    }
  });

  useEffect(() => {
    if (!checklistQuery.isError) return;

    alert('체크리스트를 불러오는 중 오류가 발생했습니다.');
    console.error(checklistQuery.error);
    navigate(-1);
  }, [checklistQuery.error, checklistQuery.isError, navigate]);

  return (
    <main className={styles.page}>
      <div className={styles.screen}>
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

        <div className={styles.content}>
          <header className={styles.header}>
            <img alt="comma" className={styles.logo} src="/images/logo_glass.svg" />
          </header>

          {!questionInfo ? (
            <RestChecklistSkeleton />
          ) : (
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
                    onOptionSelect={(_, mood) => {
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
                    options={[
                      ...questionInfo[1].options.map((o) => `${o.label} (${o.description})`)
                    ]}
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
                      if (recommendLoading) return;
                      setRecommendLoading(true);
                      try {
                        const selectedMoodCode = questionInfo[0].options.filter(
                          (o) => context.mood === o.label
                        )[0].code;
                        const selectedTimeBudgetCode = questionInfo[1].options[index].code;
                        if (
                          !isFeedMood(selectedMoodCode) ||
                          !isFeedTimeBudget(selectedTimeBudgetCode)
                        ) {
                          throw new Error();
                        }
                        const res = await recommend({
                          mood: selectedMoodCode,
                          time: selectedTimeBudgetCode
                        });
                        if (!res?.success || !res.data?.length) {
                          throw new Error(res.message ?? 'No recommendations found.');
                        } else {
                          selectThenMove(`Time:${time}`, async () => {
                            setSelectedKey(undefined);
                            void history.replace('Time', { ...context, time });
                            void navigate('/rest/loading', {
                              state: {
                                data: res.data,
                                mood: selectedMoodCode,
                                timeBudget: selectedTimeBudgetCode
                              }
                            });
                          });
                        }
                      } catch (error) {
                        console.log(error);
                        alert('휴식 추천 오류: 다시 선택해주세요.');
                      } finally {
                        setRecommendLoading(false);
                      }
                    }}
                  />
                </>
              )}
            />
          )}
        </div>
        <NavigationBar
          active="rest"
          className={styles.navigation}
          onItemSelect={(item) => navigateToNavigationItem(navigate, item, 'rest')}
        />
      </div>
    </main>
  );
}

export default RestChecklist;
