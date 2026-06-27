import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Nickname from '../pages/Nickname';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Login
  },
  {
    path: '/nickname',
    Component: Nickname,
  }
]);
