import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { refreshStoredTokens, SESSION_EXPIRED_EVENT } from '../apis/client';
import { router } from '../router';
import {
  clearTokens,
  getAuthState,
  getOnboardingCompleted,
  initializeAuthStorage,
  isAccessTokenExpiryValid
} from '../utils/tokenStorage';

interface AuthBootstrapProps {
  children: ReactNode;
}

const redirectToLoginForExpiredSession = () => {
  if (window.location.pathname === '/') return;

  router.navigate('/', {
    replace: true,
    state: {
      reason: 'SESSION_EXPIRED'
    }
  });
};

const publicPaths = new Set([
  '/',
  '/nickname',
  '/oauth/kakao/callback',
  '/oauth/google/callback',
  '/oauth/apple/callback'
]);

const isPublicPath = (pathname: string) => publicPaths.has(pathname);

const redirectToLoginForMissingSession = () => {
  if (isPublicPath(window.location.pathname)) return;

  router.navigate('/', { replace: true });
};

const redirectRootAfterAuth = () => {
  if (window.location.pathname !== '/') return;

  router.navigate(getOnboardingCompleted() === false ? '/nickname' : '/loading', { replace: true });
};

const refreshOnboardingStateForRoot = async () => {
  if (window.location.pathname !== '/' || getOnboardingCompleted() !== null) return;

  await refreshStoredTokens();
};

function AuthBootstrap({ children }: AuthBootstrapProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handleSessionExpired = () => {
      redirectToLoginForExpiredSession();
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, []);

  useEffect(() => {
    const bootstrapAuth = async () => {
      await initializeAuthStorage();
      const authState = await getAuthState();

      if (!authState.hasTokens) {
        redirectToLoginForMissingSession();
        setIsReady(true);
        return;
      }

      if (isAccessTokenExpiryValid(authState.accessTokenExpiresAt)) {
        try {
          await refreshOnboardingStateForRoot();
          redirectRootAfterAuth();
          setIsReady(true);
        } catch {
          await clearTokens();
          redirectToLoginForExpiredSession();
          setIsReady(true);
        }
        return;
      }

      try {
        await refreshStoredTokens();
        redirectRootAfterAuth();
      } catch {
        await clearTokens();
        redirectToLoginForExpiredSession();
      } finally {
        setIsReady(true);
      }
    };

    void bootstrapAuth().catch(() => {
      redirectToLoginForExpiredSession();
      setIsReady(true);
    });
  }, []);

  if (!isReady) return null;

  return children;
}

export default AuthBootstrap;
