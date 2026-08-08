type LayoutShiftEntry = PerformanceEntry & {
  value: number;
  hadRecentInput: boolean;
};

type LargestContentfulPaintEntry = PerformanceEntry & {
  element?: Element;
  url?: string;
  size?: number;
};

const VITALS_FLAG = 'vitals';
const VITALS_STORAGE_KEY = 'comma.debugVitals';

function shouldLogVitals() {
  if (typeof window === 'undefined') return false;

  const params = new URLSearchParams(window.location.search);

  return (
    params.get(VITALS_FLAG) === '1' || window.localStorage.getItem(VITALS_STORAGE_KEY) === 'true'
  );
}

function logMetric(name: string, value: number, detail?: unknown) {
  console.info(`[web-vitals] ${name}`, Math.round(value), detail ?? '');
}

export function initWebVitalsDebug() {
  if (!shouldLogVitals() || typeof PerformanceObserver === 'undefined') return;

  try {
    const navigation = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;

    if (navigation) {
      logMetric('TTFB', navigation.responseStart);
    }
  } catch (error) {
    console.warn('[web-vitals] failed to read navigation timing', error);
  }

  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          logMetric('FCP', entry.startTime);
        }
      }
    }).observe({ type: 'paint', buffered: true });
  } catch (error) {
    console.warn('[web-vitals] failed to observe paint', error);
  }

  try {
    new PerformanceObserver((list) => {
      const entries = list.getEntries() as LargestContentfulPaintEntry[];
      const entry = entries[entries.length - 1];

      if (!entry) return;

      logMetric('LCP', entry.startTime, {
        element: entry.element?.tagName,
        url: entry.url,
        size: entry.size,
        text: entry.element?.textContent?.trim().slice(0, 80)
      });
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (error) {
    console.warn('[web-vitals] failed to observe LCP', error);
  }

  try {
    let cls = 0;

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as LayoutShiftEntry[]) {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      }

      console.info('[web-vitals] CLS', cls);
    }).observe({ type: 'layout-shift', buffered: true });
  } catch (error) {
    console.warn('[web-vitals] failed to observe CLS', error);
  }
}
