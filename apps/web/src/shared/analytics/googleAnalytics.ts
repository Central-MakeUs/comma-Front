import { shouldInitializeAnalytics } from './config';

const GOOGLE_ANALYTICS_MEASUREMENT_ID = 'G-JF6CY7782Q';
const CONSENT_REQUIRED_REGIONS = [
  'AT',
  'BE',
  'BG',
  'CH',
  'CY',
  'CZ',
  'DE',
  'DK',
  'EE',
  'ES',
  'FI',
  'FR',
  'GB',
  'GR',
  'HR',
  'HU',
  'IE',
  'IS',
  'IT',
  'LI',
  'LT',
  'LU',
  'LV',
  'MT',
  'NL',
  'NO',
  'PL',
  'PT',
  'RO',
  'SE',
  'SI',
  'SK'
];

type GtagCommand = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: IArguments[];
    gtag?: GtagCommand;
  }
}

export function initializeGoogleAnalytics() {
  if (!shouldInitializeAnalytics() || window.gtag) return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    // biome-ignore lint/complexity/noArguments: Google requires the official gtag.js arguments queue shape
    window.dataLayer?.push(arguments);
  };

  window.gtag('consent', 'default', {
    ad_personalization: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    analytics_storage: 'granted'
  });
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    region: CONSENT_REQUIRED_REGIONS
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', GOOGLE_ANALYTICS_MEASUREMENT_ID);
}
