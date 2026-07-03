export const POST_MESSAGE_EVENT = {
  APP_READY: 'appReady'
} as const;

export type AppInfo = {
  platform: string;
  version: string;
};

export type StatusBarStyle = 'light' | 'dark';

export type GalleryPhoto = {
  id: string;
  uri: string;
  width: number;
  height: number;
};

export type AppBridge = {
  openExternalBrowser(url: string): Promise<void>;
  getAppInfo(): Promise<AppInfo>;
  setStatusBar(style: StatusBarStyle): Promise<void>;
  getGalleryPhotos(limit?: number): Promise<GalleryPhoto[]>;
};

export type AppPostMessageSchema = {
  [POST_MESSAGE_EVENT.APP_READY]: {
    validate: (data: unknown) => Pick<AppInfo, 'platform'>;
  };
};
