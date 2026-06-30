import * as styles from './Recommend_Loading.css';

function RecommendLoading() {
  return (
    <div className={styles.container}>
      <span className={styles.title}>휴식을 찾고 있어요...</span>
      <div style={{ marginTop: 24 }}>
        <span className={styles.num}>173</span>
        <span className={styles.desc}>명이 함께하는 중</span>
      </div>
    </div>
  );
}

export default RecommendLoading;
