import type { ConfigContext, ExpoConfig } from 'expo/config';
import appJson from './app.json';

const getOptionalEnv = (name: string) => {
  const value = process.env[name]?.trim();
  if (!value) console.warn(`Native login config is missing ${name}.`);
  return value;
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const kakaoAppKey = getOptionalEnv('KAKAO_NATIVE_APP_KEY');
  const googleIosUrlScheme = getOptionalEnv('GOOGLE_IOS_URL_SCHEME');
  const providerPlugins: NonNullable<ExpoConfig['plugins']> = [];

  if (kakaoAppKey) {
    providerPlugins.push(['@react-native-seoul/kakao-login', { kakaoAppKey }]);
  }
  if (googleIosUrlScheme) {
    providerPlugins.push([
      '@react-native-google-signin/google-signin',
      { iosUrlScheme: googleIosUrlScheme }
    ]);
  }

  return {
    ...config,
    ...appJson.expo,
    plugins: [...(appJson.expo.plugins as NonNullable<ExpoConfig['plugins']>), ...providerPlugins]
  };
};
