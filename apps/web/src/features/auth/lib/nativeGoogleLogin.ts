import { clearNativeGoogleOAuthState, consumeNativeGoogleOAuthState } from './oauthState';

export const GOOGLE_LOGIN_TIMEOUT_MS = 60_000;
export const GOOGLE_LOGIN_RECOVERY_TIMEOUT_MS = 10_000;

interface GoogleLoginMessage {
  type?: string;
  code?: string;
  redirectUri?: string;
  state?: string;
  error?: string;
}

export interface GoogleLoginResult {
  code: string;
  redirectUri: string;
}

export const waitForGoogleLogin = ({
  signal,
  timeoutMs = GOOGLE_LOGIN_TIMEOUT_MS
}: {
  signal?: AbortSignal;
  timeoutMs?: number;
} = {}): Promise<GoogleLoginResult> =>
  new Promise((resolve, reject) => {
    let isSettled = false;

    const removeListeners = () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('message', handleMessage as EventListener);
      signal?.removeEventListener('abort', handleAbort);
    };

    const finish = (callback: () => void) => {
      if (isSettled) return;

      isSettled = true;
      window.clearTimeout(timeoutId);
      removeListeners();
      callback();
    };

    const timeoutId = window.setTimeout(() => {
      finish(() => {
        clearNativeGoogleOAuthState();
        reject(new Error('구글 로그인 응답 시간이 초과되었습니다.'));
      });
    }, timeoutMs);

    function handleAbort() {
      finish(() => reject(new DOMException('Google login was cancelled.', 'AbortError')));
    }

    function handleMessage(event: MessageEvent) {
      let message: GoogleLoginMessage;

      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }

      if (message.type === 'GOOGLE_LOGIN_SUCCESS') {
        if (!consumeNativeGoogleOAuthState(message.state)) return;

        finish(() => resolve({ code: message.code ?? '', redirectUri: message.redirectUri ?? '' }));
        return;
      }

      if (message.type === 'GOOGLE_LOGIN_FAILED') {
        if (!consumeNativeGoogleOAuthState(message.state)) return;

        finish(() => reject(new Error(message.error ?? '구글 로그인 중 에러가 발생했습니다.')));
      }
    }

    window.addEventListener('message', handleMessage);
    document.addEventListener('message', handleMessage as EventListener);
    if (signal?.aborted) handleAbort();
    else signal?.addEventListener('abort', handleAbort, { once: true });
  });
