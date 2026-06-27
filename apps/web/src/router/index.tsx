import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Nickname from '../pages/Nickname';
import Loading from '../pages/Loading';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Login
  },
  {
    path: '/nickname',
    Component: Nickname,
  },
  {
    path: '/loading',
    Component: Loading,
  }
]);
