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
  filename?: string;
  width: number;
  height: number;
};

export type FeedMood = 'A' | 'B' | 'C';
export type FeedTimeBudget = 'X' | 'Y' | 'Z';

export type FeedCreateRequest = {
  mood: FeedMood;
  timeBudget: FeedTimeBudget;
  hashtags: string[];
  review: string;
  isPublic: boolean;
};

export type NativeFeedUploadAuth = {
  accessToken: string;
  baseUrl: string;
};

export type FeedResponse = {
  feedId: number;
  nickname: string;
  mood: FeedMood;
  timeBudget: FeedTimeBudget;
  imageUrl: string;
  hashtags: string[];
  review: string;
  isPublic: boolean;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
};

export type AppBridge = {
  openExternalBrowser(url: string): Promise<void>;
  getAppInfo(): Promise<AppInfo>;
  setStatusBar(style: StatusBarStyle): Promise<void>;
  getGalleryPhotos(limit?: number): Promise<GalleryPhoto[]>;
  createFeedWithGalleryPhoto(
    assetId: string,
    request: FeedCreateRequest,
    auth: NativeFeedUploadAuth
  ): Promise<FeedResponse>;
};

export type AppPostMessageSchema = {
  [POST_MESSAGE_EVENT.APP_READY]: {
    validate: (data: unknown) => Pick<AppInfo, 'platform'>;
  };
};
