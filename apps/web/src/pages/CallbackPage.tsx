import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { type fieldType, login } from '../utils/auth';

function CallbackPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const handleLogin = async () => {
      let field: fieldType;
      if (pathname === '/oauth/kakao/callback') field = 'KAKAO';
      else if (pathname === '/oauth/google/callback') field = 'GOOGLE';
      else field = 'APPLE';
      const res = await login(field);
      if(!res) alert("로그인 오류: 올바른 정보를 입력하세요.");
      else if (res.success) navigate('/nickname');
      else alert(res.message);
    };
    handleLogin();
  }, [navigate, pathname]);
  return <div>Callback Page</div>;
}

export default CallbackPage;
