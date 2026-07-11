import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { type fieldType, login } from '../utils/auth';
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
      const field = getFieldByPathname(pathname);
      if (!field) {
        alert('올바른 callback path를 명시해주세요.');
        return;
      }

      const queryCode = new URLSearchParams(location.search).get('code');
      const code = field === 'APPLE' ? (appleCode ?? queryCode) : queryCode;
      if (!code) {
        alert(
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

        if (res.success) navigate('/nickname', { replace: true });
        else alert(res.message);
      } catch (err) {
        console.log(err);
        alert(err instanceof Error ? err.message : '로그인 오류: 올바른 정보를 입력하세요.');
      }
    };
    handleLogin();
  }, [navigate, pathname, appleCode, location.search, loginMutateAsync]);
  return <div className={styles.container} />;
}

export default CallbackPage;
