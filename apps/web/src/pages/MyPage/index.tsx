import { Icon, NavigationBar, SmallButton } from '@comma/design-system';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import useEmblaCarousel from 'embla-carousel-react';
import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interpolatePath, lerp } from '../../utils/interpolatePath';
import * as styles from './MyPage.css';
import MyPageAnswerContainer from './MyPageAnswerContainer';
import MyPageCard from './MyPageCard';
import MyPageNicknameModal from './MyPageNicknameModal';

const backgrounds = ['/images/rest_1.svg', '/images/rest_5.svg', '', '', '/images/rest_2.svg'];

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

const computeLayout = (virtualIndex: number, viewportWidth: number) => {
  const scales = Array.from({ length: CARD_COUNT }, (_, i) =>
    Math.max(0, 1 - Math.abs(virtualIndex - i))
  );
  const widths = scales.map((s) => lerp(SMALL_WIDTH, BIG_WIDTH, s));
  const heights = scales.map((s) => lerp(SMALL_HEIGHT, BIG_HEIGHT, s));

  const lefts: number[] = [];
  let cursor = 0;
  widths.forEach((w) => {
    lefts.push(cursor);
    cursor += w + GAP;
  });
  const centers = widths.map((w, i) => lefts[i] + w / 2);

  const lowerIndex = Math.max(0, Math.min(CARD_COUNT - 2, Math.floor(virtualIndex)));
  const frac = virtualIndex - lowerIndex;
  const focalCenter = lerp(centers[lowerIndex], centers[lowerIndex + 1], frac);
  const virtualScrollLeft = focalCenter - viewportWidth / 2;

  return {
    paths: scales.map((s) => interpolatePath(SMALL_PATH, BIG_PATH, s)),
    sizes: widths.map((w, i) => ({ width: w, height: heights[i] })),
    xs: lefts.map((l) => l - virtualScrollLeft)
  };
};

function MyPage() {
  const [embiaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    containScroll: false,
    watchResize: false
  });
  const [bgUrl, setBgUrl] = useState('');
  const [paths, setPaths] = useState([BIG_PATH, SMALL_PATH, SMALL_PATH, SMALL_PATH, SMALL_PATH]);
  const [sizes, setSizes] = useState([
    { width: BIG_WIDTH, height: BIG_HEIGHT },
    { width: SMALL_WIDTH, height: SMALL_HEIGHT },
    { width: SMALL_WIDTH, height: SMALL_HEIGHT },
    { width: SMALL_WIDTH, height: SMALL_HEIGHT },
    { width: SMALL_WIDTH, height: SMALL_HEIGHT }
  ]);
  const [xs, setXs] = useState([0, 0, 0, 0, 0]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const viewportWidth = containerRef.current.getBoundingClientRect().width;
    const { paths, sizes, xs } = computeLayout(0, viewportWidth);
    setPaths(paths);
    setSizes(sizes);
    setXs(xs);
  }, []);

  useLayoutEffect(() => {
    if (!emblaApi) return;
    const updateCardTransforms = () => {
      const viewportWidth = emblaApi.rootNode().getBoundingClientRect().width;
      const scrollProgress = emblaApi.scrollProgress();
      const virtualIndex = scrollProgress * (CARD_COUNT - 1);
      const { paths, sizes, xs } = computeLayout(virtualIndex, viewportWidth);
      setPaths(paths);
      setSizes(sizes);
      setXs(xs);
    };
    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap();
      setBgUrl(backgrounds[index]);
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
        [styles.backgroundImageVar]: `url(${bgUrl}) no-repeat center / cover`
      })}
    >
      {showModal ? (
        <div style={{ position: 'fixed', zIndex: 2, inset: 0, backgroundColor: '#1A181466' }}>
          <MyPageNicknameModal onCancelClick={() => setShowModal(false)} />
        </div>
      ) : null}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            width: '100%',
            height: 447,
            background: 'linear-gradient(#11111166 0%, rgba(17, 17, 17, 0) 100%)'
          }}
        />
        <div
          style={{
            flex: 1,
            width: '100%',
            background: 'linear-gradient(to top, #11111166 0%, rgba(17, 17, 17, 0) 100%)'
          }}
        />
      </div>
      <div />
      <div className={styles.header}>
        <span>마이페이지</span>
        <div className={styles.headerIconContainer}>
          <Icon name="setting" onClick={() => navigate('/setting')} />
        </div>
      </div>
      <div
        style={{
          width: '100%',
          marginTop: 8,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          paddingLeft: 32,
          paddingRight: 32,
          marginBottom: 32
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className={styles.title}>꿈꾸는 소녀</span>
          <span className={styles.desc}>마지막 쉼표 3시간 전</span>
        </div>
        <SmallButton
          label="닉네임 수정"
          className={styles.nicknameEditBtn}
          onClick={() => setShowModal(true)}
        />
      </div>
      <div
        ref={(node) => {
          embiaRef(node);
          containerRef.current = node;
        }}
        style={{ position: 'relative', overflow: 'hidden', height: 404 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: GAP }}>
          <div style={{ flex: `0 0 ${SMALL_WIDTH}px`, height: BIG_HEIGHT }} />
          <div style={{ flex: `0 0 ${SMALL_WIDTH}px`, height: BIG_HEIGHT }} />
          <div style={{ flex: `0 0 ${SMALL_WIDTH}px`, height: BIG_HEIGHT }} />
          <div style={{ flex: `0 0 ${SMALL_WIDTH}px`, height: BIG_HEIGHT }} />
          <div style={{ flex: `0 0 ${SMALL_WIDTH}px`, height: BIG_HEIGHT }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <MyPageCard
            backgroundUrl="/images/rest_1.svg"
            num={1}
            count={13}
            title="가볍게 산책하기"
            path={paths[0]}
            width={sizes[0].width}
            height={sizes[0].height}
            x={xs[0]}
          />
          <MyPageCard
            backgroundUrl="/images/rest_5.svg"
            num={2}
            count={5}
            title="title2"
            path={paths[1]}
            width={sizes[1].width}
            height={sizes[1].height}
            x={xs[1]}
          />
          <MyPageCard
            num={3}
            count={4}
            title="title3"
            path={paths[2]}
            width={sizes[2].width}
            height={sizes[2].height}
            x={xs[2]}
          />
          <MyPageCard
            num={4}
            count={3}
            title="title4"
            path={paths[3]}
            width={sizes[3].width}
            height={sizes[3].height}
            x={xs[3]}
          />
          <MyPageCard
            backgroundUrl="/images/rest_2.svg"
            num={5}
            count={2}
            title="title5"
            path={paths[4]}
            width={sizes[4].width}
            height={sizes[4].height}
            x={xs[4]}
          />
        </div>
      </div>
      <div
        style={{
          width: '100%',
          marginTop: 48,
          paddingBottom: 155,
          paddingLeft: 32,
          paddingRight: 32
        }}
      >
        <div className={styles.questionContainer}>
          <span className={styles.questionNum}>Q1.</span>지금 기분이 어때요?
        </div>
        <div>
          <MyPageAnswerContainer num={1} text={'멍하고 싶어'} percent={55} />
          <MyPageAnswerContainer num={2} text={'기분 전환이 필요해'} percent={35} />
          <MyPageAnswerContainer num={3} text={'가볍게 해볼 수 있어'} percent={10} />
        </div>
        <div className={styles.questionContainer} style={{ marginTop: 40 }}>
          <span className={styles.questionNum}>Q2.</span>어느정도 시간이 있어요?
        </div>
        <div>
          <MyPageAnswerContainer num={1} text={'잠깐(1시간 이내)'} percent={70} />
          <MyPageAnswerContainer num={2} text={'여유(1-6시간이내)'} percent={25} />
          <MyPageAnswerContainer num={3} text={'넉넉(6시간이상)'} percent={5} />
        </div>
      </div>
      <NavigationBar
        active="mypage"
        className={styles.navStyle}
        onItemSelect={(item) => {
          switch (item) {
            case 'rest':
              navigate('/rest/checklist');
              break;
            case 'feed':
              navigate('/feed');
              break;
            case 'archive':
              navigate('/archive');
              break;
            case 'mypage':
              break;
          }
        }}
      />
    </div>
  );
}

export default MyPage;
