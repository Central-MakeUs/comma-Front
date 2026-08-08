import { createBrowserRouter } from 'react-router-dom';
import { lazyPage } from './lazyPage';

export const router = createBrowserRouter([
  {
    path: '/',
    lazy: lazyPage(() => import('../../pages/Login'))
  },
  {
    path: '/nickname',
    lazy: lazyPage(() => import('../../pages/Nickname'))
  },
  {
    path: '/loading',
    lazy: lazyPage(() => import('../../pages/Loading'))
  },
  {
    path: '/oauth/kakao/callback',
    lazy: lazyPage(() => import('../../pages/CallbackPage'))
  },
  {
    path: '/oauth/google/callback',
    lazy: lazyPage(() => import('../../pages/CallbackPage'))
  },
  {
    path: '/oauth/apple/callback',
    lazy: lazyPage(() => import('../../pages/CallbackPage'))
  },
  {
    path: '/rest/result',
    lazy: lazyPage(() => import('../../pages/RestResult'))
  },
  {
    path: '/rest/checklist',
    lazy: lazyPage(() => import('../../pages/RestChecklist'))
  },
  {
    path: '/rest/activity',
    lazy: lazyPage(() => import('../../pages/RestActivity'))
  },
  {
    path: '/archive',
    lazy: lazyPage(() => import('../../pages/Archive'))
  },
  {
    path: '/rest/loading',
    lazy: lazyPage(() => import('../../pages/RestLoading'))
  },
  {
    path: '/feed',
    lazy: lazyPage(() => import('../../pages/Feed'))
  },
  {
    path: '/setting',
    lazy: lazyPage(() => import('../../pages/Setting'))
  },
  {
    path: '/mypage',
    lazy: lazyPage(() => import('../../pages/MyPage'))
  }
]);
