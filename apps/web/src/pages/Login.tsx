import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { login, type TokenResponse } from '../apis/auth';
import { setOnboardingCompleted, setStoredNickname, setTokens } from '../utils/tokenStorage';
import * as styles from './Login.css';
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from '../data/service_url';

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

const getSessionReason = (state: unknown) =>
  typeof state === 'object' &&
  state !== null &&
  'reason' in state &&
  typeof state.reason === 'string'
    ? state.reason
    : undefined;

const getPostLoginPath = (data: TokenResponse) =>
  data.onboardingCompleted ? '/loading' : '/nickname';

const waitForGoogleLogin = (): Promise<IGoogleWait> => {
  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      window.removeEventListener('message', handler);
      reject(new Error('구글 로그인 응답 시간이 초과되었습니다.'));
    }, GOOGLE_LOGIN_TIMEOUT_MS);

    const handler = (event: MessageEvent) => {
      let message: { type?: string; code?: string; redirectUri?: string; error?: string };
      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }

      if (message.type === 'GOOGLE_LOGIN_SUCCESS') {
        window.clearTimeout(timeoutId);
        window.removeEventListener('message', handler);
        resolve({ code: message.code ?? '', redirectUri: message.redirectUri ?? '' });
      } else if (message.type === 'GOOGLE_LOGIN_FAILED') {
        window.clearTimeout(timeoutId);
        window.removeEventListener('message', handler);
        reject(new Error(message.error ?? '구글 로그인 중 에러가 발생했습니다.'));
      }
    };

    window.addEventListener('message', handler);
  });
};

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const googleLoginMutation = useMutation({
    mutationFn: login
  });

  useEffect(() => {
    if (getSessionReason(location.state) !== 'SESSION_EXPIRED') return;

    alert('로그인이 만료되었어요. 다시 로그인해 주세요.');
    navigate('.', { replace: true });
  }, [location.state, navigate]);

  const onKakaoClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.location.href =
      `https://kauth.kakao.com/oauth/authorize` +
      `?response_type=code` +
      `&client_id=${REST_API_KEY}` +
      `&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}`;
  };

  const onGoogleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const isMobileWebView =
      typeof window !== 'undefined' && window.ReactNativeWebView !== undefined;
    if (isMobileWebView) {
      if (googleLoginMutation.isPending) return;

      window.ReactNativeWebView?.postMessage(
        JSON.stringify({
          type: 'GOOGLE_LOGIN'
        })
      );
      try {
        const { code, redirectUri } = await waitForGoogleLogin();
        const res = await googleLoginMutation.mutateAsync({
          field: 'GOOGLE',
          code,
          redirectUri
        });
        if (res.success && res.data) {
          setTokens({
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken
          });
          setOnboardingCompleted(res.data.onboardingCompleted);
          setStoredNickname(res.data.nickname);
          navigate(getPostLoginPath(res.data), { replace: true });
        } else alert('구글 로그인 중 에러 발생');
      } catch (err) {
        console.log(err);
        alert(err instanceof Error ? err.message : '구글 로그인 중 에러 발생');
      }
      return;
    } else {
      const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: GOOGLE_REDIRECT_URI,
        response_type: 'code',
        scope: [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile'
        ].join(' ')
      });
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }
  };

  const onAppleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(APPLE_CLIENT_ID);
    window.AppleID?.auth.init({
      clientId: APPLE_CLIENT_ID,
      scope: 'email name',
      redirectURI: `${APPLE_REDIRECT_URI}`,
      usePopup: true
    });

    try {
      const res = (await window.AppleID?.auth.signIn()) as IAppleRes;
      console.log(res);
      navigate('/oauth/apple/callback', { state: { code: res.authorization.code } });
    } catch (err) {
      console.log(err);
      alert('애플 로그인 중 에러 발생');
    }
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
        <button className={styles.appleBtn} type="button" onClick={onAppleClick}>
          <img src="/images/apple_logo.svg" alt="애플 아이콘" width={16} height={19} />
          Apple로 로그인
        </button>
        <button
          className={styles.googleBtn}
          type="button"
          onClick={onGoogleClick}
          disabled={googleLoginMutation.isPending}
        >
          <img src="/images/google_logo.svg" alt="구글 아이콘" width={20} height={20} />
          Google로 로그인
        </button>
        <p className={styles.agreementNotice}>
          계속 진행하면 <Link to={TERMS_OF_SERVICE} className={styles.agreementAccent}>서비스 이용약관</Link> 및<br />
          <Link to={PRIVACY_POLICY} className={styles.agreementAccent}>개인정보처리방침</Link>에 동의하는 것으로
          간주합니다
        </p>
      </div>
    </div>
  );
}

export default Login;
