import { CtaButton, colors, Icon, ImageUpload, NavigationBar } from '@comma/design-system';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import useEmblaCarousel from 'embla-carousel-react';
import { getSvgPath } from "figma-squircle";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as styles from './RestResult.css';

function Modal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className={styles.modalContainer}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rest-select-modal-title"
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', marginBottom: 32 }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Icon name="x" color={colors.iconPrimary} onClick={onClose} />
        </div>
        <span className={styles.modalTitle} id="rest-select-modal-title">
          휴식 재선택
        </span>
        <span className={styles.modalDesc}>휴식을 다시 선택할까요?</span>
      </div>
      <div style={{ width: '100%' }}>
        <CtaButton className={styles.cancleBtn} onClick={onClose}>
          취소
        </CtaButton>
        <CtaButton className={styles.confirmBtn}>확인</CtaButton>
      </div>
    </div>
  );
}

function Card({
  imageSrc,
  num,
  cardStyle
}: {
  imageSrc?: string;
  num?: number;
  cardStyle?: object;
}) {
  return (
    <div className={styles.embiaSlide}>
      <ImageUpload
        state="exist"
        imageSrc={imageSrc}
        className={styles.imageUploadStyle}
        style={cardStyle}
      />
      {num != null ? (
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            left: 40,
            width: 'calc(100% - 64px)',
            textAlign: 'left',
            zIndex: 2
          }}
        >
          <span className={styles.imageNumStyle}>31</span>
          <span className={styles.imageText}> 명이 함께하는 중</span>
        </div>
      ) : null}
    </div>
  );
}

function RestResult() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const [scales, setScales] = useState<number[]>([]);
  const backgrounds = ['/images/rest_1.svg', '/images/rest_2.svg', '', '', '/images/rest_5.svg'];
  const [embiaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center'
  });

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSlideIdx(emblaApi.selectedScrollSnap());
    };

    const onScroll = () => {
      const engine = emblaApi.internalEngine();
      const slideRegistry = engine.slideRegistry;
      const scrollSnaps = emblaApi.scrollSnapList();
      const scrollProgress = emblaApi.scrollProgress();
      const newScales = slideRegistry.map((_, snapIdx) => {
        let diff = Math.abs(scrollSnaps[snapIdx] - scrollProgress);
        if (diff > 0.5) diff = 1 - diff;
        return Math.max(0, 1 - diff * 8);
      });

      setScales(newScales);
    };

    emblaApi.on('select', onSelect);
    emblaApi.on('scroll', onScroll);
    emblaApi.on('reInit', onScroll);

    onSelect();
    onScroll();

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('scroll', onScroll);
      emblaApi.off('reInit', onScroll);
    };
  }, [emblaApi]);

  const getCardStyle = (idx: number) => {
    const progress = scales[idx] ?? 0;
    const width = Math.round(200 + progress * 80);
    const height = Math.round(253 + progress * 101);
    return {
      width,
      height,
      borderRadius: 0,
      clipPath: `path("M0 82.944 C0 14.6396 14.7469 0 83.552 0 H196.448 C265.253 0 280 14.6396 280 82.944 V271.056 C280 339.36 265.253 354 196.448 354 H83.552 C14.7469 354 0 339.36 0 271.056 V82.944 Z")`
    };
  };

  return (
    <div
      className={styles.container}
      style={assignInlineVars({
        [styles.backgroundImageVar]: `url(${backgrounds[slideIdx]}) center / cover no-repeat`
      })}
    >
      {showModal ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(26, 24, 20, 0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100
          }}
        >
          <Modal onClose={() => setShowModal(false)} />
        </div>
      ) : null}
      <div
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: 120,
          background: 'linear-gradient(rgba(17, 17, 17, 0.66) 0%, rgba(17, 17, 17, 0) 100%)',
          zIndex: -1
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: 600,
          background:
            'linear-gradient(to top, rgba(17, 17, 17, 0.66) 0%, rgba(17, 17, 17, 0) 100%)',
          zIndex: -1
        }}
      />
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          boxSizing: 'border-box',
          padding: '20px 32px'
        }}
      >
        <Icon name="x" color={colors.iconPrimary} onClick={() => setShowModal(true)} />
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            width: '100%',
            boxSizing: 'border-box',
            paddingLeft: 32,
            paddingRight: 32,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <span className={styles.title}>가볍게 산책하기</span>
          <span className={styles.subTitle}>동네 한바퀴하면서 예쁜 하늘 사진 한장 어떠세요?</span>
        </div>
        <div ref={embiaRef} style={{ overflow: 'hidden', height: 354 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Card imageSrc="/images/rest_1.svg" num={31} cardStyle={getCardStyle(0)} />
            <Card imageSrc="/images/rest_2.svg" cardStyle={getCardStyle(1)} />
            <Card cardStyle={getCardStyle(2)} />
            <Card cardStyle={getCardStyle(3)} />
            <Card imageSrc="/images/rest_5.svg" cardStyle={getCardStyle(4)} />
          </div>
        </div>
        <div
          style={{
            width: 88,
            height: 8,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: '0 auto',
            marginTop: 16,
            marginBottom: 32
          }}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={styles.dot}
              style={{
                backgroundColor:
                  slideIdx + 1 === i ? colors.iconPrimary : 'rgba(252, 252, 252, 0.15)'
              }}
            />
          ))}
        </div>
        <CtaButton className={styles.ctaButtonStyle} onClick={() => navigate('/rest/activity')} />
      </div>
      <NavigationBar active="rest" className={styles.navStyle} />
    </div>
  );
}

export default RestResult;
