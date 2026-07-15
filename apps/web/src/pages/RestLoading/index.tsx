import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRelaxActiveCount, startRelax } from '../../apis/relax';
import type { RelaxActivity, RestLoadingLocationState } from '../../types/relax';
import * as styles from './RestLoading.css';

const getFallbackActiveCount = (selectedRelax?: RelaxActivity) =>
  selectedRelax?.activeUserCount ?? 0;

function RestLoading() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data = [], selectedRelax } = (location.state as RestLoadingLocationState | null) ?? {};
  const [activeCount, setActiveCount] = useState(getFallbackActiveCount(selectedRelax));
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    if (!selectedRelax?.id) {
      alert('선택된 휴식 정보가 없습니다. 다시 선택해주세요.');
      navigate('/rest/checklist', { replace: true });
      return;
    }

    const runStartFlow = async () => {
      let activeCount = getFallbackActiveCount(selectedRelax);

      try {
        try {
          await startRelax(selectedRelax.id);
        } catch (error) {
          console.error('Failed to start relax.', error);
        }

        const activeCountResponse = await getRelaxActiveCount(selectedRelax.id);
        activeCount =
          typeof activeCountResponse.data?.count === 'number'
            ? activeCountResponse.data.count
            : activeCount;
        setActiveCount(activeCount);
      } catch (error) {
        console.error('Failed to load relax active count.', error);
      } finally {
        navigate('/rest/activity', {
          state: {
            data,
            selectedRelax: {
              ...selectedRelax,
              activeUserCount: activeCount
            }
          }
        });
      }
    };

    void runStartFlow();
  }, [data, navigate, selectedRelax]);

  return (
    <div className={styles.container} role="status">
      <span className={styles.title}>휴식을 찾고 있어요...</span>
      <div style={{ marginTop: 24 }}>
        <span className={styles.num}>{activeCount}</span>
        <span className={styles.desc}>명이 함께하는 중</span>
      </div>
    </div>
  );
}

export default RestLoading;
