import { Toast } from '@comma/design-system';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppScreen, BackgroundImage } from '../../../shared/components/layout';
import { useNativeSocialLogin } from '../hooks/useNativeSocialLogin';
import { createWebOAuthState } from '../lib/oauthState';
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from '../model/auth.constants';
import * as styles from './LoginScreen.css';

const REST_API_KEY = import.meta.env.VITE_REST_API_KEY;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
const APPLE_CLIENT_ID = import.meta.env.VITE_APPLE_CLIENT_ID;
const APPLE_REDIRECT_URI = import.meta.env.VITE_APPLE_REDIRECT_URI;

interface IAppleRes {
  authorization: {
    code: string;
    id_token: string;
  };
}

const LOGIN_TOAST_DURATION_MS = 4000;
const LOGIN_ERROR_MESSAGE = '로그인 에러입니다. 다시 시도해주세요.';

interface LoginToastState {
  id: number;
  message: string;
}

const getLoginState = (state: unknown) =>
  typeof state === 'object' &&
  state !== null &&
  'reason' in state &&
  typeof state.reason === 'string'
    ? {
        reason: state.reason,
        message: 'message' in state && typeof state.message === 'string' ? state.message : undefined
      }
    : undefined;

function LoginScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const nextToastIdRef = useRef(0);
  const [loginToast, setLoginToast] = useState<LoginToastState | null>(null);
  const isMobileWebView = typeof window !== 'undefined' && window.ReactNativeWebView !== undefined;
  const isAndroidApp = isMobileWebView && /Android/i.test(window.navigator.userAgent);

  const showLoginToast = useCallback((message: string) => {
    nextToastIdRef.current += 1;
    setLoginToast({ id: nextToastIdRef.current, message });
  }, []);
  const handleNativeLoginError = useCallback(() => {
    showLoginToast(LOGIN_ERROR_MESSAGE);
  }, [showLoginToast]);
  const { isPending: isNativeLoginPending, startLogin: startNativeLogin } = useNativeSocialLogin({
    enabled: isMobileWebView,
    onError: handleNativeLoginError
  });

  useEffect(() => {
    if (!loginToast) return;

    const timeoutId = window.setTimeout(() => {
      setLoginToast(null);
    }, LOGIN_TOAST_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [loginToast]);

  useEffect(() => {
    const loginState = getLoginState(location.state);
    if (!loginState) return;

    if (loginState.reason === 'SESSION_EXPIRED') {
      showLoginToast('로그인이 만료되었어요. 다시 로그인해 주세요.');
    } else if (loginState.reason === 'OAUTH_FAILED') {
      showLoginToast(LOGIN_ERROR_MESSAGE);
    } else {
      return;
    }
    navigate('.', { replace: true });
  }, [location.state, navigate, showLoginToast]);

  const onKakaoClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isMobileWebView) {
      await startNativeLogin('KAKAO');
      return;
    }

    const state = createWebOAuthState('KAKAO');
    window.location.href =
      `https://kauth.kakao.com/oauth/authorize` +
      `?response_type=code` +
      `&client_id=${REST_API_KEY}` +
      `&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}` +
      `&state=${encodeURIComponent(state)}`;
  };

  const onGoogleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isMobileWebView) {
      await startNativeLogin('GOOGLE');
      return;
    }

    const state = createWebOAuthState('GOOGLE');
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: 'code',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ].join(' '),
      state
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  const onAppleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isMobileWebView) {
      await startNativeLogin('APPLE');
      return;
    }

    window.AppleID?.auth.init({
      clientId: APPLE_CLIENT_ID,
      scope: 'email name',
      redirectURI: `${APPLE_REDIRECT_URI}`,
      usePopup: true
    });

    try {
      const res = (await window.AppleID?.auth.signIn()) as IAppleRes;
      navigate('/oauth/apple/callback', { state: { code: res.authorization.code } });
    } catch {
      showLoginToast(LOGIN_ERROR_MESSAGE);
    }
  };

  const onUrlClick = (url: string) => {
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({
        type: 'OPEN_EXTERNAL',
        url
      })
    );
  };

  return (
    <AppScreen className={styles.container}>
      <BackgroundImage
        className={styles.backgroundImage}
        src="/images/onboardingBackground_blur.png"
      />
      <div
        style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <img
          src="/images/logo_glass.svg"
          alt="배경 이미지"
          width={110}
          height={24}
          style={{ marginBottom: 68, marginTop: 20 }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <span className={styles.title}>고립감 없는</span>
          <span className={styles.title}>연결된 휴식</span>
          <p className={styles.desc}>
            불안한 멈춤에서 온전한 쉼으로,
            <br />
            당신의 쉬는 시간을 새롭게 정의합니다.
          </p>
        </div>
      </div>
      <div style={{ width: '100%', marginBottom: 80 }}>
        <button
          className={styles.kakaoBtn}
          type="button"
          onClick={onKakaoClick}
          disabled={isNativeLoginPending}
        >
          <img src="/images/kakao_logo.svg" alt="카카오 아이콘" width={18} height={18} />
          카카오톡으로 로그인
        </button>
        {!isAndroidApp && (
          <button
            className={styles.appleBtn}
            type="button"
            onClick={onAppleClick}
            disabled={isNativeLoginPending}
          >
            <img src="/images/apple_logo.svg" alt="애플 아이콘" width={16} height={19} />
            Apple로 로그인
          </button>
        )}
        <button
          className={styles.googleBtn}
          type="button"
          onClick={onGoogleClick}
          disabled={isNativeLoginPending}
        >
          <img src="/images/google_logo.svg" alt="구글 아이콘" width={20} height={20} />
          Google로 로그인
        </button>
        <p className={styles.agreementNotice}>
          계속 진행하면{' '}
          <a
            href={TERMS_OF_SERVICE}
            className={styles.agreementAccent}
            target="_blank"
            rel="noopener"
            onClick={(e) => {
              if (isMobileWebView) {
                e.preventDefault();

                onUrlClick(TERMS_OF_SERVICE);
              }
            }}
          >
            서비스 이용약관
          </a>{' '}
          및<br />
          <a
            href={PRIVACY_POLICY}
            className={styles.agreementAccent}
            rel="noopener"
            target="_blank"
            onClick={(e) => {
              if (isMobileWebView) {
                e.preventDefault();

                onUrlClick(PRIVACY_POLICY);
              }
            }}
          >
            개인정보처리방침
          </a>
          에 동의하는 것으로 간주합니다
        </p>
      </div>
      {loginToast ? (
        <div className={styles.toastLayer} data-overlay="true">
          <Toast
            className={styles.loginToast}
            message={loginToast.message}
            onClose={() => setLoginToast(null)}
            variant="login"
          />
        </div>
      ) : null}
    </AppScreen>
  );
}

export default LoginScreen;
