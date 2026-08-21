import { Icon, SmallButton } from '@comma/design-system';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../../../shared/analytics/events';
import { TabShell } from '../../../shared/components/layout';
import { QueryFeedback } from '../../../shared/components/QueryFeedback';
import { BIG_HEIGHT, GAP, SMALL_HEIGHT, SMALL_WIDTH } from '../../../shared/lib/carousel.constants';
import { getStoredNickname, setStoredNickname } from '../../../shared/lib/tokenStorage';
import { transformDate } from '../../../shared/lib/transformDate';
import { latestMyFeedQueryOptions } from '../../feed/api/feed.queries';
import { myReportQueryOptions } from '../api/mypage.queries';
import { useActivityCarousel } from '../hooks/useActivityCarousel';
import { getActivityBackground } from '../lib/activityCarouselLayout';
import MyPageCard from './MyPageCard/MyPageCard';
import * as styles from './MyPageScreen.css';
import MyPageNicknameModal from './NicknameModal/MyPageNicknameModal';
import { MyPageReportSection } from './ReportSection/MyPageReportSection';

function MyPageScreen() {
  const [showModal, setShowModal] = useState(false);
  const [nickname, setNickname] = useState(() => getStoredNickname() ?? '꿈꾸는 소녀');
  const navigate = useNavigate();
  const reportQuery = useQuery(myReportQueryOptions);
  const moodRatio = reportQuery.data?.moodRatio ?? [];
  const timeBudgetRatio = reportQuery.data?.timeBudgetRatio ?? [];
  const showQuestionReportError = reportQuery.isError && !reportQuery.data;
  const activityRanking = reportQuery.data?.activityRanking ?? [];
  const activityCardCount = activityRanking.length;
  const { backgroundUrl, carouselRef, layout } = useActivityCarousel(activityCardCount);
  const latestMyFeedQuery = useQuery(latestMyFeedQueryOptions);
  const latestFeed = latestMyFeedQuery.data;
  const lastCommaLabel = latestMyFeedQuery.isLoading
    ? '마지막 쉼표 불러오는 중'
    : latestMyFeedQuery.isError
      ? '마지막 쉼표를 불러오지 못했어요'
      : latestFeed?.createdAt
        ? `마지막 쉼표 ${transformDate(latestFeed.createdAt)}`
        : null;
  const hasNoFeed = latestMyFeedQuery.isSuccess && latestFeed === null;
  const showEmptyReport = hasNoFeed && reportQuery.isSuccess;

  return (
    <TabShell active="mypage" className={styles.container} navigationClassName={styles.navStyle}>
      {backgroundUrl ? (
        <>
          <img
            alt=""
            aria-hidden="true"
            className={styles.backgroundImage}
            decoding="async"
            draggable={false}
            fetchPriority="high"
            loading="eager"
            src={backgroundUrl}
          />
          <div aria-hidden="true" className={styles.backgroundBlur} />
        </>
      ) : null}
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
        <div />
        <div className={styles.header}>
          <span>마이페이지</span>
          <div className={styles.headerIconContainer}>
            <button
              aria-label="설정 열기"
              className={styles.settingsButton}
              onClick={() => navigate('/setting')}
              type="button"
            >
              <Icon name="setting" />
            </button>
          </div>
        </div>
        <div className={styles.profileRow}>
          <div className={styles.profileText}>
            <span className={styles.title}>{nickname}</span>
            <span className={styles.desc}>{lastCommaLabel}</span>
          </div>
          <SmallButton
            label="닉네임 수정"
            className={styles.nicknameEditBtn}
            onClick={() => {
              trackEvent('nickname_edit_opened');
              setShowModal(true);
            }}
          />
        </div>
        {latestMyFeedQuery.isError ? (
          <QueryFeedback
            message="마지막 쉼표를 불러오지 못했어요."
            onRetry={() => void latestMyFeedQuery.refetch()}
            state="error"
          />
        ) : null}
        {showEmptyReport ? (
          <span className={styles.emptyReportOverlay}>
            쉼표가 쌓이면 나만의 쉼표 리포트가 생겨요.
          </span>
        ) : (
          <div className={styles.activitySection}>
            <div
              className={styles.carouselViewport}
              ref={carouselRef}
              style={{ height: BIG_HEIGHT * layout.layoutScale }}
            >
              <div className={styles.carouselTrack} style={{ gap: GAP * layout.layoutScale }}>
                {activityRanking.map((activity) => (
                  <div
                    key={`spacer-${activity.rank}-${activity.relaxId}`}
                    style={{
                      flex: `0 0 ${SMALL_WIDTH * layout.layoutScale}px`,
                      height: BIG_HEIGHT * layout.layoutScale
                    }}
                  />
                ))}
              </div>
              <div className={styles.cardsLayer}>
                {activityCardCount !== 0 && latestFeed?.createdAt ? (
                  activityRanking.map((activity, index) => (
                    <MyPageCard
                      backgroundUrl={getActivityBackground(index)}
                      count={activity.count}
                      height={layout.sizes[index]?.height ?? SMALL_HEIGHT * layout.layoutScale}
                      key={`${activity.rank}-${activity.relaxId}`}
                      num={activity.rank}
                      path={layout.paths[index]}
                      title={activity.name}
                      width={layout.sizes[index]?.width ?? SMALL_WIDTH * layout.layoutScale}
                      x={layout.xs[index] ?? 0}
                    />
                  ))
                ) : !latestFeed?.createdAt ? null : (
                  <span className={styles.alertText}>
                    쉼표가 쌓이면 나만의 쉼표 리포트가 생겨요.
                  </span>
                )}
              </div>
            </div>
            <MyPageReportSection
              hasNoFeed={hasNoFeed}
              isError={showQuestionReportError}
              isLoading={reportQuery.isPending}
              moodRatio={moodRatio}
              onRetry={() => void reportQuery.refetch()}
              timeBudgetRatio={timeBudgetRatio}
            />
          </div>
        )}
      </div>
    </TabShell>
  );
}

export default MyPageScreen;
