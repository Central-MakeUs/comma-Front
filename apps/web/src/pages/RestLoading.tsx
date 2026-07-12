import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { RelaxActivity } from '../apis/relax';
import * as styles from './RestLoading.css';

function RestLoading() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = (location.state as { data: RelaxActivity[] } | null) ?? { data: [] };

  useEffect(() => {
    /* TODO: /relaxes/{relaxId}/active-count api 연동 */
    navigate('/rest/result', {
      state: {
        data
      }
    });
  }, [/* TODO: /relaxes/{relaxId}/active-count api 연동 */ navigate, data]);

  return (
    <div className={styles.container} role="status">
      <span className={styles.title}>휴식을 찾고 있어요...</span>
      <div style={{ marginTop: 24 }}>
        <span className={styles.num}>173</span>
        <span className={styles.desc}>명이 함께하는 중</span>
      </div>
    </div>
  );
}

export default RestLoading;
