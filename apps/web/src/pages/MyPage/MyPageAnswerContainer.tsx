import MyPageGaugeBar from "./MyPageGaugeBar";
import * as styles from './MyPageAnswerContainer.css';

function MyPageAnswerContainer({num, text, percent}:{num:number, text:string, percent:number}) {
    return (
        <div style={{width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between', padding: 0,}}>
            <div className={styles.answerContainer}>
                <span className={styles.answerNum}>#{num}</span> {text}
            </div>
            <MyPageGaugeBar percent={percent}/>
        </div>
    )
}

export default MyPageAnswerContainer;