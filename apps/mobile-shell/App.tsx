import { NATIVE_BACK_EVENT, POST_MESSAGE_EVENT } from '@comma/bridge';
import type { BridgeWebView } from '@webview-bridge/react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { BackHandler, PanResponder, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { WebViewErrorEvent } from 'react-native-webview/lib/WebViewTypes';
import { postMessage, WebView } from './src/bridge';
import { shouldCaptureIosBackGesture, shouldCompleteIosBackGesture } from './src/nativeBackGesture';
import { useWebViewMessageHandler } from './src/useWebViewMessageHandler';
import { createSafeAreaScript, getWebUrlConfig } from './src/webViewConfig';
import { isAllowedWebViewUrl, isExternalBrowserUrl } from './src/webViewSecurity';

const NATIVE_BACK_RESPONSE_TIMEOUT_MS = 700;

SplashScreen.preventAutoHideAsync();

export default function App() {
  const { error, url: webUrl } = getWebUrlConfig();
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<BridgeWebView>(null);
  const webViewReadyRef = useRef(false);
  const pendingBackRequestRef = useRef<string | undefined>(undefined);
  const pendingBackTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const canWebViewGoBackRef = useRef(false);
  const currentNavigationUrlRef = useRef(webUrl);
  const safeAreaScript = useMemo(() => createSafeAreaScript(insets), [insets]);
  const webOrigin = useMemo(() => (webUrl ? new URL(webUrl).origin : undefined), [webUrl]);
  const handleNativeBackResponse = useCallback((requestId: string, handled: boolean) => {
    if (requestId !== pendingBackRequestRef.current) return;

    if (pendingBackTimeoutRef.current) clearTimeout(pendingBackTimeoutRef.current);
    pendingBackTimeoutRef.current = undefined;
    pendingBackRequestRef.current = undefined;
    if (!handled && Platform.OS === 'android') BackHandler.exitApp();
  }, []);
  const { handleMessage } = useWebViewMessageHandler({
    onNativeBackResponse: handleNativeBackResponse,
    webOrigin
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

  const requestWebBack = useCallback(() => {
    if (pendingBackRequestRef.current) return;
    if (!webViewReadyRef.current || error || !webUrl) {
      if (Platform.OS === 'android') BackHandler.exitApp();
      return;
    }
    if (
      webOrigin &&
      currentNavigationUrlRef.current &&
      !isAllowedWebViewUrl(currentNavigationUrlRef.current, webOrigin) &&
      canWebViewGoBackRef.current
    ) {
      webViewRef.current?.goBack();
      return;
    }

    const requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    pendingBackRequestRef.current = requestId;
    webViewRef.current?.injectJavaScript(`
      window.dispatchEvent(new CustomEvent(${JSON.stringify(NATIVE_BACK_EVENT)}, {
        detail: ${JSON.stringify({ requestId })}
      }));
      true;
    `);
    pendingBackTimeoutRef.current = setTimeout(() => {
      if (pendingBackRequestRef.current !== requestId) return;

      pendingBackRequestRef.current = undefined;
      pendingBackTimeoutRef.current = undefined;
      if (Platform.OS === 'android') BackHandler.exitApp();
    }, NATIVE_BACK_RESPONSE_TIMEOUT_MS);
  }, [error, webOrigin, webUrl]);

  const iosBackPanResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponderCapture: (_, gestureState) =>
          Platform.OS === 'ios' && shouldCaptureIosBackGesture(gestureState),
        onPanResponderRelease: (_, gestureState) => {
          if (shouldCompleteIosBackGesture(gestureState)) requestWebBack();
        },
        onPanResponderTerminationRequest: () => true
      }),
    [requestWebBack]
  );

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      requestWebBack();
      return true;
    });

    return () => subscription.remove();
  }, [requestWebBack]);

  useEffect(() => {
    return () => {
      if (pendingBackTimeoutRef.current) clearTimeout(pendingBackTimeoutRef.current);
      pendingBackTimeoutRef.current = undefined;
      pendingBackRequestRef.current = undefined;
    };
  }, []);

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
    <View style={styles.container} {...iosBackPanResponder.panHandlers}>
      <StatusBar style="auto" translucent backgroundColor="transparent" />
      <WebView
        allowsInlineMediaPlayback
        bounces={false}
        mediaPlaybackRequiresUserAction={false}
        nestedScrollEnabled
        overScrollMode="never"
        ref={webViewRef}
        scrollEnabled
        style={styles.webView}
        source={{ uri: webUrl }}
        injectedJavaScriptBeforeContentLoaded={safeAreaScript}
        originWhitelist={[
          trustedWebOrigin,
          'https://kauth.kakao.com',
          'https://accounts.google.com',
          'https://appleid.apple.com'
        ]}
        onShouldStartLoadWithRequest={(request) => {
          if (isAllowedWebViewUrl(request.url, trustedWebOrigin)) return true;
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
        onNavigationStateChange={(navigationState) => {
          canWebViewGoBackRef.current = navigationState.canGoBack;
          currentNavigationUrlRef.current = navigationState.url;
        }}
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
