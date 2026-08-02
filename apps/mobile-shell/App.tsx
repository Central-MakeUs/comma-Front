import { POST_MESSAGE_EVENT } from '@comma/bridge';
import type { BridgeWebView } from '@webview-bridge/react-native';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Linking, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { WebViewErrorEvent, WebViewMessageEvent } from 'react-native-webview/lib/WebViewTypes';
import { postMessage, WebView } from './src/bridge';

type WebUrlConfig = {
  error?: string;
  url?: string;
};

type GoogleLoginResultMessage = {
  type: 'GOOGLE_LOGIN_SUCCESS' | 'GOOGLE_LOGIN_FAILED';
  code?: string;
  error?: string;
  redirectUri?: string;
  state: string;
};

const GOOGLE_OAUTH_PENDING_STATE_KEY = 'google-oauth-pending-state';
const WEB_OAUTH_CALLBACK_PATHS = new Set([
  '/oauth/kakao/callback',
  '/oauth/google/callback',
  '/oauth/apple/callback'
]);

const getLanWebUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(':')[0];

  return host ? `http://${host}:5173` : undefined;
};

const getDevelopmentWebUrl = () =>
  Platform.OS === 'android' ? 'http://10.0.2.2:5173' : (getLanWebUrl() ?? 'http://localhost:5173');

const getConfiguredWebUrl = () => {
  const envWebUrl = process.env.EXPO_PUBLIC_WEB_URL?.trim();
  const extraWebUrl = Constants.expoConfig?.extra?.webUrl;

  if (envWebUrl) {
    return envWebUrl;
  }

  return typeof extraWebUrl === 'string' && extraWebUrl.trim() ? extraWebUrl.trim() : undefined;
};

const getWebUrlConfig = (): WebUrlConfig => {
  if (__DEV__) {
    return { url: getDevelopmentWebUrl() };
  }

  const configuredWebUrl = getConfiguredWebUrl();

  if (!configuredWebUrl) {
    return {
      error:
        'Production web URL is missing. Set EXPO_PUBLIC_WEB_URL or expo.extra.webUrl before building.'
    };
  }

  if (!configuredWebUrl.startsWith('https://')) {
    return {
      error: `Production web URL must use HTTPS. Received: ${configuredWebUrl}`
    };
  }

  return { url: configuredWebUrl };
};

SplashScreen.preventAutoHideAsync();

const getGoogleRedirectUri = () => process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI?.trim();

const createGoogleAuthUrl = (state: string) => {
  const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID?.trim();
  const redirectUri = getGoogleRedirectUri();

  if (!clientId || !redirectUri) throw new Error('Google login env is missing.');

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    state,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ].join(' ')
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

const getGoogleLoginResult = (url: string) => {
  const redirectUri = getGoogleRedirectUri();
  if (!redirectUri) return null;

  try {
    const parsedUrl = new URL(url);
    const parsedRedirectUri = new URL(redirectUri);
    if (
      parsedUrl.origin !== parsedRedirectUri.origin ||
      parsedUrl.pathname !== parsedRedirectUri.pathname
    ) {
      return null;
    }

    const code = parsedUrl.searchParams.get('code');
    const state = parsedUrl.searchParams.get('state');
    return code && state ? { code, state } : null;
  } catch {
    return null;
  }
};

const isValidOAuthState = (state: unknown): state is string =>
  typeof state === 'string' && state.length >= 16 && state.length <= 256;

const isAllowedWebViewUrl = (url: string, webOrigin: string) => {
  if (url === 'about:blank') return true;

  try {
    return new URL(url).origin === webOrigin;
  } catch {
    return false;
  }
};

const isExternalBrowserUrl = (url: string) => {
  try {
    const protocol = new URL(url).protocol;
    return protocol === 'https:' || protocol === 'http:';
  } catch {
    return false;
  }
};

const isWebOAuthCallbackUrl = (url: string, webOrigin: string) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.origin === webOrigin && WEB_OAUTH_CALLBACK_PATHS.has(parsedUrl.pathname);
  } catch {
    return false;
  }
};

const createSafeAreaScript = (insets: {
  bottom: number;
  left: number;
  right: number;
  top: number;
}) => {
  const safeAreaVars = {
    '--safe-area-top': `${insets.top}px`,
    '--safe-area-bottom': `${insets.bottom}px`,
    '--safe-area-left': `${insets.left}px`,
    '--safe-area-right': `${insets.right}px`
  };

  return `
    (function () {
      var safeAreaVars = ${JSON.stringify(safeAreaVars)};
      var root = document.documentElement;
      Object.keys(safeAreaVars).forEach(function (name) {
        root.style.setProperty(name, safeAreaVars[name]);
      });
    })();
    true;
  `;
};

export default function App() {
  const { error, url: webUrl } = getWebUrlConfig();
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<BridgeWebView>(null);
  const webViewReadyRef = useRef(false);
  const isGoogleLoginInProgressRef = useRef(false);
  const hasHandledGoogleLoginRef = useRef(false);
  const isGoogleRecoveryReadyRef = useRef(false);
  const pendingGoogleStateRef = useRef<string | undefined>(undefined);
  const googleRedirectPromiseRef = useRef<Promise<boolean> | undefined>(undefined);
  const pendingWebMessageRef = useRef<GoogleLoginResultMessage | undefined>(undefined);
  const safeAreaScript = useMemo(() => createSafeAreaScript(insets), [insets]);
  const webOrigin = useMemo(() => (webUrl ? new URL(webUrl).origin : undefined), [webUrl]);
  const [currentWebUrl, setCurrentWebUrl] = useState(webUrl);

  const postWebMessage = useCallback((message: GoogleLoginResultMessage) => {
    if (!webViewReadyRef.current) {
      pendingWebMessageRef.current = message;
      return;
    }

    webViewRef.current?.postMessage(JSON.stringify(message));
  }, []);

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

  const handleMessage = async (event: WebViewMessageEvent) => {
    if (!webOrigin || !isAllowedWebViewUrl(event.nativeEvent.url, webOrigin)) {
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
          const redirectUri = getGoogleRedirectUri();
          const googleRes = await WebBrowser.openAuthSessionAsync(
            createGoogleAuthUrl(loginState),
            redirectUri
          );
          if (googleRes.type === 'success') {
            if (
              !hasHandledGoogleLoginRef.current &&
              !(await handleGoogleRedirectUrl(googleRes.url))
            ) {
              throw new Error('구글 로그인 응답을 검증하지 못했습니다.');
            }
          } else if (!hasHandledGoogleLoginRef.current) {
            const redirectUrl = await Linking.getInitialURL();
            if (redirectUrl && (await handleGoogleRedirectUrl(redirectUrl))) return;

            throw new Error(
              `구글 로그인 중 에러가 발생했습니다: \n${JSON.stringify(googleRes, null, 2)}`
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
        if (message.url) {
          await WebBrowser.openBrowserAsync(message.url);
        }
        break;
      }
    }
  };

  useEffect(() => {
    if (error) {
      SplashScreen.hideAsync();
    }
  }, [error]);

  useEffect(() => {
    if (error || !webUrl) return;

    webViewRef.current?.injectJavaScript(safeAreaScript);
  }, [error, safeAreaScript, webUrl]);

  useEffect(() => {
    if (!webOrigin) return;

    const handleUrl = async (url: string) => {
      if (await handleGoogleRedirectUrl(url)) return;
      if (isWebOAuthCallbackUrl(url, webOrigin)) setCurrentWebUrl(url);
    };

    const subscription = Linking.addEventListener('url', ({ url }) => void handleUrl(url));
    Linking.getInitialURL().then((url) => {
      if (url) void handleUrl(url);
    });

    return () => subscription.remove();
  }, [handleGoogleRedirectUrl, webOrigin]);

  useEffect(() => {
    setCurrentWebUrl(webUrl);
  }, [webUrl]);

  if (error || !webUrl) {
    return (
      <View
        style={[
          styles.container,
          styles.errorContainer,
          { paddingTop: insets.top, paddingBottom: insets.bottom }
        ]}
      >
        <StatusBar style="auto" translucent backgroundColor="transparent" />
        <View style={styles.errorState}>
          <Text style={styles.errorTitle}>Unable to load Comma</Text>
          <Text style={styles.errorMessage}>{error ?? 'Web URL is unavailable.'}</Text>
        </View>
      </View>
    );
  }

  const trustedWebOrigin = webOrigin ?? new URL(webUrl).origin;

  return (
    <View style={styles.container}>
      <StatusBar style="auto" translucent backgroundColor="transparent" />
      <WebView
        ref={webViewRef}
        style={styles.webView}
        source={{ uri: currentWebUrl ?? webUrl }}
        injectedJavaScriptBeforeContentLoaded={safeAreaScript}
        originWhitelist={[trustedWebOrigin]}
        onShouldStartLoadWithRequest={(request) => {
          if (isAllowedWebViewUrl(request.url, trustedWebOrigin)) return true;
          if (request.isTopFrame === false) return true;

          if (isExternalBrowserUrl(request.url)) {
            void WebBrowser.openBrowserAsync(request.url);
          } else {
            console.warn('Blocked unsupported WebView navigation.', request.url);
          }
          return false;
        }}
        javaScriptEnabled
        domStorageEnabled
        onError={(event: WebViewErrorEvent) => {
          console.warn('Failed to load web app.', {
            webUrl,
            description: event.nativeEvent.description
          });
        }}
        onLoadEnd={() => {
          webViewReadyRef.current = true;
          postMessage(POST_MESSAGE_EVENT.APP_READY, {
            platform: Platform.OS
          });
          SplashScreen.hideAsync();
        }}
        onMessage={handleMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1814'
  },
  errorContainer: {
    backgroundColor: '#FDFCFC'
  },
  webView: {
    flex: 1
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
    padding: 24
  },
  errorTitle: {
    color: '#1d1d1b',
    fontSize: 18,
    fontWeight: '700'
  },
  errorMessage: {
    color: '#55554f',
    fontSize: 14,
    lineHeight: 20
  }
});
