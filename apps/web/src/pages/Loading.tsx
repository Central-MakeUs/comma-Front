import * as styles from './Loading.css';

function Loading() {
  return (
    <div className={styles.container}>
      <img src="/images/logo_glass.svg" alt="콤마 로고" width={110} height={24} style={{ marginTop: 68 }} />
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', marginBottom: 80 }}>
        <span className={styles.title}>반가워요,</span>
        <span className={styles.title}>토마스님.</span>
        <p className={styles.desc}>
          지금 상태를 알려주시면
          <br />딱 맞는 휴식을 찾아드릴게요
        </p>
      </div>
    </div>
  );
}

export default Loading;
