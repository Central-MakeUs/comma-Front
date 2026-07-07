import { NavigationBar, ProgressBar, Question } from '@comma/design-system';
import { useFunnel } from '@use-funnel/react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as styles from './RestChecklist.css';

type RestChecklistFunnel = {
  Mood: { mood?: string };
  Fatigue: { mood: string; fatigue?: string };
  RestNeed: { mood: string; fatigue: string; restNeed?: string };
};

const questions = {
  Mood: {
    step: 1,
    title: '지금 기분이 어때요?',
    options: ['멍하고 싶어', '기분 전환이 필요해', '가볍게 해볼 수 있어']
  },
  Fatigue: {
    step: 2,
    title: '몸은 얼마나 지쳐 있어요?',
    options: ['완전 방전이야', '견딜 만해', '안 피곤해']
  },
  RestNeed: {
    step: 3,
    title: '어떤 휴식이 필요해요?',
    options: ['아무것도 안하고 싶어', '조용히 혼자 있고 싶어', '몸을 움직이고 싶어']
  }
} as const;

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
                  onOptionSelect={(_, mood) =>
                    selectThenMove(`Mood:${mood}`, () => {
                      setSelectedKey(undefined);
                      void history.push('Fatigue', { mood });
                    })
                  }
                />
              </>
            )}
            Fatigue={({ context, history }) => (
              <>
                <ProgressBar className={styles.progress} step={2} />
                <Question
                  className={styles.question}
                  options={[...questions.Fatigue.options]}
                  selectedIndex={questions.Fatigue.options.findIndex(
                    (option) => selectedKey === `Fatigue:${option}`
                  )}
                  step={questions.Fatigue.step}
                  title={questions.Fatigue.title}
                  onBackClick={() => {
                    setSelectedKey(undefined);
                    void history.back();
                  }}
                  onOptionSelect={(_, fatigue) =>
                    selectThenMove(`Fatigue:${fatigue}`, () => {
                      setSelectedKey(undefined);
                      void history.push('RestNeed', { mood: context.mood, fatigue });
                    })
                  }
                />
              </>
            )}
            RestNeed={({ context, history }) => (
              <>
                <ProgressBar className={styles.progress} step={3} />
                <Question
                  className={styles.question}
                  options={[...questions.RestNeed.options]}
                  selectedIndex={questions.RestNeed.options.findIndex(
                    (option) => selectedKey === `RestNeed:${option}`
                  )}
                  step={questions.RestNeed.step}
                  title={questions.RestNeed.title}
                  onBackClick={() => {
                    setSelectedKey(undefined);
                    void history.back();
                  }}
                  onOptionSelect={(_, restNeed) =>
                    selectThenMove(`RestNeed:${restNeed}`, () => {
                      setSelectedKey(undefined);
                      void history.replace('RestNeed', { ...context, restNeed });
                      void navigate('/recommend-loading');
                    })
                  }
                />
              </>
            )}
          />
        </div>

        <NavigationBar active="rest" className={styles.navigation} />
      </div>
    </main>
  );
}

export default RestChecklist;
