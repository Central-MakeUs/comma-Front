import MyPageGaugeBar from '../MyPageGaugeBar/MyPageGaugeBar';
import * as styles from './MyPageAnswerContainer.css';

function MyPageAnswerContainer({
  num,
  text,
  percent
}: {
  num: number;
  text: string;
  percent: number;
}) {
  return (
    <div className={styles.answerRow}>
      <div className={styles.answerContainer}>
        <span className={styles.answerNum}>#{num}</span>
        <span className={styles.answerText}>{text}</span>
      </div>
      <MyPageGaugeBar percent={percent} />
    </div>
  );
}

export default MyPageAnswerContainer;
