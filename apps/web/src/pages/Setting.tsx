import * as styles from './Setting.css';
import { Icon, SmallButton, colors } from '@comma/design-system';

const settings = [
    '서비스 이용약관',
    '개인정보 처리방침',
    '로그아웃',
    '회원 탈퇴'
]

function SettingList({text}:{text: string}) {
    return (
        <div className={styles.settingContainer}>
            <span>{text}</span>
            <Icon name='rightArrow' color={colors.iconSecondary}/>
        </div>
    )
}

function Setting() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Icon name='rightArrow' className={styles.leftArrow}/>
                <span>설정</span>
            </div>
            <div style={{width: '100%', marginTop: 24}}>
                <div className={styles.rateContainer} style={{border: `1px solid ${colors.linePrimary}`}}>
                    <div className={styles.rateType}>현재 플랜</div>
                    <div className={styles.ratePrice}>무료 플랜</div>
                    <div className={styles.rateDesc}>기본 활동 추천 27가지</div>
                </div>
                <div className={styles.rateContainer} style={{marginTop: 8}}>
                    <div className={styles.rateType} style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>프리미엄 <Icon name='crown' className={styles.crownIcon}/></div>
                    <div className={styles.ratePrice}>월 2,900원</div>
                    <div className={styles.rateDesc}>80개+ 심화 활동, 개인화 리포트</div>
                    <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
                        <SmallButton label='시작하기' className={styles.startBtn}/>
                    </div>
                </div>
                <div style={{width: '100%', marginTop: 32}}>
                    {settings.map((s, idx) => (
                        <SettingList text={s} key={idx}/>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Setting;