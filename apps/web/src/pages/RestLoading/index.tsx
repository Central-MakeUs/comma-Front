import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRelaxOnlineCount, startRelax } from '../../apis/relax';
import type { RestLoadingLocationState } from '../../types/relax';
import * as styles from './RestLoading.css';

const getFallbackOnlineCount = () => 0;

function RestLoading() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data = [], selectedRelax } = (location.state as RestLoadingLocationState | null) ?? {};
  const [onlineCount, setOnlineCount] = useState(getFallbackOnlineCount());
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
      let onlineCount = getFallbackOnlineCount();

      try {
        try {
          await startRelax(selectedRelax.id);
        } catch (error) {
          console.error('Failed to start relax.', error);
        }

        const onlineCountResponse = await getRelaxOnlineCount();
        onlineCount =
          typeof onlineCountResponse.data?.count === 'number'
            ? onlineCountResponse.data.count
            : onlineCount;
        setOnlineCount(onlineCount);
      } catch (error) {
        console.error('Failed to load relax online count.', error);
      } finally {
        navigate('/rest/activity', {
          state: {
            data,
            selectedRelax
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
        <span className={styles.num}>{onlineCount}</span>
        <span className={styles.desc}>명이 함께하는 중</span>
      </div>
    </div>
  );
}

export default RestLoading;
