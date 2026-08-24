import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAnalyticsFailureReason, trackEvent } from './events';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('trackEvent', () => {
  it('adds web context to GA4 and sends only allowlisted tags to Clarity', () => {
    const gtag = vi.fn();
    const clarity = vi.fn();
    vi.stubGlobal('window', { clarity, gtag, navigator: { userAgent: 'Mozilla/5.0' } });

    trackEvent('rest_completed', { is_public: true, relax_code: 'relax_7' });

    expect(gtag).toHaveBeenCalledWith('event', 'rest_completed', {
      is_public: true,
      platform: 'web',
      relax_code: 'relax_7',
      surface: 'web'
    });
    expect(clarity).toHaveBeenCalledWith('set', 'platform', 'web');
    expect(clarity).toHaveBeenCalledWith('set', 'surface', 'web');
    expect(clarity).toHaveBeenCalledWith('set', 'relax_code', 'relax_7');
    expect(clarity).toHaveBeenCalledWith('event', 'rest_completed');
    expect(clarity).not.toHaveBeenCalledWith('set', 'is_public', 'true');
  });

  it('adds Android app context without requiring event parameters', () => {
    const gtag = vi.fn();
    const clarity = vi.fn();
    vi.stubGlobal('window', {
      ReactNativeWebView: {},
      clarity,
      gtag,
      navigator: { userAgent: 'Android' }
    });

    trackEvent('checklist_started');

    expect(gtag).toHaveBeenCalledWith('event', 'checklist_started', {
      platform: 'android',
      surface: 'app'
    });
    expect(clarity).toHaveBeenCalledWith('event', 'checklist_started');
  });

  it('does not send high-volume feed impressions to Clarity', () => {
    const gtag = vi.fn();
    const clarity = vi.fn();
    vi.stubGlobal('window', { clarity, gtag, navigator: { userAgent: 'Mozilla/5.0' } });

    trackEvent('feed_card_impression', { position: 2 });

    expect(gtag).toHaveBeenCalledOnce();
    expect(clarity).not.toHaveBeenCalled();
  });

  it('drops identifiers and user text even when an unsafe object bypasses TypeScript', () => {
    const gtag = vi.fn();
    vi.stubGlobal('window', { gtag, navigator: { userAgent: 'Mozilla/5.0' } });

    trackEvent('feed_reported', {
      feed_id: 12,
      nickname: 'private nickname',
      review: 'private review'
    } as never);

    expect(gtag).toHaveBeenCalledWith('event', 'feed_reported', {
      platform: 'web',
      surface: 'web'
    });
  });
});

describe('getAnalyticsFailureReason', () => {
  it.each([
    [401, 'unauthorized'],
    [403, 'forbidden'],
    [404, 'not_found'],
    [429, 'rate_limited'],
    [500, 'server_error'],
    [422, 'client_error']
  ] as const)('maps HTTP %s to %s', (status, expected) => {
    expect(getAnalyticsFailureReason({ response: { status } })).toBe(expected);
  });

  it('maps network errors without exposing their message', () => {
    expect(getAnalyticsFailureReason({ code: 'ERR_NETWORK' })).toBe('network_error');
  });
});
