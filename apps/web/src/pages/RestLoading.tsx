import * as styles from './RestLoading.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function RestLoading() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    navigate('/rest/result', {state: {
      data: location.state.data,
    }})
  }, []);
  
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
