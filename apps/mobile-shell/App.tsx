import { POST_MESSAGE_EVENT } from '@comma/bridge';
import Constants from 'expo-constants';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { postMessage, WebView } from './src/bridge';

const getLanWebUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(':')[0];

  return host ? `http://${host}:5173` : undefined;
};

const webUrl =
  Platform.OS === 'android' ? 'http://10.0.2.2:5173' : (getLanWebUrl() ?? 'http://localhost:5173');
SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
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
      </SafeAreaView>
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
  }
});
