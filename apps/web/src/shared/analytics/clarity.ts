import { shouldInitializeAnalytics } from './config';

const CLARITY_PROJECT_ID = 'y5yal8g5el';

type ClarityCommand = (...args: unknown[]) => void;

declare global {
  interface Window {
    clarity?: ClarityCommand & { q?: unknown[][] };
  }
}

export function initializeClarity() {
  if (!shouldInitializeAnalytics() || window.clarity) return;

  const clarity: ClarityCommand & { q?: unknown[][] } = (...args) => {
    clarity.q ??= [];
    clarity.q.push(args);
  };

  window.clarity = clarity;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;

  document.head.appendChild(script);
}
