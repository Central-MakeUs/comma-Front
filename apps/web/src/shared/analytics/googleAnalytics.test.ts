import { afterEach, describe, expect, it, vi } from 'vitest';
import { shouldInitializeAnalytics } from './config';
import { initializeGoogleAnalytics } from './googleAnalytics';

vi.mock('./config', () => ({
  shouldInitializeAnalytics: vi.fn()
}));

afterEach(() => {
  vi.mocked(shouldInitializeAnalytics).mockReset();
  vi.unstubAllGlobals();
});

describe('initializeGoogleAnalytics', () => {
  it('does not create the tag when analytics is blocked', () => {
    const createElement = vi.fn();
    vi.mocked(shouldInitializeAnalytics).mockReturnValue(false);
    vi.stubGlobal('window', {});
    vi.stubGlobal('document', { createElement });

    initializeGoogleAnalytics();

    expect(createElement).not.toHaveBeenCalled();
  });

  it('queues consent defaults before the GA configuration', () => {
    const appendChild = vi.fn();
    vi.mocked(shouldInitializeAnalytics).mockReturnValue(true);
    vi.stubGlobal('window', { dataLayer: [] });
    vi.stubGlobal('document', {
      createElement: vi.fn(() => ({ async: false, src: '' })),
      head: { appendChild }
    });

    initializeGoogleAnalytics();

    const commands = window.dataLayer?.map((args) => Array.from(args));
    expect(commands?.[0]).toEqual([
      'consent',
      'default',
      {
        ad_personalization: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        analytics_storage: 'granted'
      }
    ]);
    expect(commands?.[1]).toEqual([
      'consent',
      'default',
      expect.objectContaining({ analytics_storage: 'denied', region: expect.any(Array) })
    ]);
    expect(commands?.[2]?.[0]).toBe('js');
    expect(commands?.[3]).toEqual(['config', 'G-JF6CY7782Q']);
    expect(appendChild).toHaveBeenCalledOnce();
  });
});
