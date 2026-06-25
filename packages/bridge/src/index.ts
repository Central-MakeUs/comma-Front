export const POST_MESSAGE_EVENT = {
  APP_READY: 'appReady'
} as const;

export type AppInfo = {
  platform: string;
  version: string;
};

export type StatusBarStyle = 'light' | 'dark';

export type AppBridge = {
  openExternalBrowser(url: string): Promise<void>;
  getAppInfo(): Promise<AppInfo>;
  setStatusBar(style: StatusBarStyle): Promise<void>;
};

export type AppPostMessageSchema = {
  [POST_MESSAGE_EVENT.APP_READY]: {
    validate: (data: unknown) => Pick<AppInfo, 'platform'>;
  };
};
