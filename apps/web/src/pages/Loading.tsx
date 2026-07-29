import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as styles from './Loading.css';

const CHECKLIST_REDIRECT_DELAY_MS = 1500;

function Loading() {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = (location.state as { userName?: string } | null)?.userName ?? localStorage.getItem('comma.nickname') ?? '';

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      navigate('/rest/checklist', { replace: true });
    }, CHECKLIST_REDIRECT_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [navigate]);

  return (
    <div className={styles.container}>
      <img
        alt=""
        aria-hidden="true"
        className={styles.backgroundImage}
        decoding="async"
        fetchPriority="high"
        loading="eager"
        src="/images/loading_background.png"
      />
      <img
        src="/images/logo_glass.svg"
        alt="콤마 로고"
        width={110}
        height={24}
        style={{ marginTop: 20 }}
      />
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', marginBottom: 80 }}>
        <span className={styles.title}>반가워요,</span>
        <span className={styles.title}>{userName}님.</span>
        <p className={styles.desc}>
          지금 상태를 알려주시면
          <br />딱 맞는 휴식을 찾아드릴게요
        </p>
      </div>
    </div>
  );
}

export default Loading;
