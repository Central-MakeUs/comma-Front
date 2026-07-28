import * as styles from './MyPageGaugeBar.css';

function MyPageGaugeBar({ percent }: { percent: number }) {
  return (
    <div className={styles.gaugeContainer}>
      <div className={styles.gaugeBar}>
        <div className={styles.gaugeBarInner} style={{ width: `${percent}%` }} />
      </div>
      <span className={styles.gaugeText}>{percent}%</span>
    </div>
  );
}

export default MyPageGaugeBar;
