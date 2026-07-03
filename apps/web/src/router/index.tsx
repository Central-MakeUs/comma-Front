import { createBrowserRouter } from 'react-router-dom';
import Archive from '../pages/Archive';
import CallbackPage from '../pages/CallbackPage';
import Feed from '../pages/Feed';
import Loading from '../pages/Loading';
import Login from '../pages/Login';
import Nickname from '../pages/Nickname';
import RestActivity from '../pages/RestActivity';
import RestChecklist from '../pages/RestChecklist';
import RestLoading from '../pages/RestLoading';
import RestResult from '../pages/RestResult';
import Setting from '../pages/Setting';

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
    path: '/oauth/apple/callback',
    Component: CallbackPage
  },
  {
    path: '/rest/result',
    Component: RestResult
  },
  {
    path: '/rest/checklist',
    Component: RestChecklist
  },
  {
    path: '/rest/activity',
    Component: RestActivity
  },
  {
    path: '/archive',
    Component: Archive
  },
  {
    path: '/rest/loading',
    Component: RestLoading
  },
  {
    path: '/feed',
    Component: Feed
  },
  {
    path: '/setting',
    Component: Setting,
  }
]);
