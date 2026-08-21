import { afterEach, describe, expect, it, vi } from 'vitest';
import { trackEvent } from './events';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('trackEvent', () => {
  it('sends the same event to GA4 and Clarity without forwarding parameters to Clarity', () => {
    const gtag = vi.fn();
    const clarity = vi.fn();
    vi.stubGlobal('window', { clarity, gtag });

    trackEvent('rest_completed', { is_public: true });

    expect(gtag).toHaveBeenCalledWith('event', 'rest_completed', { is_public: true });
    expect(clarity).toHaveBeenCalledWith('event', 'rest_completed');
  });

  it('queues an empty parameter object for events without parameters', () => {
    const gtag = vi.fn();
    const clarity = vi.fn();
    vi.stubGlobal('window', { clarity, gtag });

    trackEvent('recommendation_requested');

    expect(gtag).toHaveBeenCalledWith('event', 'recommendation_requested', {});
    expect(clarity).toHaveBeenCalledWith('event', 'recommendation_requested');
  });
});
