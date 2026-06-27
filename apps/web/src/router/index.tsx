import { createBrowserRouter } from 'react-router-dom';
import Loading from '../pages/Loading';
import Login from '../pages/Login';
import Nickname from '../pages/Nickname';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Login
  },
  {
    path: '/nickname',
    Component: Nickname
  },
  {
    path: '/loading',
    Component: Loading
  }
]);
