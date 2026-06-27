import { useEffect } from 'react';
import { login } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

function CallbackPage() {
    const navigate = useNavigate();

    useEffect(() => {
        login();
        navigate('/nickname');
    }, []);
    return (<div>Callback Page</div>);
}

export default CallbackPage;