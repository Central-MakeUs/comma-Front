/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IOS_APPLE_LOGIN_MODE?: 'review' | 'native';
  readonly VITE_SENTRY_ENVIRONMENT: 'development' | 'preview' | 'production';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface AppleIDAuthInitConfig {
  clientId: string;
  scope: string;
  redirectURI: string;
  state?: string;
  nonce?: string;
  usePopup?: boolean;
}

interface AppleIDAuth {
  init: (config: AppleIDAuthInitConfig) => void;
  signIn: () => Promise<unknown>;
}

interface Window {
  AppleID?: {
    auth: AppleIDAuth;
  };
}
