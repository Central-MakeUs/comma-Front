import { CtaButton, colors, Icon, ImageUpload } from '@comma/design-system';
import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRelaxActiveCount, startRelax } from '../apis/relax';
import { BIG_HEIGHT, GAP, SMALL_WIDTH } from '../data/cardInfo';
import type { RelaxActivity, RestResultLocationState } from '../types/relax';
import { computeLoopedLayout } from '../utils/compute_layout';
import * as styles from './RestResult.css';

const getCarouselLayoutScale = () => {
  if (typeof window === 'undefined') return 1;

  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

  if (viewportHeight <= 700) return 0.84;
  if (viewportHeight <= 760) return 0.92;

  return 1;
};

function Modal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();

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
        <CtaButton className={styles.confirmBtn} onClick={() => navigate('/rest/checklist')}>
          확인
        </CtaButton>
      </div>
    </div>
  );
}

function Card({
  imageSrc,
  path,
  width,
  height,
  x
}: {
  imageSrc?: string;
  path: string;
  width: number;
  height: number;
  x: number;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        transform: `translate(${x}px, -50%)`,
        width,
        height
      }}
    >
      <ImageUpload
        state="exist"
        imageSrc={imageSrc}
        className={styles.imageUploadStyle}
        style={{ width, height, borderRadius: 0, clipPath: `path("${path}")` }}
      />
    </div>
  );
}

function RestResult() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);
  const location = useLocation();
  const locationState = location.state as RestResultLocationState | null;
  const [data, setData] = useState<RelaxActivity[] | null>(
    locationState?.data?.length ? locationState.data : null
  );
  const [carouselLayoutScale, setCarouselLayoutScale] = useState(getCarouselLayoutScale);

  const [paths, setPaths] = useState<string[]>([]);
  const [sizes, setSizes] = useState<{ width: number; height: number }[]>([]);
  const [xs, setXs] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [embiaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    watchResize: false
  });
  const cardCount = data?.length ?? 0;
  const layoutReady =
    cardCount > 0 &&
    paths.length === cardCount &&
    sizes.length === cardCount &&
    xs.length === cardCount;
  const selectedRelax = data?.[slideIdx];
  const carouselHeight = BIG_HEIGHT * carouselLayoutScale;
  const carouselSlideWidth = SMALL_WIDTH * carouselLayoutScale;
  const carouselGap = GAP * carouselLayoutScale;
  const isCompactHeight = carouselLayoutScale < 1;

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
    if (!data?.length || !selectedRelax) {
      alert('휴식 추천 중 오류가 발생했습니다. 다시 선택해주세요');
      navigate('/rest/checklist', { replace: true });
      return;
    }

    let nextSelectedRelax = selectedRelax;

    try {
      await startRelax(selectedRelax.id);
      const response = await getRelaxActiveCount(selectedRelax.id);
      nextSelectedRelax = {
        ...selectedRelax,
        activeUserCount:
          typeof response.data?.count === 'number'
            ? response.data.count
            : selectedRelax.activeUserCount
      };
    } catch (error) {
      console.error('Failed to start relax or load active count.', error);
    } finally {
      navigate('/rest/activity', {
        state: {
          data,
          selectedRelax: nextSelectedRelax,
          mood: locationState?.mood,
          timeBudget: locationState?.timeBudget
        }
      });
    }
  };

  useLayoutEffect(() => {
    if (!containerRef.current || cardCount === 0) return;
    const viewportWidth = containerRef.current.getBoundingClientRect().width;
    const initialSnaps = Array.from({ length: cardCount }, (_, i) => i / cardCount);
    const { paths, sizes, xs } = computeLoopedLayout(
      initialSnaps,
      0,
      viewportWidth,
      cardCount,
      carouselLayoutScale
    );
    setPaths(paths);
    setSizes(sizes);
    setXs(xs);
  }, [cardCount, carouselLayoutScale]);

  useEffect(() => {
    const updateCarouselLayoutScale = () => {
      setCarouselLayoutScale(getCarouselLayoutScale());
    };

    window.addEventListener('resize', updateCarouselLayoutScale);
    window.visualViewport?.addEventListener('resize', updateCarouselLayoutScale);

    return () => {
      window.removeEventListener('resize', updateCarouselLayoutScale);
      window.visualViewport?.removeEventListener('resize', updateCarouselLayoutScale);
    };
  }, []);

  useLayoutEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();

    const updateCardTransforms = () => {
      const viewportWidth = emblaApi.rootNode().getBoundingClientRect().width;
      const scrollSnaps = emblaApi.scrollSnapList();
      const scrollProgress = emblaApi.scrollProgress();
      const { paths, sizes, xs } = computeLoopedLayout(
        scrollSnaps,
        scrollProgress,
        viewportWidth,
        cardCount,
        carouselLayoutScale
      );
      setPaths(paths);
      setSizes(sizes);
      setXs(xs);
    };
    const onSelect = () => {
      setSlideIdx(emblaApi.selectedScrollSnap());
    };
    updateCardTransforms();
    onSelect();
    emblaApi.on('scroll', updateCardTransforms);
    emblaApi.on('reInit', updateCardTransforms);
    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('scroll', updateCardTransforms);
      emblaApi.off('reInit', updateCardTransforms);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, cardCount, carouselLayoutScale]);

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
      <div
        style={{
          position: 'absolute',
          top: 254,
          bottom: -2,
          width: '100%',
          background: 'linear-gradient(0deg, rgba(17, 17, 17, 0.66) 0%, rgba(17, 17, 17, 0) 100%)',
          zIndex: -1
        }}
      />
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          boxSizing: 'border-box',
          padding:
            'calc(20px + var(--safe-area-top)) calc(32px + var(--safe-area-right)) 20px calc(32px + var(--safe-area-left))'
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
        <div
          style={{
            width: 88,
            height: 8,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: '0 auto',
            marginTop: isCompactHeight ? 12 : 16,
            marginBottom: isCompactHeight ? 0 : 24
          }}
        >
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
        <CtaButton className={styles.ctaButtonStyle} onClick={handleStartClick} />
      </footer>
    </div>
  );
}

export default RestResult;
