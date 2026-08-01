import { POST_MESSAGE_EVENT } from '@comma/bridge';
import type { BridgeWebView } from '@webview-bridge/react-native';
import Constants from 'expo-constants';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useMemo, useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { WebViewErrorEvent, WebViewMessageEvent } from 'react-native-webview/lib/WebViewTypes';
import { postMessage, WebView } from './src/bridge';

type WebUrlConfig = {
  error?: string;
  url?: string;
};

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

const params = new URLSearchParams({
  client_id: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  redirect_uri: process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI,
  response_type: 'code',
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ].join(' ')
});

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
  const safeAreaScript = useMemo(() => createSafeAreaScript(insets), [insets]);
  const handleMessage = async (event: WebViewMessageEvent) => {
    let message: { type?: string; url?: string } | undefined;
    try {
      message = JSON.parse(event.nativeEvent.data);
    } catch (error) {
      console.log(error);
      return;
    }

    switch (message?.type) {
      case 'GOOGLE_LOGIN': {
        try {
          const googleRes = await WebBrowser.openAuthSessionAsync(
            `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
            process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI
          );
          if (googleRes.type === 'success') {
            const url = new URL(googleRes.url);
            const code = url.searchParams.get('code');
            webViewRef.current?.postMessage(
              JSON.stringify({
                type: 'GOOGLE_LOGIN_SUCCESS',
                code,
                redirectUri: process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI
              })
            );
          } else {
            throw new Error(
              `구글 로그인 중 에러가 발생했습니다: \n${JSON.stringify(googleRes, null, 2)}`
            );
          }
        } catch (error) {
          console.log(error);
          webViewRef.current?.postMessage(
            JSON.stringify({
              type: 'GOOGLE_LOGIN_FAILED',
              error: error instanceof Error ? error.message : '구글 로그인 중 에러가 발생했습니다.'
            })
          );
          alert(`로그인 중 에러가 발생했습니다: \n${JSON.stringify(error, null, 2)}`);
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

  return (
    <View style={styles.container}>
      <StatusBar style="auto" translucent backgroundColor="transparent" />
      <WebView
        ref={webViewRef}
        style={styles.webView}
        source={{ uri: webUrl }}
        injectedJavaScriptBeforeContentLoaded={safeAreaScript}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        onError={(event: WebViewErrorEvent) => {
          console.warn('Failed to load web app.', {
            webUrl,
            description: event.nativeEvent.description
          });
        }}
        onLoadEnd={() => {
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
