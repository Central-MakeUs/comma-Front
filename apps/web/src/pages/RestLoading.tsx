import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { RelaxActivity } from '../apis/relax';
import { onlineCount } from '../apis/relax';
import * as styles from './RestLoading.css';

function RestLoading() {
  const navigate = useNavigate();
  const location = useLocation();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let canceled = false;
    const data = (location.state as { data?: RelaxActivity[] } | null)?.data ?? [];

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
                data
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
  }, [navigate, (location.state as { data?: RelaxActivity[] } | null)?.data]);

  return (
    <div className={styles.container} role="status">
      <span className={styles.title}>휴식을 찾고 있어요...</span>
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
        <span className={styles.num}>{count}</span>
        <span className={styles.desc}>명이 함께하는 중</span>
      </div>
    </div>
  );
}

export default RestLoading;
