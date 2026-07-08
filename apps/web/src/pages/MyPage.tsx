import * as styles from './MyPage.css';
import { Icon, SmallButton, NavigationBar, typography, colors } from '@comma/design-system';
import useEmblaCarousel from 'embla-carousel-react';
import { useState, useEffect } from 'react';
import { assignInlineVars } from '@vanilla-extract/dynamic';

function GaugeBar({percent}:{percent:number}) {
    return (
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <div className={styles.gaugeBar}>
                <div className={styles.gaugeBarInner} style={{width: `${120*(percent/100)}px`}}/>
            </div>
            <span className={styles.gaugeText}>{percent}%</span>
        </div>
    )
}

function Card({backgroundUrl, num, count, title}:{backgroundUrl?:string, num:number, count:number, title:string}) {
    return (
        <div style={{flex: '0 0 320px', paddingLeft: 16}}>
            <div className={styles.cardStyle} style=
                {{
                    clipPath: 'path("M0 94.659C0 16.7073 16.8536 0 95.488 0H224.512C303.146 0 320 16.7073 320 94.659V309.341C320 387.293 303.146 404 224.512 404H95.488C16.8536 404 0 387.293 0 309.341V94.659Z")',
                    backgroundImage: `linear-gradient(rgba(17, 17, 17, 0) 0%, #111111 100%), url(${backgroundUrl})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                }}
            >
                <div style={{...typography.engNum, fontSize: 64, color: '#FCFCFC66', textAlign: 'right'}}>#{num}</div>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div>
                        <span style={{...typography.engNum, fontSize: 48, color: colors.textPrimary}}>{count}</span><span style={{...typography.headingR, color: colors.textSecondary}}> 회</span>
                    </div>
                    <span style={{...typography.headingB, color: colors.textSecondary}}>{title}</span>
                </div>
            </div>
        </div>
    )
}

function AnswerContainer({num, text, percent}:{num:number, text:string, percent:number}) {
    return (
        <div style={{width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between', padding: 0,}}>
            <div className={styles.answerContainer}>
                <span className={styles.answerNum}>#{num}</span> {text}
            </div>
            <GaugeBar percent={percent}/>
        </div>
    )
}

function MyPage() {
    const [embiaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        containScroll: false,
        align: 'center',
    });
    const [bgUrl, setBgUrl] = useState('');
    const backgrounds = ['/images/rest_1.svg', '/images/rest_5.svg', '', '', '/images/rest_2.svg'];
    useEffect(() => {
        if(!emblaApi) return;
        const onSelect = () => {
            const index = emblaApi.selectedScrollSnap();
            console.log(index);
            setBgUrl(backgrounds[index])   
        }
        onSelect();
        emblaApi.on('select', onSelect);

        return () =>{
            emblaApi.off('select', onSelect);
        }

    }, [emblaApi])


    return (
        <div className={styles.container} style={assignInlineVars({
            [styles.backgroundImageVar]: `url(${bgUrl}) no-repeat center / cover`
        })}>
            <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column'}}>
                <div  style={{width: '100%', height: 447, background: 'linear-gradient(#11111166 0%, rgba(17, 17, 17, 0) 100%)'}}/>
                <div style={{flex: 1, width: '100%', background: 'linear-gradient(to top, #11111166 0%, rgba(17, 17, 17, 0) 100%)'}}/>
            </div>
            <div />
            <div className={styles.header}>
                <span>마이페이지</span>
                <div className={styles.headerIconContainer}>
                    <Icon name='setting'/>
                </div>
            </div>
            <div style={{width: '100%', marginTop: 8, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingLeft: 32, paddingRight: 32, marginBottom: 32,}}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <span className={styles.title}>꿈꾸는 소녀</span>
                    <span className={styles.desc}>마지막 쉼표 3시간 전</span>
                </div>
                <SmallButton label='닉네임 수정' className={styles.nicknameEditBtn}/>
            </div>
            <div ref={embiaRef} style={{ overflow: 'hidden', height: 404}}>
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: -16, paddingLeft: 'calc((100% - 320px) / 2)', paddingRight: 'calc((100% - 320px) / 2)'}}>
                    <Card backgroundUrl='/images/rest_1.svg' num={1} count={13} title='가볍게 산책하기'/>
                    <Card backgroundUrl='/images/rest_5.svg' num={2} count={5} title='title2'/>
                    <Card num={3} count={4} title='title3'/>
                    <Card num={4} count={3} title='title4'/>
                    <Card backgroundUrl='/images/rest_2.svg' num={5} count={2} title='title5'/>
                </div>
            </div>
            <div style={{width: '100%', marginTop: 48, paddingBottom: 155, paddingLeft: 32, paddingRight: 32,}}>
                <div className={styles.questionContainer}><span className={styles.questionNum}>Q1.</span>지금 기분이 어때요?</div>
                <div>
                    <AnswerContainer num={1} text={'멍하고 싶어'} percent={55}/>
                    <AnswerContainer num={2} text={'기분 전환이 필요해'} percent={35}/>
                    <AnswerContainer num={3} text={'가볍게 해볼 수 있어'} percent={10}/>
                </div>
                <div className={styles.questionContainer} style={{marginTop: 40}}><span className={styles.questionNum}>Q2.</span>어느정도 시간이 있어요?</div>
                <div>
                    <AnswerContainer num={1} text={'잠깐(1시간 이내)'} percent={70}/>
                    <AnswerContainer num={2} text={'여유(1-6시간이내)'} percent={25}/>
                    <AnswerContainer num={3} text={'넉넉(6시간이상)'} percent={5}/>
                </div>
            </div>
            <NavigationBar active='mypage' className={styles.navStyle}/>
        </div>
    )
}

export default MyPage;