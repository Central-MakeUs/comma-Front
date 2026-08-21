import { useMutation } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        if (response.cancelled) return 'cancelled' as const;
        if (!response.success || !response.data) {
          return 'failed' as const;
        }

        navigate(getPostLoginPath(response.data), { replace: true });
        return 'success' as const;
      } catch (error) {
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
