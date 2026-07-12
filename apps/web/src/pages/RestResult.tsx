import { CtaButton, colors, Icon, ImageUpload, NavigationBar } from '@comma/design-system';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import useEmblaCarousel from 'embla-carousel-react';
import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BIG_HEIGHT,
  BIG_PATH,
  BIG_WIDTH,
  CARD_COUNT,
  GAP,
  SMALL_HEIGHT,
  SMALL_PATH,
  SMALL_WIDTH
} from '../data/cardInfo';
import { computeLoopedLayout } from '../utils/compute_layout';
import * as styles from './RestResult.css';
import { useLocation } from 'react-router-dom';
import type { RelaxActivity } from '../apis/relax';

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
  path,
  width,
  height,
  x
}: {
  imageSrc?: string;
  num?: number;
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
          <span className={styles.imageNumStyle}>{num}</span>
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
  const location = useLocation();
  const { data } = (location.state as { data: RelaxActivity[] } | null) ?? { data: [] };

  const backgrounds = [
    {
      id: 'bg-1',
      src: '/images/rest_1.png'
    },
    {
      id: 'bg-2',
      src: '/images/rest_2.png'
    },
    {
      id: 'bg-3',
      src: ''
    },
    {
      id: 'bg-4',
      src: ''
    },
    {
      id: 'bg-5',
      src: '/images/rest_5.png'
    }
  ];
  const [paths, setPaths] = useState([BIG_PATH, SMALL_PATH, SMALL_PATH, SMALL_PATH, SMALL_PATH]);
  const [sizes, setSizes] = useState([
    { width: BIG_WIDTH, height: BIG_HEIGHT },
    { width: SMALL_WIDTH, height: SMALL_HEIGHT },
    { width: SMALL_WIDTH, height: SMALL_HEIGHT },
    { width: SMALL_WIDTH, height: SMALL_HEIGHT },
    { width: SMALL_WIDTH, height: SMALL_HEIGHT }
  ]);
  const [xs, setXs] = useState([0, 0, 0, 0, 0]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [embiaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    watchResize: false
  });

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const viewportWidth = containerRef.current.getBoundingClientRect().width;
    const initialSnaps = Array.from({ length: CARD_COUNT }, (_, i) => i / CARD_COUNT);
    const { paths, sizes, xs } = computeLoopedLayout(initialSnaps, 0, viewportWidth);
    setPaths(paths);
    setSizes(sizes);
    setXs(xs);
  }, []);

  useLayoutEffect(() => {
    if (!emblaApi) return;
    const updateCardTransforms = () => {
      const viewportWidth = emblaApi.rootNode().getBoundingClientRect().width;
      const scrollSnaps = emblaApi.scrollSnapList();
      const scrollProgress = emblaApi.scrollProgress();
      const { paths, sizes, xs } = computeLoopedLayout(scrollSnaps, scrollProgress, viewportWidth);
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
  }, [emblaApi]);

  return (
    <div
      className={styles.container}
      style={assignInlineVars({
        [styles.backgroundImageVar]: `url(${data[slideIdx].imageUrl || '/images/feed-image.svg'}) center / cover no-repeat`
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
          <span className={styles.title}>{data[slideIdx].name}</span>
          <span className={styles.subTitle}>{data[slideIdx].description}</span>
        </div>
        <div
          ref={(node) => {
            embiaRef(node);
            containerRef.current = node;
          }}
          style={{ position: 'relative', overflow: 'hidden', height: BIG_HEIGHT }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: GAP }}>
            {data.map((card, _i) => (
              <div key={card.id} style={{ flex: `0 0 ${SMALL_WIDTH}px`, height: BIG_HEIGHT }} />
            ))}
          </div>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {data.map((card, i) => (
              <Card
                key={card.id}
                imageSrc={card.imageUrl || '/images/feed-image.svg'}
                num={card.activeUserCount}
                path={paths[i]}
                width={sizes[i].width}
                height={sizes[i].height}
                x={xs[i]}
              />
            ))}
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
      <NavigationBar
        active="rest"
        className={styles.navStyle}
        onItemSelect={(item) => {
          switch (item) {
            case 'rest':
              break;
            case 'feed':
              navigate('/feed');
              break;
            case 'archive':
              navigate('/archive');
              break;
            case 'mypage':
              navigate('/mypage');
              break;
          }
        }}
      />
    </div>
  );
}

export default RestResult;
