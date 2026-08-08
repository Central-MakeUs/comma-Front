import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth.api';
import { getPostLoginPath } from '../lib/authNavigation';
import { GOOGLE_LOGIN_RECOVERY_TIMEOUT_MS, waitForGoogleLogin } from '../lib/nativeGoogleLogin';
import {
  clearNativeGoogleOAuthState,
  createNativeGoogleOAuthState,
  hasPendingNativeGoogleOAuthState
} from '../lib/oauthState';

interface UseNativeGoogleLoginOptions {
  enabled: boolean;
  onError: () => void;
}

export function useNativeGoogleLogin({ enabled, onError }: UseNativeGoogleLoginOptions) {
  const navigate = useNavigate();
  const hasStartedRecoveryRef = useRef(false);
  const loginAbortControllerRef = useRef<AbortController | null>(null);
  const isOAuthPendingRef = useRef(false);
  const [isOAuthPending, setIsOAuthPending] = useState(false);
  const { isPending: isLoginPending, mutateAsync } = useMutation({ mutationFn: login });

  const completeGoogleLogin = useCallback(
    async (code: string, redirectUri: string) => {
      const response = await mutateAsync({ field: 'GOOGLE', code, redirectUri });

      if (!response.success || !response.data) {
        throw new Error(response.message ?? '구글 로그인 중 에러가 발생했습니다.');
      }

      navigate(getPostLoginPath(response.data), { replace: true });
    },
    [mutateAsync, navigate]
  );

  const startGoogleLogin = useCallback(async () => {
    if (!enabled || isOAuthPendingRef.current || isLoginPending) return;

    isOAuthPendingRef.current = true;
    setIsOAuthPending(true);

    const state = createNativeGoogleOAuthState();
    const controller = new AbortController();
    loginAbortControllerRef.current = controller;
    const loginResponse = waitForGoogleLogin({ signal: controller.signal });

    window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'GOOGLE_LOGIN', state }));

    try {
      const { code, redirectUri } = await loginResponse;
      await completeGoogleLogin(code, redirectUri);
    } catch {
      if (controller.signal.aborted) return;

      clearNativeGoogleOAuthState();
      onError();
    } finally {
      if (loginAbortControllerRef.current === controller) {
        loginAbortControllerRef.current = null;
      }
      if (!controller.signal.aborted) {
        isOAuthPendingRef.current = false;
        setIsOAuthPending(false);
      }
    }
  }, [completeGoogleLogin, enabled, isLoginPending, onError]);

  useEffect(() => {
    if (!enabled || hasStartedRecoveryRef.current || !hasPendingNativeGoogleOAuthState()) return;

    hasStartedRecoveryRef.current = true;
    isOAuthPendingRef.current = true;
    setIsOAuthPending(true);
    const controller = new AbortController();

    void (async () => {
      try {
        const loginResponse = waitForGoogleLogin({
          signal: controller.signal,
          timeoutMs: GOOGLE_LOGIN_RECOVERY_TIMEOUT_MS
        });
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({ type: 'GOOGLE_LOGIN_RECOVERY_READY' })
        );
        const { code, redirectUri } = await loginResponse;
        await completeGoogleLogin(code, redirectUri);
      } catch {
        if (controller.signal.aborted) return;

        clearNativeGoogleOAuthState();
        onError();
      } finally {
        if (!controller.signal.aborted) {
          isOAuthPendingRef.current = false;
          setIsOAuthPending(false);
        }
      }
    })();

    return () => controller.abort();
  }, [completeGoogleLogin, enabled, onError]);

  useEffect(
    () => () => {
      loginAbortControllerRef.current?.abort();
      loginAbortControllerRef.current = null;
    },
    []
  );

  return {
    isPending: isOAuthPending || isLoginPending,
    startGoogleLogin
  };
}
