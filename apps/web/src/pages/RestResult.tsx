import { CtaButton, colors, Icon, ImageUpload, NavigationBar } from '@comma/design-system';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import useEmblaCarousel from 'embla-carousel-react';
import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interpolatePath, lerp } from '../utils/interpolatePath';
import * as styles from './RestResult.css';

const BIG_PATH =
  'M0 94.659C0 16.7073 16.8536 0 95.488 0H224.512C303.146 0 320 16.7073 320 94.659V309.341C320 387.293 303.146 404 224.512 404H95.488C16.8536 404 0 387.293 0 309.341V94.659Z';
const SMALL_PATH =
  'M0 70.9943C0 12.5305 12.6402 0 71.616 0H168.384C227.36 0 240 12.5305 240 70.9943V232.006C240 290.469 227.36 303 168.384 303H71.616C12.6402 303 0 290.469 0 232.006V70.9943Z';
const BIG_WIDTH = 320;
const BIG_HEIGHT = 404;
const SMALL_WIDTH = 240;
const SMALL_HEIGHT = 303;
const GAP = 16;
const CARD_COUNT = 5;

const computeLoopedLayout = (
  scrollSnaps: number[],
  scrollProgress: number,
  viewportWidth: number
) => {
  const offsets = scrollSnaps.map((snap) => {
    let diff = snap - scrollProgress;
    if (diff > 0.5) diff -= 1;
    if (diff < -0.5) diff += 1;
    return diff * CARD_COUNT;
  });
  const scales = offsets.map((o) => Math.max(0, 1 - Math.abs(o)));
  const widths = scales.map((s) => lerp(SMALL_WIDTH, BIG_WIDTH, s));
  const heights = scales.map((s) => lerp(SMALL_HEIGHT, BIG_HEIGHT, s));

  const order = offsets.map((_, i) => i).sort((a, b) => offsets[a] - offsets[b]);

  const lefts: number[] = new Array(CARD_COUNT);
  order.forEach((i, k) => {
    if (k === 0) {
      lefts[i] = 0;
    } else {
      const prev = order[k - 1];
      lefts[i] = lefts[prev] + widths[prev] + GAP;
    }
  });
  const centerOf = (i: number) => lefts[i] + widths[i] / 2;

  let lowerIdxInOrder = 0;
  for (let k = 0; k < order.length - 1; k++) {
    if (offsets[order[k]] <= 0) lowerIdxInOrder = k;
  }
  const lowerI = order[lowerIdxInOrder];
  const upperI = order[Math.min(lowerIdxInOrder + 1, order.length - 1)];
  const span = offsets[upperI] - offsets[lowerI];
  const frac = span !== 0 ? (0 - offsets[lowerI]) / span : 0;
  const focalCenter = lerp(centerOf(lowerI), centerOf(upperI), frac);
  const virtualScrollLeft = focalCenter - viewportWidth / 2;

  return {
    paths: scales.map((s) => interpolatePath(SMALL_PATH, BIG_PATH, s)),
    sizes: widths.map((w, i) => ({ width: w, height: heights[i] })),
    xs: lefts.map((l) => l - virtualScrollLeft)
  };
};

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
  const backgrounds = ['/images/rest_1.svg', '/images/rest_2.svg', '', '', '/images/rest_5.svg'];
  const infos = [
    {
      title: '가볍게 산책하기',
      subTitle: '동네 산책하면서 예쁜 하늘 사진 한장 어떠세요?',
    },
    {
      title: '예시 타이틀',
      subTitle: '예시 설명',
    },
    {
      title: '예시 타이틀',
      subTitle: '예시 설명',
    },
    {
      title: '예시 타이틀',
      subTitle: '예시 설명',
    },
    {
      title: '예시 타이틀',
      subTitle: '예시 설명',
    },
  ]
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
          <span className={styles.title}>{infos[slideIdx].title}</span>
          <span className={styles.subTitle}>{infos[slideIdx].subTitle}</span>
        </div>
        <div
          ref={(node) => {
            embiaRef(node);
            containerRef.current = node;
          }}
          style={{ position: 'relative', overflow: 'hidden', height: BIG_HEIGHT }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: GAP }}>
            {backgrounds.map((_, i) => (
              <div key={i} style={{ flex: `0 0 ${SMALL_WIDTH}px`, height: BIG_HEIGHT }} />
            ))}
          </div>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {backgrounds.map((bg, i) => (
              <Card
                key={i}
                imageSrc={bg || '/images/feed-image.svg'}
                num={i === 0 ? 31 : i}
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
      <NavigationBar active="rest" className={styles.navStyle} onItemSelect={(item) => {
        switch(item) {
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
      }}/>
    </div>
  );
}

export default RestResult;
