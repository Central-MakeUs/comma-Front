import * as styles from './Login.css';

const REST_API_KEY = import.meta.env.VITE_REST_API_KEY;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

function Login() {
  const onKakaoClick = () => {
    window.location.href =
      `https://kauth.kakao.com/oauth/authorize` +
      `?response_type=code` +
      `&client_id=${REST_API_KEY}` +
      `&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}`;
  };

  const onGoogleClick = () => {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: "token",
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ].join(" "),
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  return (
    <div className={styles.container}>
      <div
        style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <img
          src="/images/logo_glass.svg"
          alt="배경 이미지"
          width={110}
          height={24}
          style={{ marginBottom: 68, marginTop: 68 }}
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
        <button className={styles.appleBtn} type="button">
          <img src="/images/apple_logo.svg" alt="애플 아이콘" width={16} height={19} />
          Apple로 로그인
        </button>
        <button className={styles.googleBtn} type="button" onClick={onGoogleClick}>
          <img src="/images/google_logo.svg" alt="구글 아이콘" width={20} height={20} />
          Google로 로그인
        </button>
        <p className={styles.agreementNotice}>
          계속 진행하면 <span className={styles.agreementAccent}>서비스 이용약관</span> 및<br />
          <span className={styles.agreementAccent}>개인정보처리방침</span>에 동의하는 것으로
          간주합니다
        </p>
      </div>
    </div>
  );
}

export default Login;
