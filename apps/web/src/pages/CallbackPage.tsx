import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/auth';

function CallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogin = async () => {
      await login();
      navigate('/nickname');
    };
    handleLogin();
  }, [navigate]);
  return <div>Callback Page</div>;
}

export default CallbackPage;
