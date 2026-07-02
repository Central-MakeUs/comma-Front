import { createBrowserRouter } from 'react-router-dom';
import CallbackPage from '../pages/CallbackPage';
import Loading from '../pages/Loading';
import Login from '../pages/Login';
import Nickname from '../pages/Nickname';
import RestLoading from '../pages/RestLoading';
import RestResult from '../pages/RestResult';

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
  },
  {
    path: '/oauth/kakao/callback',
    Component: CallbackPage
  },
  {
    path: '/oauth/google/callback',
    Component: CallbackPage
  },
  {
    path: '/recommend-result',
    Component: RestResult
  },
  {
    path: '/recommend-loading',
    Component: RestLoading
  }
]);
