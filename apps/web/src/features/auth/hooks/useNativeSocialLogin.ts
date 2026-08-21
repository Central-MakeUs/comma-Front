import { useMutation } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../../../shared/analytics/events';
import { type AuthProvider, loginWithNativeProvider } from '../api/auth.api';
import { getPostLoginPath } from '../lib/authNavigation';

interface UseNativeSocialLoginOptions {
  enabled: boolean;
}

export function useNativeSocialLogin({ enabled }: UseNativeSocialLoginOptions) {
  const navigate = useNavigate();
  const isLoginInProgressRef = useRef(false);
  const [pendingProvider, setPendingProvider] = useState<AuthProvider | null>(null);
  const { isPending, mutateAsync } = useMutation({ mutationFn: loginWithNativeProvider });

  const startLogin = useCallback(
    async (provider: AuthProvider) => {
      if (!enabled || isLoginInProgressRef.current || isPending) return false;

      isLoginInProgressRef.current = true;
      setPendingProvider(provider);
      try {
        const response = await mutateAsync(provider);
        const method = provider.toLowerCase();
        if (response.cancelled) {
          trackEvent('login_cancelled', { method, surface: 'app' });
          return true;
        }
        if (!response.success || !response.data) {
          trackEvent('login_failed', { method, surface: 'app' });
          return false;
        }

        trackEvent(response.data.onboardingCompleted ? 'login' : 'sign_up', {
          method,
          surface: 'app'
        });
        navigate(getPostLoginPath(response.data), { replace: true });
        return true;
      } catch {
        trackEvent('login_failed', { method: provider.toLowerCase(), surface: 'app' });
        return false;
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
