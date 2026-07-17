import { NavigationBar, ProgressBar, Question } from '@comma/design-system';
import { useFunnel } from '@use-funnel/react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChecklists } from '../apis/checklist';
import { recommend } from '../apis/relax';
import type { questionInfo } from '../types/checklist';
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

function RestChecklist() {
  const navigate = useNavigate();
  const { selectedKey, setSelectedKey, selectThenMove } = useSelectedOption();
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [questionInfo, setQuestionInfo] = useState<questionInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const funnel = useFunnel<RestChecklistFunnel>({
    id: 'rest-checklist',
    initial: {
      step: 'Mood',
      context: {}
    }
  });

  useEffect(() => {
    const handleInit = async () => {
      let res: Awaited<ReturnType<typeof getChecklists>> | undefined;
      try {
        res = await getChecklists();
        if (!res?.success) throw new Error();
      } catch (error) {
        alert('체크리스트를 불러오는 중 오류가 발생했습니다.');
        console.error(error);
      } finally {
        setQuestionInfo([...(res?.data?.questions ?? [])]);
        setLoading(false);
      }
    };

    handleInit();
  }, []);

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

          {loading ? null : (
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
                        const res = await recommend({
                          mood: questionInfo[0].options.filter((o) => context.mood === o.label)[0]
                            .code,
                          time: questionInfo[1].options[index].code
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
