export const PRODUCTION_ANALYTICS_HOSTNAME = 'comma-front-web.vercel.app';

const OAUTH_CALLBACK_PATH = /^\/oauth\/(?:apple|google|kakao)\/callback\/?$/;

interface AnalyticsPageContext {
  hostname: string;
  isProduction: boolean;
  pathname: string;
  search: string;
}

export function isAnalyticsPageAllowed({
  hostname,
  isProduction,
  pathname,
  search
}: AnalyticsPageContext) {
  return (
    isProduction &&
    hostname === PRODUCTION_ANALYTICS_HOSTNAME &&
    !(OAUTH_CALLBACK_PATH.test(pathname) && search.length > 0)
  );
}

export function shouldInitializeAnalytics() {
  if (typeof window === 'undefined') return false;

  return isAnalyticsPageAllowed({
    hostname: window.location.hostname,
    isProduction: import.meta.env.PROD,
    pathname: window.location.pathname,
    search: window.location.search
  });
}
