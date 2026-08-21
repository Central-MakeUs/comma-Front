import { describe, expect, it } from 'vitest';
import { getIosAppleLoginMode, shouldUseNativeLogin } from './loginPolicy';

describe('login policy', () => {
  it('defaults iOS Apple login to review mode', () => {
    expect(getIosAppleLoginMode(undefined)).toBe('review');
    expect(getIosAppleLoginMode('false\n')).toBe('review');
    expect(getIosAppleLoginMode('review')).toBe('review');
  });

  it('accepts native mode without depending on surrounding whitespace', () => {
    expect(getIosAppleLoginMode(' native\n')).toBe('native');
  });

  it('uses web OAuth only for iOS Apple in review mode', () => {
    const common = {
      isMobileWebView: true,
      isIosApp: true,
      iosAppleLoginMode: 'review' as const
    };

    expect(shouldUseNativeLogin({ ...common, provider: 'APPLE' })).toBe(false);
    expect(shouldUseNativeLogin({ ...common, provider: 'GOOGLE' })).toBe(true);
    expect(shouldUseNativeLogin({ ...common, provider: 'KAKAO' })).toBe(true);
  });

  it('uses native Apple login on iOS in native mode', () => {
    expect(
      shouldUseNativeLogin({
        isMobileWebView: true,
        isIosApp: true,
        iosAppleLoginMode: 'native',
        provider: 'APPLE'
      })
    ).toBe(true);
  });
});
