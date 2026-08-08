export const APPLE_AUTH_ORIGINS = ['https://appleid.apple.com'] as const;

const appleAuthOrigins = new Set<string>(APPLE_AUTH_ORIGINS);
const webOAuthCallbackPaths = new Set(['/oauth/kakao/callback', '/oauth/google/callback']);

const hasOrigin = (url: string, expectedOrigin: string) => {
  try {
    return new URL(url).origin === expectedOrigin;
  } catch {
    return false;
  }
};

export const isAllowedWebViewUrl = (url: string, webOrigin: string) =>
  url === 'about:blank' || hasOrigin(url, webOrigin);

export const isTrustedWebViewMessageUrl = hasOrigin;

export const isExternalBrowserUrl = (url: string) => {
  try {
    const protocol = new URL(url).protocol;
    return protocol === 'https:' || protocol === 'http:';
  } catch {
    return false;
  }
};

export const isAppleAuthUrl = (url: string) => {
  try {
    return appleAuthOrigins.has(new URL(url).origin);
  } catch {
    return false;
  }
};

export const isWebOAuthCallbackUrl = (url: string, webOrigin: string) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.origin === webOrigin && webOAuthCallbackPaths.has(parsedUrl.pathname);
  } catch {
    return false;
  }
};
