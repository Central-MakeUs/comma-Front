import { NavigationBar, ProgressBar, Question } from '@comma/design-system';
import { useFunnel } from '@use-funnel/react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommend } from '../apis/relax';
import type { MoodType, TimeType } from '../types/relax';
import * as styles from './RestChecklist.css';
import { navigateToNavigationItem } from '../utils/navigation';

type RestChecklistFunnel = {
  Mood: { mood?: string };
  Time: { mood: string; time?: string };
};

const questions = {
  Mood: {
    step: 1,
    title: '지금 기분이 어때요?',
    options: ['멍하고 싶어', '기분 전환이 필요해', '가볍게 해볼 수 있어']
  },
  Time: {
    step: 2,
    title: '어느 정도 시간이 있어요?',
    options: ['잠깐 (1시간 이내)', '여유 (1-6시간 이내)', '넉넉 (6시간 이상)']
  }
} as const;

const convertMood = (answer: string): MoodType => {
  switch (answer) {
    case '멍하고 싶어':
      return 'A';
    case '기분 전환이 필요해':
      return 'B';
    case '가볍게 해볼 수 있어':
      return 'C';
    default:
      throw new Error(`Unknown mood answer: ${answer}`);
  }
};

const convertTime = (time: string): TimeType => {
  switch (time) {
    case '잠깐 (1시간 이내)':
      return 'X';
    case '여유 (1-6시간 이내)':
      return 'Y';
    case '넉넉 (6시간 이상)':
      return 'Z';
    default:
      throw new Error(`Unknown time answer: ${time}`);
  }
};

function useSelectedOption() {
  const [selectedKey, setSelectedKey] = useState<string>();

  const selectThenMove = (key: string, move: () => void) => {
    setSelectedKey(key);
    window.setTimeout(move, 120);
  };

  return { selectedKey, setSelectedKey, selectThenMove };
}

function RestChecklist() {
  const navigate = useNavigate();
  const { selectedKey, setSelectedKey, selectThenMove } = useSelectedOption();
  const [recommendLoading, setRecommendLoading] = useState(false);

  const funnel = useFunnel<RestChecklistFunnel>({
    id: 'rest-checklist',
    initial: {
      step: 'Mood',
      context: {}
    }
  });

  return (
    <main className={styles.page}>
      <div className={styles.screen}>
        <div aria-hidden="true" className={styles.dimOverlay} />
        <div aria-hidden="true" className={styles.topGradient} />
        <div aria-hidden="true" className={styles.bottomGradient} />

        <div className={styles.content}>
          <header className={styles.header}>
            <img alt="comma" className={styles.logo} src="/images/logo_glass.svg" />
          </header>

          <funnel.Render
            Mood={({ history }) => (
              <>
                <ProgressBar className={styles.progress} step={1} />
                <Question
                  backButton={false}
                  className={styles.question}
                  options={[...questions.Mood.options]}
                  selectedIndex={questions.Mood.options.findIndex(
                    (option) => selectedKey === `Mood:${option}`
                  )}
                  step={questions.Mood.step}
                  title={questions.Mood.title}
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
                  options={[...questions.Time.options]}
                  selectedIndex={questions.Time.options.findIndex(
                    (option) => selectedKey === `Time:${option}`
                  )}
                  step={questions.Time.step}
                  title={questions.Time.title}
                  onBackClick={() => {
                    setSelectedKey(undefined);
                    void history.back();
                  }}
                  onOptionSelect={async (_, time) => {
                    if (recommendLoading) return;
                    setRecommendLoading(true);
                    try {
                      const res = await recommend({
                        mood: convertMood(context.mood),
                        time: convertTime(time)
                      });
                      if (!res?.success || !res.data?.length) {
                        throw new Error(res.message ?? 'No recommendations found.');
                      } else {
                        selectThenMove(`Time:${time}`, async () => {
                          setSelectedKey(undefined);
                          void history.replace('Time', { ...context, time });
                          void navigate('/rest/loading', {
                            state: {
                              data: res.data
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
