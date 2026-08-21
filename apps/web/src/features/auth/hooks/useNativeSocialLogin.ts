import { useMutation } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../../../shared/analytics/events';
import {
  type AuthProvider,
  loginWithNativeProvider,
  NativeLoginUnavailableError
} from '../api/auth.api';
import { getPostLoginPath } from '../lib/authNavigation';

interface UseNativeSocialLoginOptions {
  enabled: boolean;
}

export type NativeLoginOutcome = 'success' | 'cancelled' | 'unavailable' | 'failed' | 'busy';

export function useNativeSocialLogin({ enabled }: UseNativeSocialLoginOptions) {
  const navigate = useNavigate();
  const isLoginInProgressRef = useRef(false);
  const [pendingProvider, setPendingProvider] = useState<AuthProvider | null>(null);
  const { isPending, mutateAsync } = useMutation({ mutationFn: loginWithNativeProvider });

  const startLogin = useCallback(
    async (provider: AuthProvider) => {
      if (!enabled) return 'unavailable' as const;
      if (isLoginInProgressRef.current || isPending) return 'busy' as const;

      isLoginInProgressRef.current = true;
      setPendingProvider(provider);
      try {
        const response = await mutateAsync(provider);
        const method = provider.toLowerCase();
        if (response.cancelled) {
          trackEvent('login_cancelled', { method, surface: 'app' });
          return 'cancelled' as const;
        }
        if (!response.success || !response.data) {
          trackEvent('login_failed', { method, surface: 'app' });
          return 'failed' as const;
        }

        trackEvent('login', {
          method,
          surface: 'app'
        });
        navigate(getPostLoginPath(response.data), { replace: true });
        return 'success' as const;
      } catch (error) {
        if (!(error instanceof NativeLoginUnavailableError)) {
          trackEvent('login_failed', { method: provider.toLowerCase(), surface: 'app' });
        }
        return error instanceof NativeLoginUnavailableError
          ? ('unavailable' as const)
          : ('failed' as const);
      } finally {
        isLoginInProgressRef.current = false;
        setPendingProvider(null);
      }
    },
    [enabled, isPending, mutateAsync, navigate]
  );

  return {
    isPending: isPending || pendingProvider !== null,
    pendingProvider,
    startLogin
  };
}
