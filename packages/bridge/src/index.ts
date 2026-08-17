export const POST_MESSAGE_EVENT = {
  APP_READY: 'appReady'
} as const;

export const NATIVE_BACK_EVENT = 'comma:native-back';
export const NATIVE_BACK_RESPONSE_TYPE = 'NATIVE_BACK_RESPONSE';

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

export type GalleryPhotoQuery = {
  first?: number;
  after?: string;
};

export type GalleryPhotoPage = {
  photos: GalleryPhoto[];
  endCursor: string | null;
  hasNextPage: boolean;
};

export type PreparedGalleryPhoto = {
  /** Opaque native handle. This is not a file URI. */
  uri: string;
  previewUri: string;
  width: number;
  height: number;
};

export type NativeFilePhoto = {
  base64: string;
  filename?: string;
  mimeType?: string;
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
  activityId: number;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthState = {
  hasTokens: boolean;
  accessTokenExpiresAt: number | null;
};

export type AuthProvider = 'KAKAO' | 'GOOGLE' | 'APPLE';

export type NativeLoginResult = {
  success: boolean;
  cancelled?: boolean;
  message?: string;
  data?: {
    onboardingCompleted: boolean;
    nickname: string | null;
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
  loginWithProvider(provider: AuthProvider): Promise<NativeLoginResult>;
  refreshAuthSession(): Promise<NativeAuthRefreshResult>;
  clearAuthTokens(): Promise<void>;
  authenticatedRequest(request: NativeApiRequest): Promise<NativeApiResponse>;
  getGalleryPhotos(query?: GalleryPhotoQuery): Promise<GalleryPhotoPage>;
  takeGalleryPhoto(): Promise<PreparedGalleryPhoto | null>;
  prepareGalleryPhoto(assetId: string): Promise<PreparedGalleryPhoto>;
  prepareFilePhoto(file: NativeFilePhoto): Promise<PreparedGalleryPhoto>;
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
