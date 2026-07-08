import * as styles from './MyPageGaugeBar.css';

function MyPageGaugeBar({percent}:{percent:number}) {
    return (
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <div className={styles.gaugeBar}>
                <div className={styles.gaugeBarInner} style={{width: `${120*(percent/100)}px`}}/>
            </div>
            <span className={styles.gaugeText}>{percent}%</span>
        </div>
    )
}

export default MyPageGaugeBar;