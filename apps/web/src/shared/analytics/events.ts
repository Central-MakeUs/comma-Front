export type AnalyticsEventName =
  | 'account_deletion_completed'
  | 'account_deletion_failed'
  | 'account_deletion_requested'
  | 'archive_view_changed'
  | 'checklist_step_completed'
  | 'feed_filter_applied'
  | 'feed_like_changed'
  | 'feed_reported'
  | 'feed_user_blocked'
  | 'legal_document_opened'
  | 'login'
  | 'login_attempt'
  | 'login_cancelled'
  | 'login_failed'
  | 'logout_completed'
  | 'logout_failed'
  | 'logout_requested'
  | 'nickname_edit_cancelled'
  | 'nickname_edit_completed'
  | 'nickname_edit_opened'
  | 'onboarding_completed'
  | 'photo_picker_opened'
  | 'photo_selected'
  | 'premium_alert_failed'
  | 'premium_alert_opened'
  | 'premium_alert_submitted'
  | 'recommendation_failed'
  | 'recommendation_received'
  | 'recommendation_requested'
  | 'recommendation_viewed'
  | 'reselection_cancelled'
  | 'reselection_confirmed'
  | 'reselection_opened'
  | 'rest_completed'
  | 'rest_completion_failed'
  | 'rest_record_started'
  | 'rest_record_submitted'
  | 'rest_start_failed'
  | 'rest_started'
  | 'tab_selected';

export type AnalyticsEventParams = Record<string, boolean | number | string>;

/**
 * Sends the same event name to GA4 and Clarity. Parameters are intentionally
 * sent only to GA4 because Clarity custom events accept a name, not a payload.
 * Never pass user-entered text, identifiers, mood answers, photos, or URLs here.
 */
export function trackEvent(name: AnalyticsEventName, params?: AnalyticsEventParams) {
  if (typeof window === 'undefined') return;

  window.gtag?.('event', name, params ?? {});
  window.clarity?.('event', name);
}
