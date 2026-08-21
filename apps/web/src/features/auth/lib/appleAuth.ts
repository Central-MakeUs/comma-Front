export const isAppleLoginCancelled = (error: unknown) =>
  typeof error === 'object' &&
  error !== null &&
  'error' in error &&
  error.error === 'user_cancelled_authorize';
