import { CtaButton, colors, Icon, ImageUpload, NavigationBar, typography } from '@comma/design-system';
import { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import * as styles from './RestResult.css';

function Modal({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.modalContainer} role="dialog" aria-modal="true" aria-labelledby="rest-select-modal-title">
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', marginBottom: 32 }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Icon name="x" color={colors.iconPrimary} onClick={onClose} />
        </div>
        <span className={styles.modalTitle} id="rest-select-modal-title">휴식 재선택</span>
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

function Card({imageSrc, num, cardStyle}:{imageSrc?:string, num?:number, cardStyle?:object}) {
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
      ): null}
    </div>
  )
}

function RestResult() {
  const [showModal, setShowModal] = useState(false);
  const [slideIdx, setSlideIdx] = useState(1);
  const [embiaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
  });
  useEffect(() => {
    if(!emblaApi) return;
    const onSelect = () => {
      setSlideIdx(emblaApi.selectedScrollSnap());
    }
    emblaApi.on('select', onSelect);
    onSelect();

  }, [emblaApi])
  const setActiveCardStyle = (idx:number) => {
    if(slideIdx == idx) return {width: 280, height: 354, borderRadius: 70}
    else return {width: 200, height: 253, borderRadius: 50}
  }

  return (
    <div className={styles.container}>
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
        <div ref={embiaRef} style={{overflow: 'hidden'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Card imageSrc="/images/rest_1.svg" num={31} cardStyle={setActiveCardStyle(0)}/>
            <Card imageSrc="/images/rest_2.svg" cardStyle={setActiveCardStyle(1)}/>
            <Card cardStyle={setActiveCardStyle(2)}/>
            <Card cardStyle={setActiveCardStyle(3)}/>
            <Card imageSrc="/images/rest_5.svg" cardStyle={setActiveCardStyle(4)}/>
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
              style={{backgroundColor: (slideIdx + 1) == i ? colors.iconPrimary : 'rgba(252, 252, 252, 0.15)'}}
            />
          ))}
        </div>
        <CtaButton className={styles.ctaButtonStyle} />
      </div>
      <NavigationBar active="rest" className={styles.navStyle} />
    </div>
  );
}

export default RestResult;
