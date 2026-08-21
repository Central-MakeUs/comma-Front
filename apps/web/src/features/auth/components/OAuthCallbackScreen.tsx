import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { trackEvent } from '../../../shared/analytics/events';
import { AppScreen, BackgroundImage } from '../../../shared/components/layout';
import { QueryFeedback } from '../../../shared/components/QueryFeedback';
import { type AuthProvider, login } from '../api/auth.api';
import { getPostLoginPath } from '../lib/authNavigation';
import { consumeWebOAuthState } from '../lib/oauthState';
import * as styles from './OAuthCallbackScreen.css';

const getFieldByPathname = (pathname: string): AuthProvider | null => {
  if (pathname === '/oauth/kakao/callback') return 'KAKAO';
  if (pathname === '/oauth/google/callback') return 'GOOGLE';
  if (pathname === '/oauth/apple/callback') return 'APPLE';

  return null;
};

const getRedirectUri = (field: AuthProvider) => {
  const fallback = `${typeof window !== 'undefined' ? window.location.origin : ''}/oauth/${field.toLowerCase()}/callback`;
  if (field === 'KAKAO') return import.meta.env.VITE_KAKAO_REDIRECT_URI || fallback;
  if (field === 'GOOGLE') return import.meta.env.VITE_GOOGLE_REDIRECT_URI || fallback;

  return import.meta.env.VITE_APPLE_REDIRECT_URI || fallback;
};

function OAuthCallbackScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const appleCode = location.state?.code;
  const hasRun = useRef(false);
  const { mutateAsync: loginMutateAsync } = useMutation({
    mutationFn: login
  });

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleLogin = async () => {
      const returnToLogin = (
        message: string,
        eventName: 'login_cancelled' | 'login_failed' = 'login_failed',
        method = 'unknown'
      ) => {
        trackEvent(eventName, { method, surface: 'web' });
        navigate('/', {
          replace: true,
          state: { reason: 'OAUTH_FAILED', message }
        });
      };
      const field = getFieldByPathname(pathname);
      if (!field) {
        returnToLogin('올바르지 않은 로그인 응답입니다. 다시 시도해 주세요.');
        return;
      }
      const method = field.toLowerCase();

      const searchParams = new URLSearchParams(location.search);
      const isStateValid =
        field === 'APPLE' || consumeWebOAuthState(field, searchParams.get('state'));

      if (searchParams.get('error')) {
        returnToLogin(
          '로그인이 취소되었거나 인증 제공자에서 거부되었습니다.',
          'login_cancelled',
          method
        );
        return;
      }

      if (!isStateValid) {
        returnToLogin(
          '로그인 요청을 확인할 수 없습니다. 다시 시도해 주세요.',
          'login_failed',
          method
        );
        return;
      }

      const queryCode = searchParams.get('code');
      const code = field === 'APPLE' ? (appleCode ?? queryCode) : queryCode;
      if (!code) {
        returnToLogin(
          field === 'APPLE' ? 'APPLE 코드가 없습니다.' : '로그인 오류: 올바른 정보를 입력하세요.',
          'login_failed',
          method
        );
        return;
      }

      try {
        const res = await loginMutateAsync({
          field,
          code,
          redirectUri: getRedirectUri(field)
        });

        if (res.success && res.data) {
          trackEvent(res.data.onboardingCompleted ? 'login' : 'sign_up', {
            method,
            surface: 'web'
          });
          navigate(getPostLoginPath(res.data), { replace: true });
        } else {
          returnToLogin(
            res.message ?? '로그인을 완료하지 못했습니다. 다시 시도해 주세요.',
            'login_failed',
            method
          );
        }
      } catch (err) {
        returnToLogin(
          err instanceof Error ? err.message : '로그인 오류: 올바른 정보를 입력하세요.',
          'login_failed',
          method
        );
      }
    };
    handleLogin();
  }, [navigate, pathname, appleCode, location.search, loginMutateAsync]);
  return (
    <AppScreen className={styles.container}>
      <BackgroundImage
        className={styles.backgroundImage}
        src="/images/onboardingBackground_blur.png"
      />
      <QueryFeedback message="로그인을 완료하고 있어요..." state="loading" />
    </AppScreen>
  );
}

export default OAuthCallbackScreen;
