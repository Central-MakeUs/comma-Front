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

export type PreparedGalleryPhoto = {
  /** Opaque native handle. This is not a file URI. */
  uri: string;
  previewUri: string;
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

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthState = {
  hasTokens: boolean;
  accessTokenExpiresAt: number | null;
};

export type NativeLoginRequest = {
  field: 'KAKAO' | 'GOOGLE' | 'APPLE';
  code: string;
  redirectUri: string;
};

export type NativeLoginResult = {
  success: boolean;
  message?: string;
  data?: {
    onboardingCompleted: boolean;
    nickname: string;
  };
};

export type NativeAuthRefreshResult = {
  onboardingCompleted?: boolean;
};

export type NativeApiRequest = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  params?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
};

export type NativeApiResponse = {
  status: number;
  data: unknown;
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
  migrateAuthTokens(tokens: AuthTokens | null): Promise<AuthState>;
  getAuthState(): Promise<AuthState>;
  completeLogin(request: NativeLoginRequest): Promise<NativeLoginResult>;
  refreshAuthSession(): Promise<NativeAuthRefreshResult>;
  clearAuthTokens(): Promise<void>;
  authenticatedRequest(request: NativeApiRequest): Promise<NativeApiResponse>;
  getGalleryPhotos(limit?: number): Promise<GalleryPhoto[]>;
  prepareGalleryPhoto(assetId: string): Promise<PreparedGalleryPhoto>;
  retainPreparedGalleryPhoto(uri: string): Promise<void>;
  deletePreparedGalleryPhoto(uri: string): Promise<void>;
  createFeedWithGalleryPhoto(
    photo: PreparedGalleryPhoto,
    request: FeedCreateRequest
  ): Promise<FeedResponse>;
};

export type AppPostMessageSchema = {
  [POST_MESSAGE_EVENT.APP_READY]: {
    validate: (data: unknown) => Pick<AppInfo, 'platform'>;
  };
};
