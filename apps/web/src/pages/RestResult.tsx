import { Icon, NavigationBar, ImageUpload, CtaButton } from "@comma/design-system";
import * as styles from './RestResult.css';
import { colors } from '@comma/design-system';

function RestResult() {
    return (
        <div className={styles.container}>
            <div style={{position: 'absolute', top: 0, width: '100%', height: 120, background: 'linear-gradient(rgba(17, 17, 17, 0.66) 0%, rgba(17, 17, 17, 0) 100%)', zIndex: -1}}/>
            <div style={{position: 'absolute', bottom: 0, width: '100%', height: 600, background: 'linear-gradient(to top, rgba(17, 17, 17, 0.66) 0%, rgba(17, 17, 17, 0) 100%)', zIndex: -1}}/>
            <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end', boxSizing: 'border-box', padding: '20px 32px'}}>
                <Icon name='x' color={colors.iconPrimary} />
            </div>
            <div style={{width: '100%', display: 'flex', flexDirection: 'column'}}>
                <div style={{width: '100%', boxSizing: 'border-box', paddingLeft: 32, paddingRight: 32, display: 'flex', flexDirection: 'column'}}>
                    <span className={styles.title}>가볍게 산책하기</span>
                    <span className={styles.subTitle}>동네 한바퀴하면서 예쁜 하늘 사진 한장 어떠세요?</span>
                </div>
                <div className={styles.rowScrollContainer}>
                    <div className={styles.rowScrollWrapper}>
                        <div style={{position: 'relative', boxSizing: 'border-box', marginRight: 20}}>
                            <ImageUpload state='exist' imageSrc='/images/rest_1.svg' className={styles.imageUploadStyle}></ImageUpload>
                            <div style={{position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 64px)', textAlign: 'center', zIndex: 2}}><span className={styles.imageNumStyle}>31</span><span className={styles.imageText}> 명이 함께하는 중</span></div>
                        </div>
                        <ImageUpload state='exist' style={{marginRight: 20}} imageSrc='/images/rest_2.svg' className={styles.imageUploadStyle}/>
                        <ImageUpload state='exist' style={{marginRight: 20}} className={styles.imageUploadStyle}/>
                        <ImageUpload state='exist' style={{marginRight: 20}} className={styles.imageUploadStyle}/>
                        <ImageUpload state='exist' style={{marginRight: 20}} imageSrc='/images/rest_5.svg' className={styles.imageUploadStyle}/>
                    </div>
                </div>
                <div style={{width: 88, height: 8, boxSizing: 'border-box', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '0 auto', marginTop: 16, marginBottom: 32}}>
                    <div className={styles.dot} style={{backgroundColor: colors.iconPrimary}}/>
                    <div className={styles.dot}/>
                    <div className={styles.dot}/>
                    <div className={styles.dot}/>
                    <div className={styles.dot}/>
                </div>
                <CtaButton className={styles.ctaButtonStyle}/>
            </div>
            <NavigationBar active='rest' className={styles.navStyle}/>
        </div>
    );
}

export default RestResult;