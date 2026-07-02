import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, fieldType } from '../utils/auth';

function CallbackPage() {
  const navigate = useNavigate();
  const {pathname} = useLocation();

  useEffect(() => {
    const handleLogin = async () => {
      let field:fieldType;
      if(pathname === "/oauth/kakao/callback") field = 'KAKAO';
      else if(pathname === '/oauth/google/callback') field = 'GOOGLE';
      else field = 'APPLE';
      const res = await login(field);
      if (res.success) navigate('/nickname');
      else alert(res.message);
    };
    handleLogin();
  }, [navigate]);
  return <div>Callback Page</div>;
}

export default CallbackPage;
