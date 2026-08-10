const BLOCKED_PATHS = new Set([
  '/loading',
  '/oauth/kakao/callback',
  '/oauth/google/callback',
  '/oauth/apple/callback'
]);

export type NativeBackHandler = () => boolean;

export const isNativeBackBlockedPath = (pathname: string) => BLOCKED_PATHS.has(pathname);

export const runNativeBackHandlers = (handlers: NativeBackHandler[]) =>
  [...handlers].reverse().some((handler) => handler());
