import { CtaButton, colors, Icon } from '@comma/design-system';
import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRelaxActiveCount, startRelax } from '../../apis/relax';
import { BIG_HEIGHT, GAP, SMALL_WIDTH } from '../../data/cardInfo';
import { useCarousel } from '../../hooks/useCarousel';
import type { RelaxActivity, RestResultLocationState } from '../../types/relax';
import * as styles from './RestResult.css';
import Card from './RestResultCard';
import Modal from './RestResultModal';

function RestResult() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [isStarting, setIsStarting] = useState(false);
  const isStartingRef = useRef(false);

  const location = useLocation();
  const locationState = location.state as RestResultLocationState | null;
  const [data, setData] = useState<RelaxActivity[] | null>(
    locationState?.data?.length ? locationState.data : null
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [embiaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    watchResize: false
  });

  const cardCount = data?.length ?? 0;
  const {
    paths,
    sizes,
    xs,
    slideIdx,
    layoutReady,
    carouselHeight,
    carouselSlideWidth,
    carouselGap,
    isCompactHeight
  } = useCarousel(containerRef, cardCount, emblaApi, {
    bigHeight: BIG_HEIGHT,
    smallWidth: SMALL_WIDTH,
    gap: GAP
  });

  const selectedRelax = data?.[slideIdx];

  useEffect(() => {
    const nextData = locationState?.data;
    if (!nextData || nextData.length === 0 || !locationState?.mood || !locationState.timeBudget) {
      alert('휴식 추천 중 오류가 발생했습니다. 다시 선택해주세요');
      navigate('/rest/checklist', { replace: true });
      return;
    }

    setData(nextData);
  }, [locationState, navigate]);

  const handleStartClick = async () => {
    if (isStartingRef.current) return;

    if (!data?.length || !selectedRelax) {
      alert('휴식 추천 중 오류가 발생했습니다. 다시 선택해주세요');
      navigate('/rest/checklist', { replace: true });
      return;
    }

    isStartingRef.current = true;
    setIsStarting(true);

    try {
      const startResponse = await startRelax(selectedRelax.id);

      if (!startResponse.success) {
        throw new Error(startResponse.message ?? '휴식을 시작하지 못했어요.');
      }
    } catch (error) {
      console.error('Failed to start relax.', error);
      alert(error instanceof Error ? error.message : '휴식을 시작하지 못했어요.');
      isStartingRef.current = false;
      setIsStarting(false);
      return;
    }

    let nextSelectedRelax = selectedRelax;

    try {
      const response = await getRelaxActiveCount(selectedRelax.id);

      if (response.success && typeof response.data?.count === 'number') {
        nextSelectedRelax = {
          ...selectedRelax,
          activeUserCount: response.data.count
        };
      }
    } catch (error) {
      console.error('Failed to load active count.', error);
    }

    navigate('/rest/activity', {
      state: {
        data,
        selectedRelax: nextSelectedRelax,
        mood: locationState?.mood,
        timeBudget: locationState?.timeBudget
      }
    });
  };

  if (!data || data.length === 0) return null;

  const backgroundSrc = data[slideIdx].imageUrl || '/images/feed-image.svg';

  return (
    <div className={styles.container}>
      <img
        alt=""
        aria-hidden="true"
        className={styles.backgroundImage}
        decoding="async"
        fetchPriority="high"
        loading="eager"
        src={backgroundSrc}
      />
      <div aria-hidden="true" className={styles.backgroundOverlay} />
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
      <div className={styles.gradient} />
      <div className={styles.header}>
        <Icon name="x" color={colors.iconPrimary} onClick={() => setShowModal(true)} />
      </div>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className={styles.titleContainer}>
          <span className={styles.title}>{data[slideIdx].name}</span>
          <span className={styles.subTitle} style={{ marginBottom: isCompactHeight ? 32 : 64 }}>
            {data[slideIdx].description}
          </span>
        </div>
        <div
          ref={(node) => {
            embiaRef(node);
            containerRef.current = node;
          }}
          style={{ position: 'relative', overflow: 'hidden', height: carouselHeight }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: carouselGap }}>
            {data.map((card, _i) => (
              <div
                key={card.id}
                style={{ flex: `0 0 ${carouselSlideWidth}px`, height: carouselHeight }}
              />
            ))}
          </div>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {layoutReady
              ? data.map((card, i) => (
                  <Card
                    key={card.id}
                    imageSrc={card.imageUrl || '/images/feed-image.svg'}
                    path={paths[i]}
                    width={sizes[i].width}
                    height={sizes[i].height}
                    x={xs[i]}
                  />
                ))
              : null}
          </div>
        </div>
        <div className={styles.dotContainer[isCompactHeight ? 'compact' : 'normal']}>
          {Array.from({ length: data.length }, (_, idx) => idx + 1).map((i) => (
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
      </div>
      <footer className={styles.footer}>
        <CtaButton
          className={styles.ctaButtonStyle}
          disabled={isStarting}
          onClick={handleStartClick}
        >
          {isStarting ? '시작하는 중' : '시작하기'}
        </CtaButton>
      </footer>
    </div>
  );
}

export default RestResult;
