import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { type fieldType, login, type TokenResponse } from '../apis/auth';
import { consumeWebOAuthState } from '../utils/oauthState';
import { setOnboardingCompleted, setStoredNickname, setTokens } from '../utils/tokenStorage';
import * as styles from './CallbackPage.css';

const getFieldByPathname = (pathname: string): fieldType | null => {
  if (pathname === '/oauth/kakao/callback') return 'KAKAO';
  if (pathname === '/oauth/google/callback') return 'GOOGLE';
  if (pathname === '/oauth/apple/callback') return 'APPLE';

  return null;
};

const getRedirectUri = (field: fieldType) => {
  if (field === 'KAKAO') return import.meta.env.VITE_KAKAO_REDIRECT_URI;
  if (field === 'GOOGLE') return import.meta.env.VITE_GOOGLE_REDIRECT_URI;

  return import.meta.env.VITE_APPLE_REDIRECT_URI;
};

const getPostLoginPath = (data: TokenResponse) =>
  data.onboardingCompleted ? '/loading' : '/nickname';

function CallbackPage() {
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
      const returnToLogin = (message: string) => {
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

      const searchParams = new URLSearchParams(location.search);
      if (
        (field === 'KAKAO' || field === 'GOOGLE') &&
        !consumeWebOAuthState(field, searchParams.get('state'))
      ) {
        returnToLogin('로그인 요청을 확인할 수 없습니다. 다시 시도해 주세요.');
        return;
      }

      if (searchParams.get('error')) {
        returnToLogin('로그인이 취소되었거나 인증 제공자에서 거부되었습니다.');
        return;
      }

      const queryCode = searchParams.get('code');
      const code = field === 'APPLE' ? (appleCode ?? queryCode) : queryCode;
      if (!code) {
        returnToLogin(
          field === 'APPLE' ? 'APPLE 코드가 없습니다.' : '로그인 오류: 올바른 정보를 입력하세요.'
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
          setTokens({
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken
          });
          setOnboardingCompleted(res.data.onboardingCompleted);
          setStoredNickname(res.data.nickname);
          navigate(getPostLoginPath(res.data), { replace: true });
        } else returnToLogin(res.message ?? '로그인을 완료하지 못했습니다. 다시 시도해 주세요.');
      } catch (err) {
        returnToLogin(
          err instanceof Error ? err.message : '로그인 오류: 올바른 정보를 입력하세요.'
        );
      }
    };
    handleLogin();
  }, [navigate, pathname, appleCode, location.search, loginMutateAsync]);
  return (
    <div className={styles.container}>
      <img
        alt=""
        aria-hidden="true"
        className={styles.backgroundImage}
        decoding="async"
        fetchPriority="high"
        loading="eager"
        src="/images/onboardingBackground_blur.png"
      />
    </div>
  );
}

export default CallbackPage;
