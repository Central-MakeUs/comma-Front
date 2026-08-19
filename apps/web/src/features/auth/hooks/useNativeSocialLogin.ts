import { useMutation } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        if (response.cancelled) return true;
        if (!response.success || !response.data) {
          return false;
        }

        navigate(getPostLoginPath(response.data), { replace: true });
        return true;
      } catch {
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
