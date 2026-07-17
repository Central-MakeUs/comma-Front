import * as styles from './MyPageAnswerContainer.css';
import MyPageGaugeBar from './MyPageGaugeBar';

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
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 0,
        marginBottom: 16
      }}
    >
      <div className={styles.answerContainer}>
        <span className={styles.answerNum}>#{num}</span> 
        <span>{text}</span>
      </div>
      <MyPageGaugeBar percent={percent} />
    </div>
  );
}

export default MyPageAnswerContainer;
