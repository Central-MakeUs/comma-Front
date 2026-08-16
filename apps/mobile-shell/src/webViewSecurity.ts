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
