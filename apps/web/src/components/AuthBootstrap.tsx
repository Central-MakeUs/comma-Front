import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { refreshStoredTokens, SESSION_EXPIRED_EVENT } from '../apis/client';
import { router } from '../router';
import { clearTokens, getTokens, isAccessTokenValid } from '../utils/tokenStorage';

interface AuthBootstrapProps {
  children: ReactNode;
}

const redirectToLoginForExpiredSession = () => {
  const redirectTo = `${window.location.pathname}${window.location.search}`;

  router.navigate('/', {
    replace: true,
    state: {
      reason: 'SESSION_EXPIRED',
      redirectTo: redirectTo === '/' ? undefined : redirectTo
    }
  });
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
        setIsReady(true);
        return;
      }

      try {
        await refreshStoredTokens();
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
