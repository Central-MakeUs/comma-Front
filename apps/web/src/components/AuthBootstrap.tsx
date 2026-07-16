import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { refreshStoredTokens, SESSION_EXPIRED_EVENT } from '../apis/client';
import { router } from '../router';
import {
  clearTokens,
  getOnboardingCompleted,
  getTokens,
  isAccessTokenValid
} from '../utils/tokenStorage';

interface AuthBootstrapProps {
  children: ReactNode;
}

const redirectToLoginForExpiredSession = () => {
  router.navigate('/', {
    replace: true,
    state: {
      reason: 'SESSION_EXPIRED'
    }
  });
};

const redirectRootToLoading = () => {
  if (window.location.pathname !== '/') return;

  router.navigate(getOnboardingCompleted() === false ? '/nickname' : '/loading', { replace: true });
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
      const tokens = getTokens();

      if (!tokens) {
        setIsReady(true);
        return;
      }

      if (isAccessTokenValid(tokens.accessToken)) {
        redirectRootToLoading();
        setIsReady(true);
        return;
      }

      try {
        await refreshStoredTokens();
        redirectRootToLoading();
      } catch {
        clearTokens();
        redirectToLoginForExpiredSession();
      } finally {
        setIsReady(true);
      }
    };

    bootstrapAuth();
  }, []);

  if (!isReady) return null;

  return children;
}

export default AuthBootstrap;
