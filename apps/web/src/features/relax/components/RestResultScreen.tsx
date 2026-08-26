import { CtaButton, colors, Icon } from '@comma/design-system';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getAnalyticsFailureReason,
  toRelaxCode,
  trackEvent
} from '../../../shared/analytics/events';
import { useAppToast } from '../../../shared/components/AppToast';
import { AppScreen, BackgroundImage } from '../../../shared/components/layout';
import { useNativeBackHandler } from '../../../shared/components/NativeBack';
import { QueryFeedback } from '../../../shared/components/QueryFeedback';
import { BIG_HEIGHT, GAP, SMALL_WIDTH } from '../../../shared/lib/carousel.constants';
import { useRestResultCarousel } from '../hooks/useRestResultCarousel';
import { useStartRelax } from '../hooks/useStartRelax';
import { isValidRestResultLocationState } from '../lib/restResultState';
import type { RestResultLocationState } from '../model/relax.types';
import { RestResultCard } from './RestResultCard';
import { RestResultReselectModal } from './RestResultReselectModal';
import * as styles from './RestResultScreen.css';

function RestResultScreen() {
  const navigate = useNavigate();
  const { showToast } = useAppToast();
  const [showModal, setShowModal] = useState(false);
  const locationState = useLocation().state as RestResultLocationState | null;
  const validLocationState = isValidRestResultLocationState(locationState) ? locationState : null;
  const data = validLocationState?.data ?? [];
  const { carouselRef, layout, layoutScale, selectedIndex } = useRestResultCarousel(data.length);
  const startMutation = useStartRelax();
  const selectedRelax = data[selectedIndex];
  const carouselHeight = BIG_HEIGHT * layoutScale;
  const carouselSlideWidth = SMALL_WIDTH * layoutScale;
  const carouselGap = GAP * layoutScale;
  const isCompactHeight = layoutScale < 1;

  const openReselectModal = () => {
    if (!showModal) trackEvent('reselection_opened', { stage: 'recommendation' });
    setShowModal(true);
  };

  useNativeBackHandler(() => {
    if (startMutation.isPending) {
      showToast('휴식을 시작하고 있어요.');
      return true;
    }
    if (showModal) {
      trackEvent('reselection_cancelled', { stage: 'recommendation' });
      setShowModal(false);
      return true;
    }

    openReselectModal();
    return true;
  });

  useEffect(() => {
    if (validLocationState) return;

    trackEvent('rest_state_invalid', {
      failure_reason: 'invalid_state',
      stage: 'recommendation'
    });
    showToast('휴식 추천 중 오류가 발생했습니다. 다시 선택해주세요.');
    navigate('/rest/checklist', { replace: true });
  }, [validLocationState, navigate, showToast]);

  useEffect(() => {
    if (!selectedRelax) return;

    trackEvent('recommendation_viewed', {
      position: selectedIndex + 1,
      relax_code: toRelaxCode(selectedRelax.id)
    });
  }, [selectedIndex, selectedRelax]);

  const handleStartClick = async () => {
    if (startMutation.isPending) return;

    if (!validLocationState || !selectedRelax) {
      showToast('휴식 추천 중 오류가 발생했습니다. 다시 선택해주세요.');
      navigate('/rest/checklist', { replace: true });
      return;
    }

    try {
      const nextSelectedRelax = await startMutation.mutateAsync(selectedRelax);
      trackEvent('rest_started', { relax_code: toRelaxCode(selectedRelax.id) });
      navigate('/rest/activity', {
        state: {
          data,
          selectedRelax: nextSelectedRelax,
          mood: validLocationState.mood,
          timeBudget: validLocationState.timeBudget
        }
      });
    } catch (error) {
      trackEvent('rest_start_failed', {
        failure_reason: getAnalyticsFailureReason(error),
        relax_code: toRelaxCode(selectedRelax.id)
      });
      console.error('Failed to start relax.', error);
    }
  };

  if (!selectedRelax) return null;

  const backgroundSrc = selectedRelax.imageUrl || '/images/feed-image.svg';

  return (
    <AppScreen className={styles.container} data-clarity-unmask="true">
      <BackgroundImage className={styles.backgroundImage} src={backgroundSrc} />
      <div aria-hidden="true" className={styles.backgroundOverlay} />
      {showModal ? <RestResultReselectModal onClose={() => setShowModal(false)} /> : null}
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
        <Icon color={colors.iconPrimary} name="x" onClick={openReselectModal} />
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
          <span className={styles.title}>{selectedRelax.name}</span>
          <span className={styles.subTitle} style={{ marginBottom: isCompactHeight ? 32 : 64 }}>
            {selectedRelax.description}
          </span>
        </div>
        <div
          ref={carouselRef}
          style={{ position: 'relative', overflow: 'hidden', height: carouselHeight }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: carouselGap }}>
            {data.map((card) => (
              <div
                key={card.id}
                style={{ flex: `0 0 ${carouselSlideWidth}px`, height: carouselHeight }}
              />
            ))}
          </div>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {layout.isReady
              ? data.map((card, index) => (
                  <RestResultCard
                    height={layout.sizes[index].height}
                    imageSrc={card.imageUrl || '/images/feed-image.svg'}
                    key={card.id}
                    path={layout.paths[index]}
                    width={layout.sizes[index].width}
                    x={layout.xs[index]}
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
          {data.map((card, index) => (
            <div
              className={styles.dot}
              key={card.id}
              style={{
                backgroundColor:
                  selectedIndex === index ? colors.iconPrimary : 'rgba(252, 252, 252, 0.15)'
              }}
            />
          ))}
        </div>
      </div>
      <footer className={styles.footer}>
        {startMutation.isError ? (
          <QueryFeedback message={startMutation.error.message} state="error" />
        ) : null}
        <CtaButton
          className={styles.ctaButtonStyle}
          disabled={startMutation.isPending}
          onClick={handleStartClick}
        >
          {startMutation.isPending ? '시작하는 중' : '시작하기'}
        </CtaButton>
      </footer>
    </AppScreen>
  );
}

export default RestResultScreen;
