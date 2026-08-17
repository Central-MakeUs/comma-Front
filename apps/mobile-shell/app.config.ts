import type { ConfigContext, ExpoConfig } from 'expo/config';
import appJson from './app.json';

const getRequiredEnv = (name: string) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Native login config is missing ${name}.`);
  return value;
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const kakaoAppKey = getRequiredEnv('KAKAO_NATIVE_APP_KEY');
  const googleIosUrlScheme = getRequiredEnv('GOOGLE_IOS_URL_SCHEME');
  getRequiredEnv('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID');
  getRequiredEnv('EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID');
  const nativePlugins: NonNullable<ExpoConfig['plugins']> = [
    ['./plugins/with-kakao-sdk-version', { version: '2.22.7' }]
  ];

  if (kakaoAppKey) {
    nativePlugins.push(['@react-native-seoul/kakao-login', { kakaoAppKey }]);
  }
  if (googleIosUrlScheme) {
    nativePlugins.push([
      '@react-native-google-signin/google-signin',
      { iosUrlScheme: googleIosUrlScheme }
    ]);
  }

  return {
    ...config,
    ...appJson.expo,
    plugins: [...(appJson.expo.plugins as NonNullable<ExpoConfig['plugins']>), ...nativePlugins]
  };
};
