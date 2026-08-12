import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { router } from '../../../app/router';
import {
  refreshStoredTokens,
  SESSION_EXPIRED_ERROR_MESSAGE,
  SESSION_EXPIRED_EVENT
} from '../../../shared/api/client';
import {
  getAuthState,
  getOnboardingCompleted,
  initializeAuthStorage,
  isAccessTokenExpiryValid
} from '../../../shared/lib/tokenStorage';

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

const redirectToLoginForAuthError = () => {
  router.navigate('/', {
    replace: true,
    state: { reason: 'OAUTH_FAILED' }
  });
};

const isSessionExpiredError = (error: unknown) =>
  error instanceof Error && error.message.includes(SESSION_EXPIRED_ERROR_MESSAGE);

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
        } catch (error) {
          if (isSessionExpiredError(error)) redirectToLoginForExpiredSession();
          else redirectToLoginForAuthError();
          setIsReady(true);
        }
        return;
      }

      try {
        await refreshStoredTokens();
        redirectRootAfterAuth();
      } catch (error) {
        if (isSessionExpiredError(error)) redirectToLoginForExpiredSession();
        else redirectToLoginForAuthError();
      } finally {
        setIsReady(true);
      }
    };

    void bootstrapAuth().catch(() => {
      redirectToLoginForAuthError();
      setIsReady(true);
    });
  }, []);

  if (!isReady) return null;

  return children;
}

export default AuthBootstrap;
