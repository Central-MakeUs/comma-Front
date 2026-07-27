import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { onlineCount } from '../apis/relax';
import type { RestLoadingLocationState } from '../types/relax';
import * as styles from './RestLoading.css';

function RestLoading() {
  const navigate = useNavigate();
  const location = useLocation();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let canceled = false;
    const locationState = location.state as RestLoadingLocationState | null;
    const data = locationState?.data ?? [];

    const handleInit = async () => {
      try {
        if (!data?.length) {
          alert('휴식 추천 중 오류가 발생했습니다. 다시 선택해주세요.');
          navigate('/rest/checklist');
          return;
        }
        if (!canceled) {
          const res = await onlineCount();
          if (!canceled) setCount(res.data.count);
        }
      } catch (_error) {
      } finally {
        if (!canceled && data.length > 0) {
          timeoutId = setTimeout(() => {
            navigate('/rest/result', {
              state: {
                data,
                mood: locationState?.mood,
                timeBudget: locationState?.timeBudget
              }
            });
          }, 5000);
        }
      }
    };
    handleInit();

    return () => {
      canceled = true;
      clearTimeout(timeoutId);
    };
  }, [navigate, location.state]);

  return (
    <div className={styles.container} role="status">
      <img
        alt=""
        aria-hidden="true"
        className={styles.backgroundImage}
        decoding="async"
        fetchPriority="high"
        loading="eager"
        src="/images/Home.png"
      />
      <div className={styles.content}>
        <span className={styles.title}>휴식을 찾고 있어요...</span>
        <div
          style={{ marginTop: 24, display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}
        >
          <span className={styles.num}>{count}</span>
          <span className={styles.desc}>명이 함께하는 중</span>
        </div>
      </div>
    </div>
  );
}

export default RestLoading;
