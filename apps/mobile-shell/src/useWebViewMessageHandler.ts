import type { BridgeWebView } from '@webview-bridge/react-native';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useRef } from 'react';
import { Linking } from 'react-native';
import type { WebViewMessageEvent } from 'react-native-webview/lib/WebViewTypes';
import {
  createGoogleAuthUrl,
  GOOGLE_OAUTH_PENDING_STATE_KEY,
  type GoogleLoginResultMessage,
  getGoogleLoginResult,
  getGoogleRedirectUri,
  isValidOAuthState
} from './googleOAuth';
import { isExternalBrowserUrl, isTrustedWebViewMessageUrl } from './webViewSecurity';

interface UseWebViewMessageHandlerOptions {
  webOrigin?: string;
  webViewReadyRef: React.RefObject<boolean>;
  webViewRef: React.RefObject<BridgeWebView | null>;
}

export function useWebViewMessageHandler({
  webOrigin,
  webViewReadyRef,
  webViewRef
}: UseWebViewMessageHandlerOptions) {
  const isGoogleLoginInProgressRef = useRef(false);
  const hasHandledGoogleLoginRef = useRef(false);
  const isGoogleRecoveryReadyRef = useRef(false);
  const pendingGoogleStateRef = useRef<string | undefined>(undefined);
  const googleRedirectPromiseRef = useRef<Promise<boolean> | undefined>(undefined);
  const pendingWebMessageRef = useRef<GoogleLoginResultMessage | undefined>(undefined);

  const postWebMessage = useCallback(
    (message: GoogleLoginResultMessage) => {
      if (!webViewReadyRef.current) {
        pendingWebMessageRef.current = message;
        return;
      }

      webViewRef.current?.postMessage(JSON.stringify(message));
    },
    [webViewReadyRef, webViewRef]
  );

  const postGoogleLoginSuccess = useCallback(
    (code: string, state: string) => {
      const message: GoogleLoginResultMessage = {
        type: 'GOOGLE_LOGIN_SUCCESS',
        code,
        redirectUri: getGoogleRedirectUri(),
        state
      };

      hasHandledGoogleLoginRef.current = true;
      if (isGoogleLoginInProgressRef.current || isGoogleRecoveryReadyRef.current) {
        postWebMessage(message);
        isGoogleRecoveryReadyRef.current = false;
      } else {
        pendingWebMessageRef.current = message;
      }
      isGoogleLoginInProgressRef.current = false;
    },
    [postWebMessage]
  );

  const handleGoogleRedirectUrl = useCallback(
    async (url: string) => {
      const result = getGoogleLoginResult(url);
      if (!result) return false;
      if (googleRedirectPromiseRef.current) return googleRedirectPromiseRef.current;

      const consumePromise = (async () => {
        const expectedState =
          pendingGoogleStateRef.current ??
          (await SecureStore.getItemAsync(GOOGLE_OAUTH_PENDING_STATE_KEY));
        if (!expectedState || result.state !== expectedState) return false;

        pendingGoogleStateRef.current = undefined;
        await SecureStore.deleteItemAsync(GOOGLE_OAUTH_PENDING_STATE_KEY);
        postGoogleLoginSuccess(result.code, result.state);
        return true;
      })();
      googleRedirectPromiseRef.current = consumePromise;

      try {
        return await consumePromise;
      } finally {
        if (googleRedirectPromiseRef.current === consumePromise) {
          googleRedirectPromiseRef.current = undefined;
        }
      }
    },
    [postGoogleLoginSuccess]
  );

  const handleMessage = useCallback(
    async (event: WebViewMessageEvent) => {
      if (!webOrigin || !isTrustedWebViewMessageUrl(event.nativeEvent.url, webOrigin)) {
        console.warn('Blocked a WebView message from an untrusted origin.', event.nativeEvent.url);
        return;
      }

      let message: { type?: string; state?: unknown; url?: string } | undefined;
      try {
        message = JSON.parse(event.nativeEvent.data);
      } catch (error) {
        console.log(error);
        return;
      }

      switch (message?.type) {
        case 'GOOGLE_LOGIN_RECOVERY_READY': {
          isGoogleRecoveryReadyRef.current = true;
          if (pendingWebMessageRef.current) {
            webViewRef.current?.postMessage(JSON.stringify(pendingWebMessageRef.current));
            pendingWebMessageRef.current = undefined;
            isGoogleRecoveryReadyRef.current = false;
          }
          break;
        }
        case 'GOOGLE_LOGIN': {
          if (!isValidOAuthState(message.state)) {
            postWebMessage({
              type: 'GOOGLE_LOGIN_FAILED',
              error: 'Google login state is invalid.',
              state: typeof message.state === 'string' ? message.state : ''
            });
            return;
          }

          const loginState = message.state;
          try {
            isGoogleLoginInProgressRef.current = true;
            hasHandledGoogleLoginRef.current = false;
            isGoogleRecoveryReadyRef.current = false;
            pendingGoogleStateRef.current = loginState;
            await SecureStore.setItemAsync(GOOGLE_OAUTH_PENDING_STATE_KEY, loginState);
            const googleResult = await WebBrowser.openAuthSessionAsync(
              createGoogleAuthUrl(loginState),
              getGoogleRedirectUri()
            );
            if (googleResult.type === 'success') {
              if (
                !hasHandledGoogleLoginRef.current &&
                !(await handleGoogleRedirectUrl(googleResult.url))
              ) {
                throw new Error('구글 로그인 응답을 검증하지 못했습니다.');
              }
            } else if (!hasHandledGoogleLoginRef.current) {
              const redirectUrl = await Linking.getInitialURL();
              if (redirectUrl && (await handleGoogleRedirectUrl(redirectUrl))) return;

              throw new Error(
                `구글 로그인 중 에러가 발생했습니다: \n${JSON.stringify(googleResult, null, 2)}`
              );
            }
          } catch (error) {
            console.log(error);
            postWebMessage({
              type: 'GOOGLE_LOGIN_FAILED',
              error: error instanceof Error ? error.message : '구글 로그인 중 에러가 발생했습니다.',
              state: loginState
            });
          } finally {
            isGoogleLoginInProgressRef.current = false;
            if (!hasHandledGoogleLoginRef.current) {
              pendingGoogleStateRef.current = undefined;
              await SecureStore.deleteItemAsync(GOOGLE_OAUTH_PENDING_STATE_KEY);
            }
          }
          break;
        }
        case 'OPEN_EXTERNAL': {
          if (message.url && isExternalBrowserUrl(message.url)) {
            await WebBrowser.openBrowserAsync(message.url);
          } else {
            console.warn('Blocked an unsupported external URL.', message.url);
          }
          break;
        }
      }
    },
    [handleGoogleRedirectUrl, postWebMessage, webOrigin, webViewRef]
  );

  return { handleGoogleRedirectUrl, handleMessage };
}
