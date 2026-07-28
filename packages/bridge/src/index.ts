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

export const FEED_MOODS = ['A', 'B', 'C'] as const;
export const FEED_TIME_BUDGETS = ['X', 'Y', 'Z'] as const;
export const NATIVE_FEED_UPLOAD_UNAUTHORIZED_ERROR = 'NATIVE_FEED_UPLOAD_UNAUTHORIZED';

export type FeedMood = (typeof FEED_MOODS)[number];
export type FeedTimeBudget = (typeof FEED_TIME_BUDGETS)[number];

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
