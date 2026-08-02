import { colors, Icon, NavigationBar, SmallButton } from '@comma/design-system';
import { useQuery } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyFeeds } from '../../apis/feed';
import { getMyReport, myReportQueryKey } from '../../apis/mypage';
import { interpolatePath, lerp } from '../../utils/compute_layout';
import { navigateToNavigationItem } from '../../utils/navigation';
import { getStoredNickname, setStoredNickname } from '../../utils/tokenStorage';
import { transformDate } from '../../utils/transformDate';
import * as styles from './MyPage.css';
import MyPageAnswerContainer from './MyPageAnswerContainer';
import MyPageCard from './MyPageCard';
import MyPageNicknameModal from './MyPageNicknameModal';

const backgrounds = [
  '/images/rest_1.png',
  '/images/rest_5.png',
  '/images/feed-image.svg',
  '/images/feed-image.svg',
  '/images/rest_2.png'
];

const BIG_PATH =
  'M0 94.659C0 16.7073 16.8536 0 95.488 0H224.512C303.146 0 320 16.7073 320 94.659V309.341C320 387.293 303.146 404 224.512 404H95.488C16.8536 404 0 387.293 0 309.341V94.659Z';
const SMALL_PATH =
  'M0 70.9943C0 12.5305 12.6402 0 71.616 0H168.384C227.36 0 240 12.5305 240 70.9943V232.006C240 290.469 227.36 303 168.384 303H71.616C12.6402 303 0 290.469 0 232.006V70.9943Z';
const BIG_WIDTH = 320;
const BIG_HEIGHT = 404;
const SMALL_WIDTH = 240;
const SMALL_HEIGHT = 303;
const GAP = 16;
const MIN_CARD_SCALE = 0.78;
const MAX_CARD_SCALE = 1;

const scalePath = (path: string, scale: number) => {
  const regex = /-?\d*\.?\d+/g;

  return path.replace(regex, (value) => (Number(value) * scale).toFixed(3));
};

const computeLayout = (virtualIndex: number, viewportWidth: number, cardCount: number) => {
  const layoutScale = Math.max(
    MIN_CARD_SCALE,
    Math.min(MAX_CARD_SCALE, (viewportWidth - 64) / BIG_WIDTH)
  );
  const bigWidth = BIG_WIDTH * layoutScale;
  const bigHeight = BIG_HEIGHT * layoutScale;
  const smallWidth = SMALL_WIDTH * layoutScale;
  const smallHeight = SMALL_HEIGHT * layoutScale;
  const gap = GAP * layoutScale;
  if (cardCount <= 1) {
    return {
      paths: [scalePath(BIG_PATH, layoutScale)],
      sizes: [{ width: bigWidth, height: bigHeight }],
      xs: [(viewportWidth - bigWidth) / 2],
      layoutScale
    };
  }

  const scales = Array.from({ length: cardCount }, (_, i) =>
    Math.max(0, 1 - Math.abs(virtualIndex - i))
  );
  const widths = scales.map((s) => lerp(smallWidth, bigWidth, s));
  const heights = scales.map((s) => lerp(smallHeight, bigHeight, s));

  const lefts: number[] = [];
  let cursor = 0;
  widths.forEach((w) => {
    lefts.push(cursor);
    cursor += w + gap;
  });
  const centers = widths.map((w, i) => lefts[i] + w / 2);

  const lowerIndex = Math.max(0, Math.min(cardCount - 2, Math.floor(virtualIndex)));
  const frac = virtualIndex - lowerIndex;
  const focalCenter = lerp(centers[lowerIndex], centers[lowerIndex + 1], frac);
  const virtualScrollLeft = focalCenter - viewportWidth / 2;

  return {
    paths: scales.map((s) => scalePath(interpolatePath(SMALL_PATH, BIG_PATH, s), layoutScale)),
    sizes: widths.map((w, i) => ({ width: w, height: heights[i] })),
    xs: lefts.map((l) => l - virtualScrollLeft),
    layoutScale
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
  const [cardLayoutScale, setCardLayoutScale] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [nickname, setNickname] = useState(() => getStoredNickname() ?? '꿈꾸는 소녀');
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reportQuery = useQuery({
    queryKey: myReportQueryKey,
    queryFn: async () => {
      const response = await getMyReport();

      if (!response.success || !response.data) {
        throw new Error(response.message ?? '마이페이지 리포트를 불러오지 못했습니다.');
      }

      return response.data;
    },
    staleTime: 1000 * 60 * 5
  });
  const moodRatio = reportQuery.data?.moodRatio ?? [];
  const displayActivityRanking = reportQuery.data?.activityRanking ?? [];
  const activityCardCount = displayActivityRanking.length;
  const activityStatusLabel = reportQuery.isLoading
    ? '활동 리포트를 불러오는 중이에요'
    : reportQuery.isError
      ? '활동 리포트를 불러오지 못했어요'
      : activityCardCount === 0
        ? '아직 휴식 활동 기록이 없어요'
        : null;
  const latestMyFeedQuery = useQuery({
    queryKey: ['feeds', 'me', 'latest'],
    queryFn: async () => {
      const response = await getMyFeeds({ size: 1 });

      if (!response.success || !response.data) {
        throw new Error(response.message ?? '마지막 쉼표를 불러오지 못했습니다.');
      }

      return response.data.items[0] ?? null;
    },
    staleTime: 1000 * 60
  });
  const latestFeed = latestMyFeedQuery.data;
  const lastCommaLabel = latestMyFeedQuery.isLoading
    ? '마지막 쉼표 불러오는 중'
    : latestMyFeedQuery.isError
      ? '마지막 쉼표를 불러오지 못했어요'
      : latestFeed?.createdAt
        ? `마지막 쉼표 ${transformDate(latestFeed.createdAt)}`
        : '아직 쉼표 기록이 없어요';

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const viewportWidth = containerRef.current.getBoundingClientRect().width;
    const { paths, sizes, xs, layoutScale } = computeLayout(0, viewportWidth, activityCardCount);
    setPaths(paths);
    setSizes(sizes);
    setXs(xs);
    setCardLayoutScale(layoutScale);
  }, [activityCardCount]);

  useLayoutEffect(() => {
    if (!emblaApi || activityCardCount === 0) return;

    emblaApi.reInit();
  }, [emblaApi, activityCardCount]);

  useLayoutEffect(() => {
    if (!emblaApi || activityCardCount === 0) return;
    const updateCardTransforms = () => {
      const viewportWidth = emblaApi.rootNode().getBoundingClientRect().width;
      const scrollProgress = emblaApi.scrollProgress();
      const virtualIndex = scrollProgress * (activityCardCount - 1);
      const { paths, sizes, xs, layoutScale } = computeLayout(
        virtualIndex,
        viewportWidth,
        activityCardCount
      );
      setPaths(paths);
      setSizes(sizes);
      setXs(xs);
      setCardLayoutScale(layoutScale);
    };
    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap();
      setBgUrl(backgrounds[index % backgrounds.length]);
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
  }, [emblaApi, activityCardCount]);

  return (
    <div className={styles.container}>
      {bgUrl ? (
        <img
          alt=""
          aria-hidden="true"
          className={styles.backgroundImage}
          decoding="async"
          fetchPriority="high"
          loading="eager"
          src={bgUrl}
        />
      ) : null}
      <div aria-hidden="true" className={styles.backgroundBlur} />
      {showModal ? (
        <MyPageNicknameModal
          onCancelClick={() => setShowModal(false)}
          onSave={(nextNickname) => {
            setNickname(nextNickname);
            setStoredNickname(nextNickname);
            setShowModal(false);
          }}
        />
      ) : null}
      <div className={styles.foreground}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              width: '100%',
              height: 447,
              background: 'linear-gradient(#11111166 0%, rgba(17, 17, 17, 0) 100%)',
              zIndex: -2
            }}
          />
          <div
            style={{
              flex: 1,
              width: '100%',
              background: 'linear-gradient(to top, #11111166 0%, rgba(17, 17, 17, 0) 100%)',
              zIndex: -2
            }}
          />
        </div>
        <div />
        <div className={styles.header}>
          <span>마이페이지</span>
          <div className={styles.headerIconContainer}>
            <button
              style={{
                border: 'none',
                background: 'transparent',
                width: 44,
                height: 44,
                color: colors.iconSecondary
              }}
              onClick={() => navigate('/setting')}
              type="submit"
            >
              <Icon name="setting" />
            </button>
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
            <span className={styles.title}>{nickname}</span>
            <span className={styles.desc}>{lastCommaLabel}</span>
          </div>
          <SmallButton
            label="닉네임 수정"
            className={styles.nicknameEditBtn}
            onClick={() => setShowModal(true)}
          />
        </div>
        {activityStatusLabel ? (
          <div
            role={reportQuery.isError ? 'alert' : 'status'}
            style={{
              minHeight: SMALL_HEIGHT * cardLayoutScale,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '0 32px',
              textAlign: 'center'
            }}
          >
            <span className={styles.desc}>{activityStatusLabel}</span>
          </div>
        ) : (
          <div
            ref={(node) => {
              embiaRef(node);
              containerRef.current = node;
            }}
            style={{
              position: 'relative',
              overflow: 'hidden',
              height: BIG_HEIGHT * cardLayoutScale
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: GAP * cardLayoutScale
              }}
            >
              {displayActivityRanking.map((activity) => (
                <div
                  key={`spacer-${activity.rank}-${activity.relaxId}`}
                  style={{
                    flex: `0 0 ${SMALL_WIDTH * cardLayoutScale}px`,
                    height: BIG_HEIGHT * cardLayoutScale
                  }}
                />
              ))}
            </div>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {displayActivityRanking.map((activity, index) => (
                <MyPageCard
                  key={`${activity.rank}-${activity.relaxId}`}
                  backgroundUrl={backgrounds[index % backgrounds.length]}
                  num={activity.rank}
                  count={activity.count}
                  title={activity.name}
                  path={paths[index]}
                  width={sizes[index]?.width ?? SMALL_WIDTH * cardLayoutScale}
                  height={sizes[index]?.height ?? SMALL_HEIGHT * cardLayoutScale}
                  x={xs[index] ?? 0}
                />
              ))}
            </div>
          </div>
        )}
        <div
          style={{
            width: '100%',
            marginTop: 48,
            paddingBottom: 'calc(155px + var(--safe-area-bottom))',
            paddingLeft: 32,
            paddingRight: 32
          }}
        >
          {moodRatio.length > 0 ? (
            <>
              <div className={styles.questionContainer}>
                <span className={styles.questionNum}>Q1.</span>지금 기분이 어때요?
              </div>
              <div>
                {moodRatio.map((mood, index) => (
                  <MyPageAnswerContainer
                    key={mood.mood}
                    num={index + 1}
                    text={mood.label}
                    percent={mood.ratio}
                  />
                ))}
              </div>
            </>
          ) : !reportQuery.isLoading && !reportQuery.isError ? (
            <p className={styles.desc}>아직 기분 기록이 없어요.</p>
          ) : null}
        </div>
        <NavigationBar
          active="mypage"
          className={styles.navStyle}
          onItemSelect={(item) => navigateToNavigationItem(navigate, item, 'mypage')}
        />
      </div>
    </div>
  );
}

export default MyPage;
