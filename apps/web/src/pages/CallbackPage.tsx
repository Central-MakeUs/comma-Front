import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { type fieldType, login } from '../utils/auth';

function CallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const appleCode = location.state?.code;
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleLogin = async () => {
      let field: fieldType;
      if (pathname === '/oauth/kakao/callback') field = 'KAKAO';
      else if (pathname === '/oauth/google/callback') field = 'GOOGLE';
      else if (pathname === '/oauth/apple/callback') field = 'APPLE';
      else {
        alert('올바른 callback path를 명시해주세요.');
        return;
      }
      let res: Awaited<ReturnType<typeof login>>;
      if (field !== 'APPLE') res = await login(field);
      else {
        if (!appleCode) {
          alert('APPLE 코드가 없습니다.');
          return;
        }
        res = await login(field, appleCode);
      }
      if (!res) {
        alert('로그인 오류: 올바른 정보를 입력하세요.');
      } else if (res.success) navigate('/nickname', {replace: true});
      else {
        alert(res.message);
      }
    };
    handleLogin();
  }, [navigate, pathname, appleCode]);
  return null;
}

export default CallbackPage;
