import { POST_MESSAGE_EVENT } from '@comma/bridge';
import Constants from 'expo-constants';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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

export default function App() {
  const { error, url: webUrl } = getWebUrlConfig();

  useEffect(() => {
    if (error) {
      SplashScreen.hideAsync();
    }
  }, [error]);

  if (error || !webUrl) {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <StatusBar style="auto" translucent backgroundColor="transparent" />
          <View style={styles.errorState}>
            <Text style={styles.errorTitle}>Unable to load Comma</Text>
            <Text style={styles.errorMessage}>{error ?? 'Web URL is unavailable.'}</Text>
          </View>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="auto" translucent backgroundColor="transparent" />
        <WebView
          style={styles.webView}
          source={{ uri: webUrl }}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          onError={(event) => {
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
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f2'
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
