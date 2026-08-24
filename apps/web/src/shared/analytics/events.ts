export type AnalyticsFailureReason =
  | 'aborted'
  | 'client_error'
  | 'forbidden'
  | 'invalid_state'
  | 'network_error'
  | 'not_found'
  | 'rate_limited'
  | 'server_error'
  | 'session_expired'
  | 'unauthorized'
  | 'unknown';

type EmptyParams = Record<never, never>;
export type LoginMethod = 'apple' | 'google' | 'kakao' | 'unknown';
type MoodCode = 'A' | 'B' | 'C';
type TimeCode = 'X' | 'Y' | 'Z';
type ReselectionStage = 'activity' | 'recommendation' | 'record';

export interface AnalyticsEventMap {
  account_deletion_completed: EmptyParams;
  account_deletion_failed: EmptyParams;
  account_deletion_requested: EmptyParams;
  archive_view_changed: { view_mode: 'grid' | 'list' };
  checklist_started: EmptyParams;
  checklist_step_completed: {
    step: 1 | 2;
    mood_code?: MoodCode;
    time_code?: TimeCode;
  };
  feed_card_impression: { position: number };
  feed_filter_applied: {
    filter_state: 'applied' | 'cleared';
    filter_type: 'mood' | 'time_budget';
  };
  feed_like_changed: { action: 'liked' | 'unliked' };
  feed_load_failed: {
    failure_reason: AnalyticsFailureReason;
    load_stage: 'initial' | 'pagination';
  };
  feed_reported: EmptyParams;
  feed_user_blocked: EmptyParams;
  legal_document_opened: { document_type: 'privacy_policy' | 'terms_of_service' };
  login: { method: LoginMethod };
  login_attempt: { method: Exclude<LoginMethod, 'unknown'> };
  login_cancelled: { method: LoginMethod };
  login_failed: { method: LoginMethod };
  logout_completed: EmptyParams;
  logout_failed: EmptyParams;
  logout_requested: EmptyParams;
  nickname_edit_cancelled: EmptyParams;
  nickname_edit_completed: EmptyParams;
  nickname_edit_opened: EmptyParams;
  onboarding_completed: EmptyParams;
  photo_picker_opened: EmptyParams;
  photo_selected: { photo_source: 'file' | 'native' | 'preview' };
  premium_alert_failed: { contact_method: 'email' | 'phone' };
  premium_alert_opened: EmptyParams;
  premium_alert_submitted: { contact_method: 'email' | 'phone' };
  recommendation_failed: {
    failure_reason: AnalyticsFailureReason;
    mood_code?: MoodCode;
    time_code?: TimeCode;
  };
  recommendation_received: {
    mood_code: MoodCode;
    result_count: number;
    time_code: TimeCode;
  };
  recommendation_requested: { mood_code: MoodCode; time_code: TimeCode };
  recommendation_viewed: { position: number; relax_code: string };
  report_load_failed: {
    failure_reason: AnalyticsFailureReason;
    report_section: 'latest_feed' | 'summary';
  };
  reselection_cancelled: { stage: ReselectionStage };
  reselection_confirmed: { stage: ReselectionStage };
  reselection_opened: { stage: ReselectionStage };
  rest_completed: { is_public: boolean; relax_code: string };
  rest_completion_failed: {
    failure_reason: AnalyticsFailureReason;
    relax_code: string;
    stage: 'authorization' | 'upload';
  };
  rest_record_started: { relax_code: string };
  rest_record_submitted: {
    is_public: boolean;
    photo_source: 'file' | 'native';
    relax_code: string;
    tag_count: number;
  };
  rest_start_failed: {
    failure_reason: AnalyticsFailureReason;
    relax_code?: string;
  };
  rest_started: { relax_code: string };
  rest_state_invalid: {
    failure_reason: 'invalid_state';
    stage: 'activity' | 'loading' | 'recommendation' | 'record';
  };
  tab_selected: { tab: 'archive' | 'feed' | 'mypage' | 'rest' };
}

export type AnalyticsEventName = keyof AnalyticsEventMap;
type AnalyticsParamValue = boolean | number | string;
type AnalyticsParams = Record<string, AnalyticsParamValue>;

const ANALYTICS_PARAM_ALLOWLIST = new Set([
  'action',
  'contact_method',
  'document_type',
  'failure_reason',
  'filter_state',
  'filter_type',
  'is_public',
  'load_stage',
  'method',
  'mood_code',
  'photo_source',
  'platform',
  'position',
  'relax_code',
  'report_section',
  'result_count',
  'stage',
  'step',
  'surface',
  'tab',
  'tag_count',
  'time_code',
  'view_mode'
]);

const CLARITY_TAG_ALLOWLIST = new Set([
  'action',
  'failure_reason',
  'filter_state',
  'filter_type',
  'load_stage',
  'method',
  'mood_code',
  'photo_source',
  'platform',
  'relax_code',
  'report_section',
  'stage',
  'surface',
  'tab',
  'time_code',
  'view_mode'
]);

const CLARITY_EVENT_EXCLUSIONS = new Set<AnalyticsEventName>(['feed_card_impression']);

function getAnalyticsContext(): AnalyticsParams {
  const isApp = Boolean(window.ReactNativeWebView);
  const isAndroid = isApp && /Android/i.test(window.navigator?.userAgent ?? '');

  return {
    platform: isApp ? (isAndroid ? 'android' : 'ios') : 'web',
    surface: isApp ? 'app' : 'web'
  };
}

function sanitizeParams(params: Record<string, unknown>): AnalyticsParams {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([key, value]) =>
        ANALYTICS_PARAM_ALLOWLIST.has(key) &&
        (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string')
    )
  ) as AnalyticsParams;
}

function trackClarityEvent(name: AnalyticsEventName, params: AnalyticsParams) {
  if (!window.clarity || CLARITY_EVENT_EXCLUSIONS.has(name)) return;

  for (const [key, value] of Object.entries(params)) {
    if (CLARITY_TAG_ALLOWLIST.has(key)) {
      window.clarity('set', key, String(value));
    }
  }
  window.clarity('event', name);
}

type TrackEventArgs<Name extends AnalyticsEventName> = keyof AnalyticsEventMap[Name] extends never
  ? [params?: AnalyticsEventMap[Name]]
  : [params: AnalyticsEventMap[Name]];

/**
 * Sends a typed, allowlisted event to GA4 and Clarity. Clarity receives only
 * low-cardinality custom tags and intentionally skips high-volume impressions.
 * User-entered text, user/activity/feed identifiers, photos, and URLs are not allowed.
 */
export function trackEvent<Name extends AnalyticsEventName>(
  name: Name,
  ...[params]: TrackEventArgs<Name>
) {
  if (typeof window === 'undefined') return;

  const safeParams = sanitizeParams({ ...getAnalyticsContext(), ...(params ?? {}) });
  window.gtag?.('event', name, safeParams);
  trackClarityEvent(name, safeParams);
}

export function getAnalyticsFailureReason(error: unknown): AnalyticsFailureReason {
  if (error instanceof DOMException && error.name === 'AbortError') return 'aborted';
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return 'network_error';
  if (!error || typeof error !== 'object') return 'unknown';

  const candidate = error as {
    code?: unknown;
    message?: unknown;
    response?: { status?: unknown };
  };
  const status = candidate.response?.status;
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not_found';
  if (status === 429) return 'rate_limited';
  if (typeof status === 'number' && status >= 500) return 'server_error';
  if (typeof status === 'number' && status >= 400) return 'client_error';
  if (candidate.code === 'ERR_NETWORK') return 'network_error';
  if (candidate.message === 'SESSION_EXPIRED') return 'session_expired';

  return 'unknown';
}

export function toRelaxCode(relaxId: number) {
  return `relax_${relaxId}`;
}

export function toLoginMethod(provider: string): LoginMethod {
  const method = provider.toLowerCase();
  if (method === 'apple' || method === 'google' || method === 'kakao') return method;

  return 'unknown';
}
