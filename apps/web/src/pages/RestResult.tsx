import { useRef, useEffect, useState } from 'react';
import { Icon, NavigationBar, ImageUpload, CtaButton } from "@comma/design-system";
import * as styles from './RestResult.css';
import { colors } from '@comma/design-system';

const CARD_GAP = 20;
const MIN_W = 200, MAX_W = 280;
const MIN_H = 253, MAX_H = 354;
const SETTLED_STEP = MIN_W + CARD_GAP;

function RestResult() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollX, setScrollX] = useState(SETTLED_STEP);
    const isJumping = useRef(false);

    const activeItem = Math.min(Math.max(Math.round(scrollX / SETTLED_STEP), 1), 5);

    const cardDims = (cardIndex: number) => {
        const t = Math.max(0, 1 - Math.abs(scrollX - cardIndex * SETTLED_STEP) / SETTLED_STEP);
        return {
            width: MIN_W + t * (MAX_W - MIN_W),
            height: MIN_H + t * (MAX_H - MIN_H),
            borderRadius: activeItem == cardIndex ? 70 : 50
        };
    };

    const item1Inner = (dims: { width: number; height: number }) => (
        <>
            <ImageUpload state='exist' imageSrc='/images/rest_1.svg' className={styles.imageUploadStyle} style={dims} />
            <div style={{position: 'absolute', bottom: 32, left: 40, width: 'calc(100% - 64px)', textAlign: 'left', zIndex: 2}}>
                <span className={styles.imageNumStyle}>31</span>
                <span className={styles.imageText}> 명이 함께하는 중</span>
            </div>
        </>
    );

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollLeft = SETTLED_STEP;
        setScrollX(SETTLED_STEP);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        let timeout: ReturnType<typeof setTimeout>;
        const onScroll = () => {
            if (!isJumping.current) {
                setScrollX(el.scrollLeft);
            }

            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if (isJumping.current) return;
                const index = Math.round(el.scrollLeft / SETTLED_STEP);
                if (index === 0) {
                    isJumping.current = true;
                    el.scrollLeft = 5 * SETTLED_STEP;
                    setScrollX(5 * SETTLED_STEP);
                    requestAnimationFrame(() => { isJumping.current = false; });
                } else if (index === 6) {
                    isJumping.current = true;
                    el.scrollLeft = 1 * SETTLED_STEP;
                    setScrollX(1 * SETTLED_STEP);
                    requestAnimationFrame(() => { isJumping.current = false; });
                }
            }, 150);
        };

        el.addEventListener('scroll', onScroll);
        return () => {
            el.removeEventListener('scroll', onScroll);
            clearTimeout(timeout);
        };
    }, []);

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
                <div className={styles.rowScrollContainer} ref={scrollRef}>
                    <div className={styles.rowScrollWrapper}>
                        <div style={{flexShrink: 0, marginRight: CARD_GAP, scrollSnapAlign: 'center'}}>
                            <ImageUpload state='exist' imageSrc='/images/rest_5.svg' className={styles.imageUploadStyle} style={cardDims(0)}/>
                        </div>
                        <div style={{position: 'relative', flexShrink: 0, marginRight: CARD_GAP, scrollSnapAlign: 'center'}}>
                            {item1Inner(cardDims(1))}
                        </div>
                        <div style={{flexShrink: 0, marginRight: CARD_GAP, scrollSnapAlign: 'center'}}>
                            <ImageUpload state='exist' imageSrc='/images/rest_2.svg' className={styles.imageUploadStyle} style={cardDims(2)}/>
                        </div>
                        <div style={{flexShrink: 0, marginRight: CARD_GAP, scrollSnapAlign: 'center'}}>
                            <ImageUpload state='exist' className={styles.imageUploadStyle} style={cardDims(3)}/>
                        </div>
                        <div style={{flexShrink: 0, marginRight: CARD_GAP, scrollSnapAlign: 'center'}}>
                            <ImageUpload state='exist' className={styles.imageUploadStyle} style={cardDims(4)}/>
                        </div>
                        <div style={{flexShrink: 0, marginRight: CARD_GAP, scrollSnapAlign: 'center'}}>
                            <ImageUpload state='exist' imageSrc='/images/rest_5.svg' className={styles.imageUploadStyle} style={cardDims(5)}/>
                        </div>
                        <div style={{position: 'relative', flexShrink: 0, marginRight: CARD_GAP, scrollSnapAlign: 'center'}}>
                            {item1Inner(cardDims(6))}
                        </div>
                    </div>
                </div>
                <div style={{width: 88, height: 8, boxSizing: 'border-box', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '0 auto', marginTop: 16, marginBottom: 32}}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={styles.dot} style={{backgroundColor: activeItem === i ? colors.iconPrimary : undefined}}/>
                    ))}
                </div>
                <CtaButton className={styles.ctaButtonStyle}/>
            </div>
            <NavigationBar active='rest' className={styles.navStyle}/>
        </div>
    );
}

export default RestResult;
