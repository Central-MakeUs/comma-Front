import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { trackEvent } from '../../../shared/analytics/events';
import { useAppToast } from '../../../shared/components/AppToast';
import { AppScreen, BackgroundImage } from '../../../shared/components/layout';
import { useNativeBackHandler } from '../../../shared/components/NativeBack';
import { QueryFeedback } from '../../../shared/components/QueryFeedback';
import { onlineCountQueryOptions } from '../api/relax.queries';
import type { RestLoadingLocationState } from '../model/relax.types';
import * as styles from './RestLoadingScreen.css';

function RestLoadingScreen() {
  const navigate = useNavigate();
  const { showToast } = useAppToast();
  const location = useLocation();
  const locationState = location.state as RestLoadingLocationState | null;
  const recommendations = locationState?.data ?? [];
  const countQuery = useQuery({
    ...onlineCountQueryOptions,
    enabled: recommendations.length > 0
  });

  useNativeBackHandler(() => {
    navigate(-1);
    return true;
  });

  useEffect(() => {
    if (recommendations.length === 0) {
      trackEvent('rest_state_invalid', {
        failure_reason: 'invalid_state',
        stage: 'loading'
      });
      showToast('휴식 추천 중 오류가 발생했습니다. 다시 선택해주세요.');
      navigate('/rest/checklist', { replace: true });
      return;
    }

    const timeoutId = window.setTimeout(() => {
      navigate('/rest/result', {
        state: {
          data: recommendations,
          mood: locationState?.mood,
          timeBudget: locationState?.timeBudget
        }
      });
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [locationState?.mood, locationState?.timeBudget, navigate, recommendations, showToast]);

  return (
    <AppScreen className={styles.container} data-clarity-unmask="true" role="status">
      <BackgroundImage className={styles.backgroundImage} src="/images/Home.png" />
      <div className={styles.content}>
        <span className={styles.title}>휴식을 찾고 있어요...</span>
        <div className={styles.participantRow}>
          <span aria-live="polite" className={styles.num}>
            {countQuery.data ?? 0}
          </span>
          <span className={styles.desc}>명이 함께하는 중</span>
        </div>
        {countQuery.isError ? (
          <QueryFeedback
            message="함께 쉬는 인원을 불러오지 못했어요."
            onRetry={() => void countQuery.refetch()}
            state="error"
          />
        ) : null}
      </div>
    </AppScreen>
  );
}

export default RestLoadingScreen;
