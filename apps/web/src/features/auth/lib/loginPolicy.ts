export type IosAppleLoginMode = 'review' | 'native';

export const getIosAppleLoginMode = (value: string | undefined): IosAppleLoginMode =>
  value?.trim().toLowerCase() === 'native' ? 'native' : 'review';

export const shouldUseNativeLogin = ({
  isMobileWebView,
  isIosApp,
  iosAppleLoginMode,
  provider
}: {
  isMobileWebView: boolean;
  isIosApp: boolean;
  iosAppleLoginMode: IosAppleLoginMode;
  provider: 'KAKAO' | 'GOOGLE' | 'APPLE';
}) => isMobileWebView && (provider !== 'APPLE' || !isIosApp || iosAppleLoginMode === 'native');
