import { POST_MESSAGE_EVENT } from '@comma/bridge';
import type { BridgeWebView } from '@webview-bridge/react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Linking, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { WebViewErrorEvent } from 'react-native-webview/lib/WebViewTypes';
import { postMessage, WebView } from './src/bridge';
import { useWebViewMessageHandler } from './src/useWebViewMessageHandler';
import { createSafeAreaScript, getWebUrlConfig } from './src/webViewConfig';
import {
  APPLE_AUTH_ORIGINS,
  isAllowedWebViewUrl,
  isAppleAuthUrl,
  isExternalBrowserUrl,
  isWebOAuthCallbackUrl
} from './src/webViewSecurity';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { error, url: webUrl } = getWebUrlConfig();
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<BridgeWebView>(null);
  const webViewReadyRef = useRef(false);
  const safeAreaScript = useMemo(() => createSafeAreaScript(insets), [insets]);
  const webOrigin = useMemo(() => (webUrl ? new URL(webUrl).origin : undefined), [webUrl]);
  const [currentWebUrl, setCurrentWebUrl] = useState(webUrl);
  const { handleGoogleRedirectUrl, handleMessage } = useWebViewMessageHandler({
    webOrigin,
    webViewReadyRef,
    webViewRef
  });

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
        bounces={false}
        nestedScrollEnabled
        overScrollMode="never"
        ref={webViewRef}
        scrollEnabled
        style={styles.webView}
        source={{ uri: currentWebUrl ?? webUrl }}
        injectedJavaScriptBeforeContentLoaded={safeAreaScript}
        originWhitelist={[trustedWebOrigin, ...APPLE_AUTH_ORIGINS]}
        onShouldStartLoadWithRequest={(request) => {
          if (isAllowedWebViewUrl(request.url, trustedWebOrigin)) return true;
          if (isAppleAuthUrl(request.url)) return true;
          if (request.isTopFrame === false) {
            console.warn('Blocked an external WebView subframe.', request.url);
            return false;
          }

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
