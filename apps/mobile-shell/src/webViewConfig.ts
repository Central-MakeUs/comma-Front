import Constants from 'expo-constants';
import { Platform } from 'react-native';

interface WebUrlConfig {
  error?: string;
  url?: string;
}

interface SafeAreaInsets {
  bottom: number;
  left: number;
  right: number;
  top: number;
}

const getLanWebUrl = () => {
  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  return host ? `http://${host}:5173` : undefined;
};

const getDevelopmentWebUrl = () => {
  const configuredUrl = process.env.EXPO_PUBLIC_WEB_URL?.trim();
  if (configuredUrl) return configuredUrl;

  return Platform.OS === 'android'
    ? 'http://10.0.2.2:5173'
    : (getLanWebUrl() ?? 'http://localhost:5173');
};

const getConfiguredWebUrl = () => {
  const environmentUrl = process.env.EXPO_PUBLIC_WEB_URL?.trim();
  const extraUrl = Constants.expoConfig?.extra?.webUrl;

  if (environmentUrl) return environmentUrl;
  return typeof extraUrl === 'string' && extraUrl.trim() ? extraUrl.trim() : undefined;
};

export const getWebUrlConfig = (): WebUrlConfig => {
  if (__DEV__) return { url: getDevelopmentWebUrl() };

  const configuredUrl = getConfiguredWebUrl();
  if (!configuredUrl) {
    return {
      error:
        'Production web URL is missing. Set EXPO_PUBLIC_WEB_URL or expo.extra.webUrl before building.'
    };
  }

  if (!configuredUrl.startsWith('https://')) {
    return { error: `Production web URL must use HTTPS. Received: ${configuredUrl}` };
  }

  return { url: configuredUrl };
};

export const createSafeAreaScript = (insets: SafeAreaInsets) => {
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
