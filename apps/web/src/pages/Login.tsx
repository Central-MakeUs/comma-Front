import { Toast } from '@comma/design-system';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { type LoginData, login } from '../apis/auth';
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from '../data/service_url';
import {
  clearNativeGoogleOAuthState,
  consumeNativeGoogleOAuthState,
  createNativeGoogleOAuthState,
  createWebOAuthState,
  hasPendingNativeGoogleOAuthState
} from '../utils/oauthState';
import { setOnboardingCompleted, setStoredNickname } from '../utils/tokenStorage';
import * as styles from './Login.css';

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

interface IGoogleWait {
  code: string;
  redirectUri: string;
}

const GOOGLE_LOGIN_TIMEOUT_MS = 60000;
const GOOGLE_LOGIN_RECOVERY_TIMEOUT_MS = 10000;
const LOGIN_TOAST_DURATION_MS = 4000;

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

const getPostLoginPath = (data: LoginData) => (data.onboardingCompleted ? '/loading' : '/nickname');

const waitForGoogleLogin = ({
  signal,
  timeoutMs = GOOGLE_LOGIN_TIMEOUT_MS
}: {
  signal?: AbortSignal;
  timeoutMs?: number;
} = {}): Promise<IGoogleWait> => {
  return new Promise((resolve, reject) => {
    let isSettled = false;

    function removeMessageListeners() {
      window.removeEventListener('message', handler);
      document.removeEventListener('message', handler as EventListener);
      signal?.removeEventListener('abort', onAbort);
    }

    function finish(callback: () => void) {
      if (isSettled) return;
      isSettled = true;
      window.clearTimeout(timeoutId);
      removeMessageListeners();
      callback();
    }

    const timeoutId = window.setTimeout(() => {
      finish(() => {
        clearNativeGoogleOAuthState();
        reject(new Error('구글 로그인 응답 시간이 초과되었습니다.'));
      });
    }, timeoutMs);

    function onAbort() {
      finish(() => reject(new DOMException('Google login was cancelled.', 'AbortError')));
    }

    function handler(event: MessageEvent) {
      let message: {
        type?: string;
        code?: string;
        redirectUri?: string;
        state?: string;
        error?: string;
      };
      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }

      if (message.type === 'GOOGLE_LOGIN_SUCCESS') {
        if (!consumeNativeGoogleOAuthState(message.state)) return;
        finish(() => resolve({ code: message.code ?? '', redirectUri: message.redirectUri ?? '' }));
      } else if (message.type === 'GOOGLE_LOGIN_FAILED') {
        if (!consumeNativeGoogleOAuthState(message.state)) return;
        finish(() => reject(new Error(message.error ?? '구글 로그인 중 에러가 발생했습니다.')));
      }
    }

    window.addEventListener('message', handler);
    document.addEventListener('message', handler as EventListener);
    if (signal?.aborted) onAbort();
    else signal?.addEventListener('abort', onAbort, { once: true });
  });
};

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasStartedNativeGoogleRecovery = useRef(false);
  const googleLoginAbortControllerRef = useRef<AbortController | null>(null);
  const isGoogleOAuthPendingRef = useRef(false);
  const nextToastIdRef = useRef(0);
  const [isGoogleOAuthPending, setIsGoogleOAuthPending] = useState(false);
  const [loginToast, setLoginToast] = useState<LoginToastState | null>(null);
  const isMobileWebView = typeof window !== 'undefined' && window.ReactNativeWebView !== undefined;
  const isAndroidApp = isMobileWebView && /Android/i.test(window.navigator.userAgent);
  const { isPending: isGoogleLoginPending, mutateAsync: googleLoginMutateAsync } = useMutation({
    mutationFn: login
  });

  const showLoginToast = useCallback((message: string) => {
    nextToastIdRef.current += 1;
    setLoginToast({ id: nextToastIdRef.current, message });
  }, []);

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
      showLoginToast(loginState.message ?? '로그인을 완료하지 못했습니다. 다시 시도해 주세요.');
    } else {
      return;
    }
    navigate('.', { replace: true });
  }, [location.state, navigate, showLoginToast]);

  useEffect(
    () => () => {
      googleLoginAbortControllerRef.current?.abort();
      googleLoginAbortControllerRef.current = null;
    },
    []
  );

  const onKakaoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
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
      if (isGoogleOAuthPendingRef.current || isGoogleLoginPending) return;

      isGoogleOAuthPendingRef.current = true;
      setIsGoogleOAuthPending(true);

      const state = createNativeGoogleOAuthState();
      const controller = new AbortController();
      googleLoginAbortControllerRef.current = controller;
      const googleLoginResponse = waitForGoogleLogin({ signal: controller.signal });
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({
          type: 'GOOGLE_LOGIN',
          state
        })
      );
      try {
        const { code, redirectUri } = await googleLoginResponse;
        const res = await googleLoginMutateAsync({
          field: 'GOOGLE',
          code,
          redirectUri
        });
        if (controller.signal.aborted) return;

        if (res.success && res.data) {
          setOnboardingCompleted(res.data.onboardingCompleted);
          setStoredNickname(res.data.nickname);
          navigate(getPostLoginPath(res.data), { replace: true });
        } else {
          showLoginToast(res.message ?? '구글 로그인을 완료하지 못했습니다. 다시 시도해 주세요.');
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        clearNativeGoogleOAuthState();
        showLoginToast(
          err instanceof Error
            ? err.message
            : '구글 로그인을 완료하지 못했습니다. 다시 시도해 주세요.'
        );
      } finally {
        if (googleLoginAbortControllerRef.current === controller) {
          googleLoginAbortControllerRef.current = null;
        }
        if (!controller.signal.aborted) {
          isGoogleOAuthPendingRef.current = false;
          setIsGoogleOAuthPending(false);
        }
      }
      return;
    } else {
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
    }
  };

  useEffect(() => {
    if (
      !isMobileWebView ||
      hasStartedNativeGoogleRecovery.current ||
      !hasPendingNativeGoogleOAuthState()
    ) {
      return;
    }

    hasStartedNativeGoogleRecovery.current = true;
    isGoogleOAuthPendingRef.current = true;
    setIsGoogleOAuthPending(true);
    const controller = new AbortController();
    void (async () => {
      try {
        const googleLoginResponse = waitForGoogleLogin({
          signal: controller.signal,
          timeoutMs: GOOGLE_LOGIN_RECOVERY_TIMEOUT_MS
        });
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({ type: 'GOOGLE_LOGIN_RECOVERY_READY' })
        );
        const { code, redirectUri } = await googleLoginResponse;
        const res = await googleLoginMutateAsync({
          field: 'GOOGLE',
          code,
          redirectUri
        });

        if (!res.success || !res.data) {
          throw new Error(res.message ?? '구글 로그인 중 에러가 발생했습니다.');
        }

        setOnboardingCompleted(res.data.onboardingCompleted);
        setStoredNickname(res.data.nickname);
        navigate(getPostLoginPath(res.data), { replace: true });
      } catch (err) {
        if (controller.signal.aborted) return;
        clearNativeGoogleOAuthState();
        showLoginToast(
          err instanceof Error
            ? err.message
            : '구글 로그인을 완료하지 못했습니다. 다시 시도해 주세요.'
        );
      } finally {
        if (!controller.signal.aborted) {
          isGoogleOAuthPendingRef.current = false;
          setIsGoogleOAuthPending(false);
        }
      }
    })();

    return () => controller.abort();
  }, [googleLoginMutateAsync, isMobileWebView, navigate, showLoginToast]);

  const onAppleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
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
      showLoginToast('Apple 로그인을 완료하지 못했습니다. 다시 시도해 주세요.');
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
        <button className={styles.kakaoBtn} type="button" onClick={onKakaoClick}>
          <img src="/images/kakao_logo.svg" alt="카카오 아이콘" width={18} height={18} />
          카카오톡으로 로그인
        </button>
        {!isAndroidApp && (
          <button className={styles.appleBtn} type="button" onClick={onAppleClick}>
            <img src="/images/apple_logo.svg" alt="애플 아이콘" width={16} height={19} />
            Apple로 로그인
          </button>
        )}
        <button
          className={styles.googleBtn}
          type="button"
          onClick={onGoogleClick}
          disabled={isGoogleOAuthPending || isGoogleLoginPending}
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
    </div>
  );
}

export default Login;
