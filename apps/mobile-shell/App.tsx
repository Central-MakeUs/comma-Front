import { POST_MESSAGE_EVENT } from '@comma/bridge';
import { StatusBar } from 'expo-status-bar';
import { Platform, SafeAreaView, StyleSheet } from 'react-native';
import { postMessage, WebView } from './src/bridge';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

const defaultWebUrl = Platform.OS === 'android' ? 'http://10.0.2.2:5173' : 'http://localhost:5173';
const webUrl = process.env.EXPO_PUBLIC_WEB_URL ?? defaultWebUrl;
SplashScreen.preventAutoHideAsync();

export default function App() {

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <WebView
        source={{ uri: webUrl }}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        onLoadEnd={() => {
          postMessage(POST_MESSAGE_EVENT.APP_READY, {
            platform: Platform.OS
          });
          SplashScreen.hideAsync();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f2'
  }
});
