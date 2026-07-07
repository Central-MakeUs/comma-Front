/// <reference types="vite/client" />

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
